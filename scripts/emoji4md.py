#!/usr/bin/env python3
import argparse
import re
from pathlib import Path
from random import Random


EMOJI_GROUPS = {
    'happy': ['😀', '😁', '😂', '😃', '😄', '😅', '😆', '😇', '😉', '😊', '🙂', '🙃', '🤣', '🫠'],
    'love': ['☺️', '😍', '😗', '😘', '😙', '😚', '🤩', '🥰', '🥲'],
    'tongue': ['😋', '😛', '😜', '😝', '🤑', '🤪'],
    'hand': ['🤔', '🤗', '🤫', '🤭', '🫡', '🫢', '🫣'],
    'calm': ['😏', '😐', '😑', '😒', '😬', '😶', '🙄', '🤐', '🤥', '🤨', '🫥', '🫨'],
    'sleepy': ['😌', '😔', '😪', '😴', '🤤'],
    'seek': ['😵', '😷', '🤒', '🤕', '🤢', '🤧', '🤮', '🤯', '🥴', '🥵', '🥶'],
    'hat': ['🤠', '🥳', '🥸'],
    'glass': ['😎', '🤓', '🧐'],
    'worry': ['☹️', '😓', '😕', '😖', '😞', '😟', '😢', '😣', '😥', '😦', '😧', '😨', '😩', '😫', '😭', '😮', '😯', '😰', '😱', '😲', '😳', '🙁', '🥱', '🥹', '🥺', '🫤'],
    'angry': ['☠️', '👿', '💀', '😈', '😠', '😡', '😤', '🤬'],
    'monster': ['👹', '👺', '👻', '👽', '👾', '💩', '🤖', '🤡'],
    'cat': ['😸', '😹', '😺', '😻', '😼', '😽', '😾', '😿', '🙀'],
    'monkey': ['🙈', '🙉', '🙊'],
}
ALL_EMOJIS = [emoji for group in EMOJI_GROUPS.values() for emoji in group]
EMOJI_PREFIX_RE = re.compile(r'^(\S+)\s+(.+)$')
HEADING_RE = re.compile(r'^(#{1,6})\s+(.+)$', re.MULTILINE)
LINK_RE = re.compile(r'(?<!!)(\[([^\]]+)\]\(([^)]+)\))')
DEFAULT_SINGLE_FILE = Path('emoji4md/test.md')
DEFAULT_ROOT_DIR = Path(__file__).resolve().parent.parent


class EmojiPicker:
    def __init__(self, emojis=None, seed=None):
        self._emojis = list(emojis or ALL_EMOJIS)
        if not self._emojis:
            raise ValueError('Emoji list is empty.')
        self._random = Random(seed)

    def pick(self):
        return self._random.choice(self._emojis)


def has_emoji_prefix(text):
    match = EMOJI_PREFIX_RE.match(text.strip())
    if not match:
        return False, text.strip()

    prefix, remainder = match.groups()
    if prefix in ALL_EMOJIS:
        return True, remainder.strip()
    return False, text.strip()


def add_emojis_to_text(content, replace_existing=False, picker=None):
    emoji_picker = picker or EmojiPicker()

    def replace_link(match):
        full_match, label, url = match.groups()
        has_emoji, clean_label = has_emoji_prefix(label)
        if has_emoji and not replace_existing:
            return full_match
        return f'[{emoji_picker.pick()} {clean_label}]({url})'

    lines = content.split('\n')
    in_code_block = False
    new_lines = []

    heading_re_single = re.compile(r'^(#{1,6})\s+(.+)$')

    for line in lines:
        stripped = line.strip()
        if stripped.startswith('```') or stripped.startswith('~~~'):
            in_code_block = not in_code_block
            new_lines.append(line)
            continue

        if not in_code_block:
            heading_match = heading_re_single.match(line)
            if heading_match:
                hashes, title = heading_match.groups()
                has_emoji, clean_title = has_emoji_prefix(title)
                if has_emoji and not replace_existing:
                    new_lines.append(f'{hashes} {title.strip()}')
                else:
                    new_lines.append(f'{hashes} {emoji_picker.pick()} {clean_title}')
                continue
            else:
                line = LINK_RE.sub(replace_link, line)
                
        new_lines.append(line)

    return '\n'.join(new_lines)


def process_markdown_file(file_path, replace_existing=False, picker=None):
    source_path = Path(file_path)
    content = source_path.read_text(encoding='utf-8')
    
    def clean_heading(match):
        hashes, title = match.groups()
        has_emoji, clean_title = has_emoji_prefix(title)
        if has_emoji:
            return f'{hashes} {clean_title}'
        return match.group(0)
        
    cleaned_content = HEADING_RE.sub(clean_heading, content)
    updated_content = add_emojis_to_text(cleaned_content, replace_existing=replace_existing, picker=picker)

    if updated_content == content:
        print(f'= No changes: {source_path.as_posix()}')
        return False

    source_path.write_text(updated_content, encoding='utf-8')
    print(f'+ Updated: {source_path.as_posix()}')
    return True


def iter_markdown_files(root_dir):
    root_path = Path(root_dir)
    if not root_path.exists():
        raise FileNotFoundError(f'Root directory does not exist: {root_path}')

    for markdown_file in sorted(root_path.rglob('*.md')):
        if markdown_file.is_file():
            yield markdown_file


def process_all_markdown_files(root_dir, replace_existing=False, seed=None):
    markdown_files = list(iter_markdown_files(root_dir))
    if not markdown_files:
        print(f'! No markdown files found under {Path(root_dir).as_posix()}')
        return 0

    updated_count = 0
    for markdown_file in markdown_files:
        if process_markdown_file(markdown_file, replace_existing=replace_existing, picker=EmojiPicker(seed=seed)):
            updated_count += 1

    print(f'Processed {len(markdown_files)} markdown files, updated {updated_count}.')
    return updated_count


def parse_args():
    parser = argparse.ArgumentParser(description='Add emoji prefixes to markdown headings and links.')
    parser.add_argument('-m', '--markdown-path', type=Path, default=DEFAULT_SINGLE_FILE, help='Path to a markdown file.')
    parser.add_argument('-r', '--replace-existing', action='store_true', help='Replace an existing emoji prefix.')
    parser.add_argument('--all', action='store_true', help='Process all markdown files under the root directory.')
    parser.add_argument('--root-dir', type=Path, default=DEFAULT_ROOT_DIR, help='Root directory used with --all.')
    parser.add_argument('--seed', type=int, default=None, help='Seed for deterministic emoji selection.')
    return parser.parse_args()


def main():
    args = parse_args()
    if args.all:
        process_all_markdown_files(args.root_dir, replace_existing=args.replace_existing, seed=args.seed)
        return

    if not args.markdown_path.exists():
        raise FileNotFoundError(f'Markdown file does not exist: {args.markdown_path}')

    process_markdown_file(args.markdown_path, replace_existing=args.replace_existing, picker=EmojiPicker(seed=args.seed))


if __name__ == '__main__':
    main()
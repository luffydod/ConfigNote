import re
import random
from emojis import Emoji

def add_emojis_to_md(file_path, replace_existing=False):
    emoji = Emoji()  # 使用默认的 Emoji 列表

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 添加 Emoji 到标题（如 #、##、### 等）
    def replace_heading(match):
        hashes = match.group(1)
        title = match.group(2).strip()
        # 检查标题是否已有emoji
        emoji_match = re.match(r'^([\U0001F300-\U0001FAFF]+\s+)(.+)', title)
        if emoji_match:
            # 如果有emoji且replace_existing为True，则替换emoji
            if replace_existing:
                return f'{hashes} {emoji.get_emoji()} {emoji_match.group(2)}'
            # 否则保持原样
            return f'{hashes} {title}'
        # 没有emoji，添加新的
        return f'{hashes} {emoji.get_emoji()} {title}'

    content = re.sub(r'^(#{1,6})\s+(.+)', replace_heading, content, flags=re.MULTILINE)

    # 添加 Emoji 到链接描述（[text](url)）
    def replace_link(match):
        desc = match.group(1)
        url = match.group(2)
        # 检查描述是否已有emoji
        emoji_match = re.match(r'^([\U0001F300-\U0001FAFF]+\s+)(.+)', desc)
        if emoji_match:
            # 如果有emoji且replace_existing为True，则替换emoji
            if replace_existing:
                return f'[{emoji.get_emoji()} {emoji_match.group(2)}]({url})'
            # 否则保持原样
            return f'[{desc}]({url})'
        # 没有emoji，添加新的
        return f'[{emoji.get_emoji()} {desc}]({url})'

    content = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', replace_link, content)

    # 保存或打印输出
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✅ Emoji 已成功添加到：{file_path}")

# 例子：调用
if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='为 Markdown 文件添加 Emoji')
    parser.add_argument('-md', '--markdown_path', type=str, default='emoji4md/test.md', help='Markdown 文件路径')
    parser.add_argument('-r', '--replace_existing', action='store_true', help='是否替换已有的 Emoji')

    args = parser.parse_args()
    if not args.markdown_path:
        raise ValueError("请提供 Markdown 文件路径")
    add_emojis_to_md(args.markdown_path, replace_existing=args.replace_existing)

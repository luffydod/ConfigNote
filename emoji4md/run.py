import re
import random
from emojis import Emoji

def add_emojis_to_md(file_path):
    emoji = Emoji()  # 使用默认的 Emoji 列表

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 添加 Emoji 到标题（如 #、##、### 等）
    def replace_heading(match):
        hashes = match.group(1)
        title = match.group(2).strip()
        # 如果已有 emoji 就跳过
        if re.match(r'^[\U0001F300-\U0001FAFF]', title):
            return f'{hashes} {title}'
        return f'{hashes} {emoji.get_emoji()} {title}'

    content = re.sub(r'^(#{1,6})\s+(.+)', replace_heading, content, flags=re.MULTILINE)

    # 添加 Emoji 到链接描述（[text](url)）
    def replace_link(match):
        desc = match.group(1)
        url = match.group(2)
        # 如果描述开头已有 emoji 就跳过
        if re.match(r'^[\U0001F300-\U0001FAFF]', desc):
            return f'[{desc}]({url})'
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

    args = parser.parse_args()
    if not args.markdown_path:
        raise ValueError("请提供 Markdown 文件路径")
    add_emojis_to_md(args.markdown_path)

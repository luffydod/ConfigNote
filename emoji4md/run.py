import re
import random
import os
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

def scan_and_process_all_md_files(root_dir, replace_existing=False):
    """递归扫描指定目录下的所有 .md 文件，并为它们添加 emoji"""
    if not os.path.exists(root_dir):
        print(f"❌ 错误：目录 {root_dir} 不存在")
        return
        
    md_files = []
    # 递归查找所有 .md 文件
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.md'):
                md_files.append(os.path.join(root, file))
    
    if not md_files:
        print(f"⚠️  在目录 {root_dir} 中未找到任何 .md 文件")
        return
    
    print(f"🔍 在目录 {root_dir} 中找到 {len(md_files)} 个 .md 文件")
    print("开始处理文件...")
    
    processed_count = 0
    error_count = 0
    
    for md_file in md_files:
        try:
            print(f"📝 正在处理：{md_file}")
            add_emojis_to_md(md_file, replace_existing=replace_existing)
            processed_count += 1
        except Exception as e:
            print(f"❌ 处理文件 {md_file} 时出错：{str(e)}")
            error_count += 1
    
    print(f"\n🎉 处理完成！")
    print(f"✅ 成功处理：{processed_count} 个文件")
    if error_count > 0:
        print(f"❌ 处理失败：{error_count} 个文件")

# 例子：调用
if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='为 Markdown 文件添加 Emoji')
    parser.add_argument('-md', '--markdown_path', type=str, default='emoji4md/test.md', help='Markdown 文件路径')
    parser.add_argument('-r', '--replace_existing', action='store_true', help='是否替换已有的 Emoji')
    parser.add_argument('--all', action='store_true', help='启用时处理根目录下的所有 .md 文件')
    parser.add_argument('--root_dir', type=str, default='.', help='项目根目录路径（与 --all 参数配合使用）')

    args = parser.parse_args()
    
    if args.all:
        # 递归处理所有 .md 文件
        print(f"🚀 启用批量处理模式，根目录：{args.root_dir}")
        scan_and_process_all_md_files(args.root_dir, replace_existing=args.replace_existing)
    else:
        # 处理单个文件
        if not args.markdown_path:
            raise ValueError("请提供 Markdown 文件路径")
        print(f"🚀 启用单文件处理模式")
        add_emojis_to_md(args.markdown_path, replace_existing=args.replace_existing)

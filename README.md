# ConfigNote

> 📚 整理日常开发过程中高频使用的工具配置指南，沉淀可复用的开发环境配置方案。

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue?logo=github)](https://luffydod.github.io/ConfigNote)

## 🔄 维护与更新

本项目由个人持续维护中^_^

### 自动更新生成内容

仓库已支持 GitHub Actions 自动执行 scripts/emoji4md.py 和 scripts/update_notes.py。

当 main 分支收到代码推送时，工作流会先规范 Markdown 中缺失的 emoji 前缀，再刷新 assets/js/config.js；如果生成内容有变化，会由 Actions 自动提交回仓库。

工作流文件见 [.github/workflows/update-notes.yml](.github/workflows/update-notes.yml)。

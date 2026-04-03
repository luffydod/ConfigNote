# ConfigNote

> 📚 整理日常开发过程中高频使用的工具配置指南，沉淀可复用的开发环境配置方案。

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue?logo=github)](https://luffydod.github.io/ConfigNote)

## 🔄 维护与更新
本项目由个人持续维护中^_^

### 自动更新 config.js
仓库已支持 GitHub Actions 自动执行 scripts/update_notes.py。

当 main 分支收到代码推送时，工作流会自动运行脚本并检查 assets/js/config.js 是否有变化；如果有变化，会由 Actions 自动提交回仓库。

工作流文件见 [.github/workflows/update-notes.yml](.github/workflows/update-notes.yml)。
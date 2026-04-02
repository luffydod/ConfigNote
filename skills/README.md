# Agent Skills

本目录用于整理和维护可复用的 agent skill 文档，既包含当前仓库内已经沉淀的技能，也包含两类参考资料：

- Agent Skills 通用开放标准的官方介绍
- Cursor 对 Agent Skills 的产品化补充说明

这样在本仓库扩展 skill 时，可以同时参考标准层面的定义，以及具体 agent 产品的落地方式。

## 本目录的技能

- [ros2-base](./ros2_skills/ros2_base.md)
- [ros2-web-integration](./ros2_skills/ros2_web_integration_skill.md)

## Agent Skills 官方介绍

### Documentation Index

官方文档索引地址：<https://agentskills.io/llms.txt>

建议把这个索引当作 Agent Skills 文档的总入口。在继续查阅规范、最佳实践或接入方式前，先读取该文件，可以快速发现官方当前提供的页面，例如：

- Overview
- What are skills?
- Specification
- Quickstart
- Best practices for skill creators
- Evaluating skill output quality
- Optimizing skill descriptions
- How to add skills support to your agent

### Overview

Agent Skills 是一种简单、开放的格式，用来为智能体提供新的能力和专业知识。

官方对它的定义可以概括为：把说明、脚本和资源组织成一个可被 agent 发现并按需加载的目录，让 agent 在执行任务时获得更准确的流程知识、领域知识和操作能力。

换句话说，Agent Skills 并不是单纯的一段提示词，而是一个可版本化、可迁移、可复用的能力包。

### 为什么需要 Agent Skills

随着 agent 能力增强，真正限制执行质量的往往不是模型本身，而是上下文不足。Agent Skills 主要解决以下问题：

- 缺少稳定的流程知识：把多步骤任务固化为可重复执行的工作流。
- 缺少领域知识：把团队、公司或个人的专业经验以结构化形式提供给 agent。
- 缺少可移植性：同一套 skill 可以在多个兼容产品之间复用，而不是绑定到单一工具。

### Agent Skills 能做什么

根据官方说明，Agent Skills 主要可以带来四类价值：

- 领域专长：把法律审阅、数据分析、ROS 集成这类专业知识封装成可复用说明。
- 新能力扩展：为 agent 增加新能力，例如生成演示文稿、构建 MCP Server、分析数据集等。
- 可重复工作流：把复杂任务整理成一致、可审计的执行流程。
- 跨工具互操作：同一个 skill 可以被不同的 skills-compatible agent 产品采用。

### 对不同角色的意义

- 对 skill 作者：一次构建，多处部署，把能力封装后复用到多个 agent 产品。
- 对兼容 Agent Skills 的工具：用户可以开箱即用地为 agent 增加新能力。
- 对团队和企业：可以把组织知识沉淀为可版本控制、可共享、可审查的能力包。

### 生态与开放性

官方文档明确强调，Agent Skills 已被多种 AI 开发工具和 agent 产品支持，目标是形成一个开放生态，而不是某个单一平台的私有格式。

该格式最初由 Anthropic 推动并以开放标准形式发布，目前已经被越来越多的 agent 产品采纳。官方也公开维护社区讨论渠道：

- GitHub：<https://github.com/agentskills/agentskills>
- Discord：<https://discord.gg/MKPE9g8aUy>

### 推荐阅读顺序

如果你准备在本仓库继续补充或编写 skills，建议按下面顺序阅读官方资料：

1. 先读 Documentation Index，了解完整文档结构。
2. 再读 What are skills? 和 Overview，建立统一概念。
3. 接着读 Specification，确认格式要求。
4. 如果要亲自编写 skill，继续看 Quickstart 和 Best practices。
5. 如果要让自己的 agent 或工具支持 skills，再看 How to add skills support to your agent。

## Cursor 对 Agent Skills 的补充说明

Cursor 将 Agent Skills 视为一项开放标准，但在具体使用层面，补充了技能发现、目录约定、显式调用和迁移规则等工程化细节。这些内容对实际落地很有参考价值。

### Cursor 如何定义技能

按照 Cursor 的说明，Skill 是一个可移植、可版本控制、可操作、并且支持按需加载的能力包：

- 可移植：适用于任何支持 Agent Skills 标准的 agent。
- 受版本控制：技能以文件形式保存在仓库中，变更可以被追踪，也可以通过 GitHub 仓库分发。
- 可操作：技能不只包含文字说明，还可以包含脚本、模板、参考资料和静态资源。
- 渐进式：资源按需加载，只有在任务相关时才会进入上下文，更节省上下文窗口。

### Cursor 中技能的工作原理

Cursor 启动后会自动扫描技能目录，发现可用 skills，并把它们提供给 agent。agent 会结合当前上下文决定何时自动调用某个 skill。

除了自动调用，Cursor 也支持在 Agent 对话中输入 / 并搜索技能名称，手动显式调用某个 skill。

### 技能目录

Cursor 文档列出的自动加载目录如下：

| 位置 | 作用域 |
| --- | --- |
| .agents/skills/ | 项目级 |
| .cursor/skills/ | 项目级 |
| ~/.cursor/skills/ | 用户级 |

为了兼容其他生态，Cursor 还会从以下目录发现技能：

- .claude/skills/
- .codex/skills/
- ~/.claude/skills/
- ~/.codex/skills/

一个最小 skill 的目录结构通常如下：

```text
.agents/
└── skills/
    └── my-skill/
        └── SKILL.md
```

如果 skill 需要脚本、参考资料或静态资源，可以扩展为：

```text
.agents/
└── skills/
    └── deploy-app/
        ├── SKILL.md
        ├── scripts/
        │   ├── deploy.sh
        │   └── validate.py
        ├── references/
        │   └── REFERENCE.md
        └── assets/
            └── config-template.json
```

### SKILL.md 文件格式

Cursor 明确要求每个 skill 以带 YAML frontmatter 的 SKILL.md 文件定义，例如：

```md
---
name: my-skill
description: 简要描述此技能的功能及使用时机。
---
# 我的技能
为 Agent 提供的详细指令。

## 使用时机
- 在以下情况使用此技能...
- 此技能适用于...

## 指令
- 为 Agent 提供的分步指导
- 特定领域的约定
- 最佳实践和模式
- 如需向用户澄清需求，请使用提问工具
```

### Frontmatter 字段

Cursor 文档中提到的主要字段如下：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| name | Yes | 技能标识符，仅限小写字母、数字和连字符，且必须与父文件夹名称一致。 |
| description | Yes | 描述技能用途和适用场景，供 agent 判断是否相关。 |
| license | No | 许可证名称，或引用随附许可证文件。 |
| compatibility | No | 运行环境要求，例如系统软件包、网络访问等。 |
| metadata | No | 附加元数据的键值映射。 |
| disable-model-invocation | No | 设为 true 时，skill 仅能通过显式输入 /skill-name 调用，不参与自动匹配。 |

### 禁用自动调用

默认情况下，agent 会在判断某个 skill 与当前任务相关时自动应用它。

如果把 disable-model-invocation 设为 true，该 skill 就会更像传统 slash command，只有当用户在对话里显式输入 /skill-name 时才会进入上下文。这适合那些不应该被自动触发、但又希望保留手动调用入口的技能。

### 在技能中包含脚本

Cursor 支持在 skill 中放置 scripts/ 目录，并在 SKILL.md 中用相对路径引用这些脚本。例如：

```md
---
name: deploy-app
description: 将应用部署到预发布或生产环境。在部署代码时使用，或当用户提及部署、发布或环境时使用。
---
# Deploy App
Deploy the application using the provided scripts.

## Usage
Run the deployment script: scripts/deploy.sh <environment>
Where <environment> is either staging or production.

## Pre-deployment Validation
Before deploying, run the validation script: python scripts/validate.py
```

当 skill 被调用时，agent 会读取这些指令，并按需执行被引用的脚本。脚本可以使用 Bash、Python、JavaScript 或 agent 实现所支持的其他可执行格式。Cursor 也强调脚本应尽量自包含，报错信息清晰，并能稳妥处理边界情况。

### 可选目录

Cursor 列出的可选目录包括：

| 目录 | 用途 |
| --- | --- |
| scripts/ | agent 可运行的可执行代码 |
| references/ | 按需加载的补充文档 |
| assets/ | 模板、图片、数据文件等静态资源 |

一个很重要的实践建议是：让主 SKILL.md 保持简洁，把详细材料拆到 references/ 等目录中。这样 agent 只会在需要时继续读取附加资源，更利于上下文控制。

### 查看与安装技能

Cursor 文档给出了两类常见操作：

查看已发现技能：

1. 打开 Cursor Settings。
2. 进入 Rules。
3. 在 Agent Decides 区域查看已发现的 skills。

从 GitHub 安装技能：

1. 打开 Cursor Settings -> Rules。
2. 在 Project Rules 区域点击 Add Rule。
3. 选择 Remote Rule (Github)。
4. 输入目标 GitHub 仓库 URL。

### 从规则和命令迁移到技能

Cursor 2.4 提供了 /migrate-to-skills，用于把部分现有规则和 slash commands 转成 skills。

迁移逻辑包括：

- Dynamic rules：即启用 Apply Intelligently、alwaysApply 为 false 或未定义、且未定义 globs 的规则，会被转换为标准 skills。
- Slash commands：用户级和工作区级命令会被转换为带 disable-model-invocation: true 的 skill，以保留显式调用行为。

大致步骤是：

1. 在 Agent 对话中输入 /migrate-to-skills。
2. 让 agent 识别并转换符合条件的规则与命令。
3. 在 .cursor/skills/ 中检查生成结果。

Cursor 也说明，不会迁移 alwaysApply: true 或带特定 globs 的规则，因为它们的触发语义与 skill 不同；用户规则也不会被迁移，因为它们不保存在文件系统中。

### 对本仓库的实际启发

如果后续希望让本仓库的 skills 更容易被 Cursor、VS Code、Claude Code 或 Codex 等产品兼容采用，那么至少应保持这些约束：

- skill 目录名与 frontmatter 的 name 一致。
- description 明确写出用途和触发时机。
- 主 SKILL.md 保持短而清晰，把长文档拆到 references/。
- 需要执行动作时优先通过 scripts/ 目录显式暴露脚本。
- 对只应手动触发的技能，考虑使用 disable-model-invocation: true。

## 维护建议

后续在本目录新增 skill 时，建议至少补齐以下信息：

- skill 的目标和适用场景
- 触发条件或推荐调用时机
- 主要步骤或执行约束
- 依赖脚本、外部工具或环境要求
- 示例输入与预期输出

这样可以让 skill 更容易被 agent 正确发现、理解和调用。

# agent rules

## Github Copilot

GitHub Copilot 支持仓库级自定义说明，用来告诉 Copilot 如何理解项目，以及如何构建、测试、验证它生成的修改。官方入口文档是 [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)。

### 1. Copilot 支持的规则类型

Copilot 在仓库内主要支持 3 类说明文件。

#### 1.1 仓库级说明

- 作用范围：整个仓库。
- 文件路径：`.github/copilot-instructions.md`
- 适用场景：统一编码风格、项目背景、构建命令、测试方式、提交流程。

这是最基础的一层，适合放所有目录都通用的规则。

#### 1.2 路径级说明

- 作用范围：匹配到的文件或目录。
- 文件路径：`.github/instructions/**/*.instructions.md`
- 必需配置：frontmatter 中的 `applyTo`
- 可选配置：`excludeAgent`

如果某次工作命中了路径级规则，同时仓库级 `.github/copilot-instructions.md` 也存在，那么两者会一起生效。

最小示例：

```md
---
applyTo: "**/*.ts,**/*.tsx"
---

- 所有 TypeScript 代码优先复用现有工具函数。
- 修改后先运行 lint 和 test。
```

`applyTo` 使用 glob 语法，常见写法如下：

- `*`：当前目录下所有文件。
- `**` 或 `**/*`：所有目录下所有文件。
- `*.py`：当前目录下所有 `.py` 文件。
- `**/*.py`：递归匹配所有 `.py` 文件。
- `src/*.py`：只匹配 `src` 目录下一层的 `.py` 文件。
- `src/**/*.py`：递归匹配 `src` 下所有 `.py` 文件。

`excludeAgent` 可用于排除某类 agent 使用该文件：

```md
---
applyTo: "**"
excludeAgent: "code-review"
---
```

目前官方文档里支持的值主要有：

- `code-review`
- `coding-agent`

如果不写 `excludeAgent`，则 Copilot code review 和 Copilot cloud agent 都会读取该说明。

#### 1.3 Agent instructions

- 作用范围：面向 AI agent。
- 文件形态：`AGENTS.md`
- 放置位置：仓库任意目录都可以。
- 规则：Copilot 工作时，会优先采用目录树中“离当前工作位置最近”的那个 `AGENTS.md`。

官方还提到另一种兼容方式：

- 仓库根目录下放单个 `CLAUDE.md`
- 或仓库根目录下放单个 `GEMINI.md`

这说明 GitHub Copilot 已经开始兼容更通用的 agent 约定，而不只限于 `copilot-instructions.md`。

### 2. 配置流程

#### 2.1 配置仓库级说明

1. 在仓库根目录创建 `.github/`。
2. 新建 `.github/copilot-instructions.md`。
3. 用自然语言写规则，Markdown 格式即可。
4. 保存后立即生效。

官方强调，这类说明应尽量写项目级长期有效的信息，而不是任务级临时指令。

推荐放入的内容包括：

- 仓库是做什么的。
- 项目规模、语言、框架、运行时。
- 如何 bootstrap、build、test、run、lint。
- 每个命令的前置条件、后置条件和已知坑。
- 关键目录结构、核心入口文件、配置文件位置。
- CI、工作流、提交前校验方式。

一句话理解：`copilot-instructions.md` 更像是给 Copilot 写的“项目入职手册”。

#### 2.2 配置路径级说明

1. 创建 `.github/instructions/`。
2. 按用途创建一个或多个 `NAME.instructions.md`。
3. 在文件头部写 YAML frontmatter。
4. 用 `applyTo` 指定生效路径。
5. 在正文写该类文件的专属规则。

例如：

```md
---
applyTo: "app/models/**/*.rb"
---

- ActiveRecord 模型优先保持现有命名和回调风格。
- 修改模型时同步检查校验和关联。
```

适合拆成路径级说明的内容：

- 前端目录和后端目录规则不同。
- Python、TypeScript、Shell 的风格要求不同。
- 某个目录有专门的测试、构建或部署要求。

#### 2.3 配置 Agent instructions

1. 在仓库根目录或子目录放置 `AGENTS.md`。
2. 如果希望不同子目录有不同 agent 行为，可以放多个。
3. 让最靠近目标代码的 `AGENTS.md` 承担局部规则。

这种方式更像是“目录级 agent 行为覆盖”，适合大型仓库或 monorepo。

### 3. 生效规则与优先级

#### 3.1 多类说明可叠加

同一次请求里，可能会同时命中多种说明：

- 个人说明
- 仓库说明
- 组织说明

官方优先级是：

1. 个人说明最高
2. 仓库说明其次
3. 组织说明最后

不过注意，这不代表低优先级说明会被完全忽略，而是它们会一起提供给 Copilot。因此实践上应尽量避免互相冲突的规则。

#### 3.2 路径级与仓库级可同时命中

如果某个文件同时命中：

- `.github/copilot-instructions.md`
- 某个 `.github/instructions/*.instructions.md`

那么两者都会参与上下文。

#### 3.3 AGENTS.md 就近优先

`AGENTS.md` 采用“最近目录优先”的思路，不是简单全局合并。这点和 `.github/copilot-instructions.md` 的全仓库规则不同。

### 4. 在哪里查看是否生效

- 在 GitHub Copilot Chat 中，如果仓库级自定义说明生效，响应顶部的 references 里会出现对应说明文件。
- 在 GitHub.com 的 Copilot Chat 中，可以把仓库作为附件加入会话，让仓库说明自动参与上下文。
- 自定义说明文件保存后立即可用，不需要额外编译或启用。

### 5. Code Review 的开关

对 Copilot code review 来说，自定义说明默认启用，但可以在仓库设置中关闭或重新打开。

路径大致是：

1. 进入仓库 `Settings`
2. 侧边栏进入 `Copilot`
3. 打开 `Code review`
4. 切换 `Use custom instructions when reviewing pull requests`

官方还特别说明：PR review 时，Copilot 读取的是目标 base branch 上的说明文件，而不是当前 feature branch 的说明文件。

### 6. 实践建议

- 仓库级说明写“稳定、长期、全局”的规则。
- 路径级说明写“目录、语言、模块专属”的规则。
- 大型仓库再用 `AGENTS.md` 做目录级覆盖。
- 说明尽量写清楚命令顺序、环境前提、常见报错和 workaround。
- 避免写任务级、一次性的临时要求，否则说明会很快失真。

### 7. 一个推荐的最小结构

```text
.github/
  copilot-instructions.md
  instructions/
    frontend.instructions.md
    backend.instructions.md
src/
  AGENTS.md
```

这个结构适合大多数中小型项目：

- 用 `.github/copilot-instructions.md` 放通用规则。
- 用 `.github/instructions/` 放按路径匹配的补充规则。
- 在复杂子目录里补充 `AGENTS.md`。

### 8. 和 skills 的关系

从 GitHub 当前这篇官方文档看，重点还是：

- `copilot-instructions.md`
- `*.instructions.md`
- `AGENTS.md`

也就是以 instructions 和 agent instructions 为主。`skills` 不属于这篇文档的核心内容，它更偏向特定 agent 体系下的可复用工作流封装，不等同于 GitHub Copilot 仓库级自定义说明。

如果后续要继续整理，可以单独补一节：

- GitHub Copilot 当前官方支持的 instruction / agent 文件体系
- Cursor 的 rules / project rules / agent / memories / skills 风格
- 两者在“全局规则、路径规则、目录级覆盖、工作流封装”上的差异

## Cursor

[Cursor rules](https://cursor.com/cn/docs/rules)

Cursor 把这套能力统一称为 rules。规则本质上是提供给 Agent 的系统级持久指令，用来沉淀团队约束、项目知识、常见工作流和模板。

### 1. Cursor 支持的规则类型

Cursor 官方目前主要提到 4 类规则来源。

#### 1.1 项目规则

- 作用范围：当前仓库。
- 存放位置：`.cursor/rules/`
- 是否纳入版本控制：是。
- 适用场景：项目知识、架构约束、目录规范、模板和工作流。

这是 Cursor 里最核心的规则形态，适合团队协作时共享。

#### 1.2 用户规则

- 作用范围：当前用户的所有项目。
- 配置位置：Cursor Settings -> Rules。
- 适用对象：Agent (Chat)。
- 适用场景：个人沟通风格、输出偏好、全局编码习惯。

例如：要求回复简洁、避免重复、默认使用某种表达方式等。

#### 1.3 团队规则

- 作用范围：整个团队或组织。
- 管理位置：Cursor 仪表盘。
- 适用方案：Team 和 Enterprise。
- 适用场景：组织级统一规范、内部流程、合规要求。

团队规则支持管理员统一下发，也可以设置为强制执行。

#### 1.4 AGENTS.md

- 作用范围：项目根目录或子目录。
- 文件形态：纯 Markdown。
- 定位：`.cursor/rules` 的轻量替代方案。

如果项目不想维护带 frontmatter 的规则文件，只想给 Agent 一份简单直接的说明，`AGENTS.md` 是更轻量的入口。

### 2. 规则如何工作

Cursor 的规则本质上是“提示词层的持久上下文”。

由于大语言模型不会在每次补全之间自动记住历史规则，因此 Cursor 会在应用规则时，把规则内容加到模型上下文的开头。这样 Agent 在生成代码、理解修改、执行工作流时，就能持续参考这些约束。

一句话理解：规则不是给人看的备忘录，而是给 Agent 注入稳定上下文的机制。

### 3. 项目规则的目录与结构

项目规则放在 `.cursor/rules/` 下，支持 `.md` 和 `.mdc` 两种扩展名。

推荐结构示例：

```text
.cursor/
  rules/
    react-patterns.mdc
    api-guidelines.md
    frontend/
      components.md
```

其中：

- `.md` 适合简单规则。
- `.mdc` 适合带 frontmatter 元数据的规则。

官方特别强调：如果需要更精细控制规则的触发条件，应优先使用 `.mdc`。

### 4. 规则文件格式

Cursor 规则本质上是一个 Markdown 文件，通常由两部分组成：

- frontmatter 元数据
- 正文规则内容

示例：

```md
---
description: "This rule provides standards for frontend components and API validation"
alwaysApply: false
---

- Keep frontend components small and composable.
- Validate API inputs before calling service logic.
```

另一种更完整的示例：

```md
---
globs: "src/frontend/**/*,src/shared/**/*.tsx"
alwaysApply: false
---

- Reuse existing UI primitives before creating new components.
- Prefer existing form validation patterns.
@src/frontend/templates/component-template.tsx
```

从你给的材料来看，Cursor 规则里最关键的 frontmatter 字段有：

- `description`：给 Agent 判断规则是否相关时使用。
- `globs`：控制规则按哪些路径生效。
- `alwaysApply`：是否对每个聊天会话都生效。

### 5. 项目规则的应用方式

Cursor 官方把项目规则分成几种典型应用方式。

#### 5.1 Always Apply

- 含义：每个聊天会话都应用。
- 适合内容：项目通用约束、统一架构原则、团队必守习惯。

#### 5.2 Apply Intelligently

- 含义：由 Agent 根据 `description` 判断是否相关。
- 适合内容：有明确主题，但不需要每次都加载的规则。

#### 5.3 Apply to Specific Files

- 含义：当上下文中的文件匹配指定 `globs` 时生效。
- 适合内容：前后端分离规则、特定语言规则、某个模块的开发规范。

#### 5.4 Apply Manually

- 含义：只有在聊天中手动 `@规则名` 时才应用。
- 示例：`@my-rule`
- 适合内容：偶发性工作流、脚手架模板、一次特定类型的任务。

### 6. 创建项目规则的方式

#### 6.1 在对话里用 /create-rule

1. 在 Agent 对话中输入 `/create-rule`
2. 描述你要沉淀的规则需求
3. Cursor 自动生成规则文件并保存到 `.cursor/rules/`

这种方式适合先把反复出现的问题快速沉淀成规则。

#### 6.2 在设置里手动创建

1. 打开 Cursor Settings -> Rules, Commands
2. 点击 `+ Add Rule`
3. 创建新规则文件
4. 在设置页查看规则及其启用状态

这种方式更适合手工维护已有规则体系。

### 7. 如何写出有效的 Cursor 规则

官方给出的方向比较明确，核心是“聚焦、明确、可执行”。

推荐做法：

- 尽量把单条规则控制在 500 行以内。
- 大规则拆成多个可组合的小规则。
- 给出具体示例，或者引用相关文件。
- 规则写得像清晰的内部文档，而不是空泛口号。
- 当你在聊天中反复重复同样提示时，把它升级成规则。
- 优先引用文件，不要把整段代码或文档复制进规则。

不推荐做法：

- 把整份代码风格指南塞进去，样式问题应交给 linter。
- 罗列所有常见命令，Agent 已经知道 `npm`、`git`、`pytest` 之类的常见工具。
- 为极少出现的边缘问题专门写大段规则。
- 重复仓库里已经存在的内容，而不是引用示例文件。

一句话理解：只有当 Agent 在同一类事情上反复犯错时，才值得专门加规则。

### 8. 团队规则

团队规则主要面向 Team 和 Enterprise 方案，由管理员在 Cursor 仪表盘中创建和管理。

其关键点包括：

- 可以启用或暂存为草稿。
- 可以设置为强制执行。
- 强制执行后，团队成员无法在本地关闭。
- 可以通过 glob 限定生效文件范围。
- 如果没有 glob，则会作用于每个对话。

团队规则的定位更像组织级治理层，用来确保所有项目都遵循统一标准。

### 9. 规则优先级

根据你给的文档，Cursor 的优先级顺序是：

1. 团队规则
2. 项目规则
3. 用户规则

所有适用规则会被合并进入上下文；如果不同来源之间有冲突，则更靠前的来源优先。

这点和很多人的直觉不同，因为 Cursor 这里并不是“用户设置优先于项目设置”，而是明确把团队规则放在最前面。

### 10. 导入规则

Cursor 支持从 GitHub 仓库导入远程规则。

流程大致是：

1. 打开 Cursor Settings -> Rules, Commands
2. 点击 `+ Add Rule`
3. 选择 `Remote Rule (GitHub)`
4. 粘贴 GitHub 仓库地址
5. Cursor 将规则同步到当前项目

官方描述里强调，导入后的远程规则会和源仓库保持同步，因此适合复用外部成熟规则集。

### 11. AGENTS.md 的定位

Cursor 也支持 `AGENTS.md`，它和项目规则的区别主要在于：

- `AGENTS.md` 是纯 Markdown。
- 不需要 frontmatter。
- 不强调复杂触发条件。
- 更适合简单直接的项目说明。

示例：

```md
# Project Instructions

## Code Style
- Use TypeScript for all new files
- Prefer functional components in React
- Use snake_case for database columns

## Architecture
- Follow the repository pattern
- Keep business logic in service layers
```

如果项目规模较小，或者你只想快速给 Agent 一份清晰的人类可读说明，那么 `AGENTS.md` 会比 `.cursor/rules/*.mdc` 更轻。

### 12. 用户规则的定位

用户规则是你在 Cursor Settings -> Rules 中设置的个人全局偏好，适用于所有项目。

典型内容包括：

- 回复风格偏好
- 解释详细程度
- 默认输出语言
- 个人编码习惯

例如：

```text
Please reply in a concise style. Avoid unnecessary repetition or filler language.
```

它更像“你和 Agent 的个人协作习惯”，而不是项目规范。

### 13. 一个推荐的最小结构

```text
.cursor/
  rules/
    base.mdc
    frontend.mdc
    backend.mdc
AGENTS.md
```

这个结构适合大多数项目：

- 用 `base.mdc` 放通用项目规则。
- 用 `frontend.mdc` 和 `backend.mdc` 放按目录或技术栈拆分的规则。
- 用根目录 `AGENTS.md` 放更高可读性的项目说明。

### 14. 和 Copilot 的对照理解

如果只看这两套体系，可以先这样对应理解：

- Cursor 项目规则，约等于更结构化的仓库级 / 路径级规则系统。
- Cursor `AGENTS.md`，约等于轻量版项目说明入口。
- Cursor 用户规则，类似个人偏好层。
- Cursor 团队规则，类似组织级统一约束层。

两者共同点是都在做“给 Agent 持久注入上下文”，差别在于 Cursor 把规则系统做得更产品化，也更强调 settings、dashboard 和规则导入能力。

### 15. 实践建议

- 把高频重复提示沉淀成项目规则，而不是每次重说。
- 把稳定的组织规范放到团队规则，不要散落在个人习惯里。
- 把个人表达偏好放到用户规则，不要混进项目规则。
- 简单项目优先从 `AGENTS.md` 开始，复杂项目再拆到 `.cursor/rules/`。
- 能用路径和描述控制触发时，不要把所有规则都设成 always apply。


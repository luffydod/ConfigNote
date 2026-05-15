# vibe coding

## Codex in WSL2

本文用于在 Windows 版 Codex 桌面端中，将项目运行环境配置为 WSL2，并使用 Linux sandbox。

### 1. Codex 客户端设置

在 Codex 桌面端中打开设置，建议配置如下：

```text
常规：
- 默认打开目标：WSL
- 智能体环境：适用于 Linux 的 Windows 子系统
- 集成终端 Shell：WSL
```

说明：

* **智能体环境** 决定 Codex agent 实际运行在哪里。
* **集成终端 Shell** 只影响内置终端。
* 如果智能体环境没有切换到 WSL，即使终端是 WSL，Codex 仍可能尝试使用 Windows 原生 sandbox，并出现类似“无法设置管理员沙盒”的错误。

Codex 在 Windows 上有两套 sandbox 路径：PowerShell/Windows native 下使用 Windows sandbox；WSL2 下使用 Linux sandbox。WSL1 从 Codex 0.115 起不再支持，因为 Linux sandbox 已切换到 `bubblewrap`。([OpenAI开发者][1])

---

### 2. 安装 WSL2 和 Ubuntu

在 Windows PowerShell 中执行：

```powershell
# 一键安装 WSL
wsl --install

# 安装默认 Ubuntu 发行版
wsl --install -d Ubuntu
```

安装完成后，检查 Ubuntu 是否为 WSL2：

```powershell
wsl -l -v
```

期望看到类似结果：

```text
  NAME      STATE           VERSION
* Ubuntu    Running         2
```

如果 `VERSION` 不是 `2`，可以执行：

```powershell
wsl --set-version Ubuntu 2
```

---

### 3. 安装 Codex Linux sandbox 依赖

进入 Ubuntu 后执行：

```bash
sudo apt update
sudo apt install -y bubblewrap uidmap dbus-user-session polkitd
```

其中：

* `bubblewrap`：Codex 在 Linux/WSL2 下创建 sandbox 的核心依赖。
* `uidmap`：提供用户命名空间映射工具，例如 `newuidmap` / `newgidmap`。
* `dbus-user-session`、`polkitd`：补齐常见 Linux 用户会话和权限组件。

官方文档明确要求 Linux 和 WSL2 环境安装 `bubblewrap`。([OpenAI开发者][2])

安装后可以检查：

```bash
which bwrap
bwrap --version
```

---

### 4. 可选：配置 sudo 免密

如果希望 Codex 在 WSL 中执行需要 sudo 的命令时不反复要求输入密码，可以配置当前用户的 sudo 免密规则。

在 Ubuntu 中执行：

```bash
echo "$(whoami) ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/codex-sandbox
sudo chmod 0440 /etc/sudoers.d/codex-sandbox
sudo visudo -cf /etc/sudoers.d/codex-sandbox
```

验证：

```bash
sudo -k && sudo whoami
```

如果输出：

```text
root
```

说明配置成功。

示例：

```bash
allgoo@AComi:~$ echo "$(whoami) ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/codex-sandbox
[sudo: authenticate] Password:
allgoo ALL=(ALL) NOPASSWD: ALL

allgoo@AComi:~$ sudo -k && sudo whoami
root
```

注意：sudo 免密不是 Codex sandbox 成功的必要条件。真正关键的是 **Codex agent 运行在 WSL2**，并且 WSL2 中安装了 `bubblewrap`。

---

## 5. 重置 WSL

配置完成后，需要彻底重置一次 WSL。

先在当前 Ubuntu 终端中退出：

```bash
exit
```

然后回到 Windows PowerShell 执行：

```powershell
wsl --shutdown
```

之后重新打开 Codex 桌面端。

---

## 6. Codex `config.toml` 推荐配置

建议不要写：

```toml
[windows]
sandbox = "wsl2"
shell_path = "/bin/bash"
```

原因是：`[windows].sandbox` 是 Windows native sandbox 的配置项，不是切换 WSL2 的配置项。WSL2 应该在 Codex 桌面端设置中选择。Windows 原生模式下常见值是 `elevated` 或 `unelevated`，不是 `wsl2`。([OpenAI开发者][1])

推荐先使用下面的最小配置：

```toml
model_reasoning_effort = "medium"

[projects.'\\wsl$\Ubuntu\home\allgoo\CodeSpace\allgoo_cli']
trust_level = "trusted"

[plugins."github@openai-curated"]
enabled = true

[plugins."documents@openai-primary-runtime"]
enabled = true

[plugins."spreadsheets@openai-primary-runtime"]
enabled = true

[plugins."presentations@openai-primary-runtime"]
enabled = true

[plugins."browser-use@openai-bundled"]
enabled = true

[marketplaces.openai-bundled]
last_updated = "2026-05-15T16:54:42Z"
source_type = "local"
source = '\\?\C:\Users\Allgoo\.codex\.tmp\bundled-marketplaces\openai-bundled'

[marketplaces.openai-primary-runtime]
last_updated = "2026-04-29T16:11:39Z"
source_type = "local"
source = '\\?\C:\Users\Allgoo\.cache\codex-runtimes\codex-primary-runtime\plugins\openai-primary-runtime'
```

你可以用 PowerShell 验证路径是否能访问：

```powershell
Test-Path "\\wsl$\Ubuntu\home\allgoo\CodeSpace\allgoo_cli"
```

如果输出：

```text
True
```

说明路径没问题。

## 8. 不建议同时配置 Windows 路径版本

你现在注释掉的这些可以继续保持注释：

```toml
# [projects.'c:\users\allgoo\codespace\pannel_paper1']
# trust_level = "trusted"

# [projects.'c:\users\allgoo\codespace\allgoo_cli']
# trust_level = "trusted"
```

原因是：

* 如果项目实际在 WSL 文件系统中，推荐使用 `\\wsl$\Ubuntu\...` 路径。
* 不建议同一个项目同时维护 Windows 路径和 WSL 路径配置，容易让 Codex 混淆当前项目归属。
* 如果你从 Codex 中打开的是 WSL 项目，就只信任 WSL 路径即可。

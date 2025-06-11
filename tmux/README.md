# 🌟 tmux 配置与使用上手指南

## install on linux

```bash
sudo apt install tmux
```

## 🧩 会话管理

| 操作     | 命令                               |
| ------ | -------------------------------- |
| 新建会话   | `tmux new -s demo` 或 `tmux`      |
| 断开会话   | `Ctrl+b d`                       |
| 重新连接   | `tmux attach -t demo` 或 `tmux a` |
| 查看会话   | `tmux ls` 或 `Ctrl+b s`           |
| 关闭会话   | `tmux kill-session -t demo`      |
| 关闭全部会话 | `tmux kill-server`               |

---

## ⌨️ 快捷键总览（默认前缀为 `Ctrl+b`）

### 系统快捷键

| 快捷键       | 说明      |
| --------- | ------- |
| `?`       | 显示所有快捷键 |
| `:`       | 进入命令行模式 |
| `d`       | 断开当前会话  |
| `s`       | 会话列表    |
| `r`       | 重新加载配置  |
| `[` / `]` | 复制/粘贴模式 |
| `t`       | 显示时钟    |

### 窗口（window）操作

| 快捷键       | 说明          |
| --------- | ----------- |
| `c`       | 新建窗口        |
| `&`       | 关闭窗口        |
| `0`\~`9`  | 切换窗口        |
| `n` / `p` | 下一个 / 上一个窗口 |
| `w`       | 列出所有窗口      |
| `,`       | 重命名窗口       |
| `.`       | 修改窗口编号      |
| `f`       | 查找窗口        |

### 面板（pane）操作

| 快捷键       | 说明           |
| --------- | ------------ |
| `"`       | 水平分屏（上下）     |
| `%`       | 垂直分屏（左右）     |
| `x`       | 关闭面板         |
| `z`       | 最大化 / 还原当前面板 |
| `o`       | 选择下一个面板      |
| `方向键`     | 切换面板         |
| `q`       | 显示面板编号       |
| `{` / `}` | 前/后移面板       |
| `Ctrl+o`  | 面板顺时针旋转      |
| `空格`      | 切换布局         |

---

## ⚙️ 推荐配置（写入 `~/.tmux.conf`）

### ✅ 更改前缀（推荐为 `Ctrl+a`）

```tmux
set -g prefix C-a
unbind C-b
bind C-a send-prefix
```

### ✅ 快捷键重载配置

```tmux
bind r source-file ~/.tmux.conf \; display-message "Config reloaded.."
```

### ✅ 自定义分屏键（更直观）

```tmux
unbind '"'
bind - splitw -v -c '#{pane_current_path}'
unbind %
bind | splitw -h -c '#{pane_current_path}'
```

### ✅ 开启鼠标支持（推荐）

```tmux
set -g mouse on
```

### ✅ 面板切换绑定为 hjkl（键盘党最爱）

```tmux
bind -r h select-pane -L
bind -r j select-pane -D
bind -r k select-pane -U
bind -r l select-pane -R
```

### ✅ 面板大小调整（Ctrl+hjkl）

```tmux
bind -r C-h resize-pane -L 10
bind -r C-j resize-pane -D 10
bind -r C-k resize-pane -U 10
bind -r C-l resize-pane -R 10
```

---

## 🧪 进阶功能（可选）

### ⬆️ 模拟最大化脚本（tmux < v1.8）

```bash
# ~/.tmux/zoom
# (内容略，请参考完整脚本)
```

绑定快捷键：

```tmux
unbind z
bind z run ". ~/.tmux/zoom"
```

### 📎 面板合并（窗口转面板）

```bash
join-pane -s window_name
```

或合并其他会话面板：

```bash
join-pane -s session:window.pane
```

---

## 🍎 Mac 专用优化（修复 pbcopy 等）

```bash
brew install reattach-to-user-namespace
```

```tmux
set -g default-command "reattach-to-user-namespace -l $SHELL"
```

---

### 💬 推荐放在配置文件最后的提示信息

```tmux
# 加载配置时提示
bind r source-file ~/.tmux.conf \; display-message "Config reloaded.. 🎉"
```

---

## 🧰 配置文件保存路径

默认位置：`~/.tmux.conf`
修改后使用以下任一方法生效：

* 重启 tmux
* 在 tmux 中输入 `Ctrl+b :` 后输入：
  `source-file ~/.tmux.conf`

---

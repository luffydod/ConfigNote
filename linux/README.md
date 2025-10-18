# Linux

## 确认系统架构

```bash
# 1.
uname -m

# 示例输出
aarch64

# 2.
lscpu

# 3.
arch
```

- `aarch64`: `arm64` 在 Linux 内核中的标准名称。
- `x86_64`: 64 位的 Intel/AMD 架构（目前最常见的桌面和服务器 CPU 架构）。

## 代理配置

### 安装 Clash Verge (.deb 文件)

```bash
sudo apt install ./clash-verge_xxx_arm64.deb
```

### 配置终端环境变量（proxy_on/proxy_off）

```bash
# ==================================
# Proxy configuration for Clash
# ==================================

function proxy_on() {
    export http_proxy="http://127.0.0.1:7890"
    export https_proxy="http://127.0.0.1:7890"
    export no_proxy="localhost,127.0.0.1,::1"

    echo "✅ Terminal proxy ENABLED (HTTP/HTTPS -> 127.0.0.1:7890)"
}

function proxy_off() {
    unset http_proxy
    unset https_proxy
    unset no_proxy

    echo "❌ Terminal proxy DISABLED"
}
```

### 彻底卸载 Clash Verge

```bash
# 停止并禁用服务
sudo systemctl stop clash-core-service.service
sudo systemctl disable clash-core-service.service

# 删除服务文件
sudo rm -f  /usr/lib/systemd/system/clash-core-service.service

# 重新加载 systemd
sudo systemctl daemon-reload

# 删除软件
sudo apt remove clash-verge
sudo apt autoremove

# 删除配置文件和缓存
rm -rf ~/.config/clash
rm -rf ~/.cache/clash-verge/
rm -rf ~/.local/share/clash-verge/
```

## to be continue

# 🤠 Linux

## 😨 确认系统架构

```bash
# ☠️ 1.
uname -m

# 😇 示例输出
aarch64

# 😷 2.
lscpu

# 😶 3.
arch
```

- `aarch64`: `arm64` 在 Linux 内核中的标准名称。
- `x86_64`: 64 位的 Intel/AMD 架构（目前最常见的桌面和服务器 CPU 架构）。

## 🥳 MiniConda 安装配置

1. 使用 [🙃 清华源镜像](https://mirrors.tuna.tsinghua.edu.cn/anaconda/miniconda/) 下载安装脚本

```bash
wget https://mirrors.tuna.tsinghua.edu.cn/anaconda/miniconda/Miniconda3-py310_24.9.2-0-Linux-x86_64.sh
```

2. 运行安装脚本

```bash
bash ./Miniconda3-py310_24.9.2-0-Linux-x86_64.sh
```

3. 激活 conda 配置

```bash
source ~/.bashrc
```

4. 配置镜像源

直接编辑配置文件 `vim ~/.condarc`

```yaml
channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r/
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2/
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  nvidia: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
```

此后执行创建环境或者安装依赖出现连接错误

```bash
Retrying (Retry(total=0, connect=None, read=None, redirect=None, status=None)) after connection broken by 'NewConnectionError('<urllib3.connection.HTTPSConnection object at 0x7f055c12c430>: Failed to establish a new connection: [Errno 101] Network is unreachable')': /pkgs/r/noarch/repodata.json.zst
```

一说解决方法是去除配置文件中的 `- defaults`.
一说建议启动时加参数：--network=bridge 或 --dns 223.5.5.5，或确认宿主机有外网。

刷新配置并确认是否生效

```bash
conda clean -i
conda info
```

可选：设置 conda-forge 专用清华镜像（如果经常用）

```bash
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
```

5. 通过 Conda 安装 mamba

```bash
conda install -c conda-forge mamba
```

ssl 证书验证错误

```bash
root@b6ad3098a877:/home/root# conda install -c conda-forge mamba
Fetching package metadata: SSL verification error: [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed (_ssl.c:590)
.SSL verification error: [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed (_ssl.c:590)

# 🫨 解决：更新系统包环境
apt-get update && apt-get install --reinstall ca-certificates
update-ca-certificates

# 🥳 配置环境变量
# 😯 首先查找 certifi 包提供的证书文件路径，通常类似于：
# 😅 /root/miniconda2/lib/python2.7/site-packages/certifi/cacert.pem
# 😄 您可以使用 find 命令查找：
find /root/miniconda2 -name "cacert.pem" -type f

# 😇 找到路径后，设置环境变量（请将路径替换为实际找到的路径）
export SSL_CERT_FILE=/root/miniconda2/lib/python2.7/site-packages/certifi/cacert.pem
# 🥱 可以将此设置写入 ~/.bashrc 或 ~/.profile 使其永久生效
```

6. 
7. 
## 😀 Clash Verge 代理配置

### 🙉 安装 Clash Verge (.deb 文件)

```bash
sudo apt install ./clash-verge_xxx_arm64.deb
```

### 😈 配置终端环境变量（proxy_on/proxy_off）

```bash
# 😏 ==================================
# 😙 Proxy configuration for Clash
# 😀 ==================================

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

### 😩 彻底卸载 Clash Verge

```bash
# 😅 停止并禁用服务
sudo systemctl stop clash-core-service.service
sudo systemctl disable clash-core-service.service

# 🤐 删除服务文件
sudo rm -f  /usr/lib/systemd/system/clash-core-service.service

# 😾 重新加载 systemd
sudo systemctl daemon-reload

# 🤣 删除软件
sudo apt remove clash-verge
sudo apt autoremove

# 🧐 删除配置文件和缓存
rm -rf ~/.config/clash
rm -rf ~/.cache/clash-verge/
rm -rf ~/.local/share/clash-verge/
```

## 😡 ShellCrash 代理安装配置

[😃 site](https://github.com/juewuy/ShellCrash)

### 😻 安装脚本说明

安装时下载失败，替换了 `webget` 函数，直接手动下载了 `ShellCrash.tar.gz` 并放到了指定路径，可以参考安装脚本：[😥 install_shellcrash.sh](./install_shellcrash.sh)

### 🙊 启动服务

手动下载 meta 核心：[🤮 CrashCore](https://github.com/juewuy/ShellCrash/tree/dev/bin/meta)，并手动移动到需要的执行目录：`/tmp/ShellCrash/CrashCore.tar.gz`。

```bash
配置文件加载完成！ 
 1 启动/重启服务
 2 内核功能设置
 3 停止内核服务
 4 内核启动设置
 5 配置自动任务
 6 导入配置文件
 7 内核进阶设置
 8 其他工具
 9 更新/卸载
-----------------------------------------------
 0 退出脚本
请输入对应数字 > 1
-----------------------------------------------
未找到【meta】核心，正在下载！
curl: (35) OpenSSL SSL_connect: 连接被对方重置 in connection to fastly.jsdelivr.net:443                                                                              

curl: (35) OpenSSL SSL_connect: 连接被对方重置 in connection to fastly.jsdelivr.net:443                                                                              

tar (child): /tmp/ShellCrash/CrashCore.tar.gz：无法 open: 没有那个文件或目录
tar (child): Error is not recoverable: exiting now
tar: Child returned status 2
tar: Error is not recoverable: exiting now
chmod: 无法访问 '/tmp/ShellCrash/core_new': 没有那个文件或目录
核心下载失败，请重新运行或更换安装源！
```

### 😤 面板本地安装

手动 [😼 download](https://github.com/juewuy/ShellCrash/tree/dev/bin/dashboard)，然后解压到安装目录下的 `ui` 目录。

比如：安装目录选择 `usr/share` 对应的 ui 目录：`/usr/share/ShellCrash/ui`

### 🙃 在线生成配置文件

程序运行过程中提示/usr/share/ShellCrash/start.sh: 第 326 行： [🙀 : : 需要整数表达式

修复建议：[start.sh](./start.sh)

```bash
# 😁 在 get_core_config() 函数开始处添加 retry 变量的初始化：
[ -z "$retry" ] && retry=0  # ✅ 添加这行来初始化 retry 变量
```

## 😞 to be continue

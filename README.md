# ConfigNote

~~差生文具多~~

ConfigNote​ is a practical knowledge base for developers, curating configuration guides for frequently used development tools. 

ConfigNote​ 是一个开发者实用工具配置笔记仓库，致力于整理开发过程中高频使用的工具配置指南。

## tool list

- [🧩 tmux终端配置](tmux/README.md) - 多窗口/会话管理指南  
- [✨ zsh终端配置](zsh/README.md) - 主题插件与效率优化  
- [👨‍💻 neovim编辑器配置](neovim/README.md) - 开发环境与快捷键大全

## Dockerfile配置

### 1、基础系统镜像源配置

```dockerfile
# 设置语言环境和时区
ENV LC_ALL=C.UTF-8 \
    LANG=C.UTF-8 \
    TZ=Asia/Shanghai
    
# 配置时区链接
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 
ARG DEBIAN_FRONTEND=noninteractive

# 镜像源
RUN sed 's/\/.*com/\/\/mirrors.aliyun.com/g' /etc/apt/sources.list -i
```

手动换源：`vim /etc/apt/sources.list`

参考：[清华源](https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/)

## pip代理配置

```bash
# 配置清华源
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

```



## git 代理配置

### 1、配置阿里云镜像

```bash
# 替换 github.com 为镜像地址
git config --global url."https://gitclone.com/".insteadOf https://
git clone https://github.com/user/repo.git
```

## torch安装

### 使用pip

[reference](https://pytorch.org/get-started/previous-versions/)

```bash
# 安装指定版本 reference
pip install torch==2.6.0 torchvision==0.21.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cu118

```



## Docker记录

### novnc

[reference](https://github.com/Tiryoh/docker-ros2-desktop-vnc/blob/master/jazzy/Dockerfile).

已制作的镜像：`docker pull crpi-c30rbdvbl28uwiva.cn-beijing.personal.cr.aliyuncs.com/luffydod/novnc:base`

运行：

```bash
docker run -itd \
  -p 12345:80 \
  --security-opt seccomp=unconfined \
  --shm-size=512m \
  --gpus all \
  -v [local]:/workspace \
  --name demo \
  novnc

docker run -itd \
  -p 12345:80 \
  --security-opt seccomp=unconfined \
  --shm-size=512m \
  --name demo1 \
  novnc:0.1
```

## Docker镜像加速域名

- docker.xuanyuan.me
- 


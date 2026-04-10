# 使用 NVIDIA 官方的 PyTorch 作为基础镜像
FROM nvcr.io/nvidia/pytorch:26.03-py3

# 环境变量：设置非交互模式，避免 apt 安装时卡在确认提示
ENV DEBIAN_FRONTEND=noninteractive

# 更新 apt 源并安装 openssh-server，安装后清理缓存以减小镜像体积
RUN apt-get update && \
    apt-get install -y openssh-server \
    vim \
    tmux \
    net-tools \
    iputils-ping && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 创建 sshd 运行所需的目录
RUN mkdir -p /var/run/sshd

# 设置 root 用户密码 (使用你配置的密码)
# RUN echo 'root:rt.1qwe2iop' | chpasswd

# 修改 SSH 配置文件，允许 root 登录和密码认证
# RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
#     sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config

ARG YOUR_NAME=allgoo

# 接收 compose 传来的参数，默认值为 1000
ARG HOST_UID=1000
ARG HOST_GID=1000

# 创建一个和宿主机 UID/GID 一致的用户, 如果有默认用户占用了该 ID，先将其删除，然后再创建我们的目标用户
RUN userdel -r $(getent passwd ${HOST_UID} | cut -d: -f1) 2>/dev/null || true && \
    groupdel $(getent group ${HOST_GID} | cut -d: -f1) 2>/dev/null || true && \
    groupadd -g ${HOST_GID} ${YOUR_NAME} && \
    useradd -u ${HOST_UID} -g ${YOUR_NAME} -m ${YOUR_NAME} -s /bin/bash

# 配置用户 .ssh
RUN mkdir -p /home/${YOUR_NAME}/.ssh && \
    chown -R ${HOST_UID}:${HOST_GID} /home/${YOUR_NAME}/.ssh && \
    chmod 700 /home/${YOUR_NAME}/.ssh

# 设置工作目录
WORKDIR /home/${YOUR_NAME}/workspace

# 暴露 22 端口
EXPOSE 22

# 启动 sshd 服务，并以前台模式 (-D) 运行，这能保持容器一直处于运行状态
CMD ["/usr/sbin/sshd", "-D"]
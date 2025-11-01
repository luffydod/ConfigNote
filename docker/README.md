# 🥹 Dockerfile配置

## 🥲 image list

- [😓 novnc](novnc/README.md)
- 

## 😲 Docker镜像加速域名

- docker.xuanyuan.me
- 

```bash
docker pull [加速域名]/image_tag
```

## 🙊 1、基础系统镜像源配置

```dockerfile
# 🤩 设置语言环境和时区
ENV LC_ALL=C.UTF-8 \
    LANG=C.UTF-8 \
    TZ=Asia/Shanghai
    
# 😑 配置时区链接
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 😫 ARG DEBIAN_FRONTEND=noninteractive

# 😥 镜像源
RUN sed 's/\/.*com/\/\/mirrors.aliyun.com/g' /etc/apt/sources.list -i
```

手动换源：`vim /etc/apt/sources.list`

参考：[💀 清华源](https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/)

## 容器 ssh 连接

配置 ssh 服务

```bash
apt update && apt install -y openssh-server sudo net-tools iproute2
mkdir -p /var/run/sshd

# 修改 SSH 配置
sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config
grep -q '^PermitRootLogin' /etc/ssh/sshd_config || echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config
grep -q '^PasswordAuthentication' /etc/ssh/sshd_config || echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config

# 设置 root 密码
echo "root:123456" | chpasswd

# 启动 SSH 服务（前台模式 -D）
/usr/sbin/sshd -D

# 检查 SSH 服务
ps -ef | grep sshd
```

容器启动命令，端口映射

```bash
# 启动命令示例
docker run -itd \
--gpus all \
-p 23456:22 \
-v /your/path:/home/root/workspace \
--name [container name] \
[image name] \
bash
```

vscode IDE ssh 配置

```bash
Host sam6d
    HostName 127.0.0.1
    User root
    Port 23456
    ProxyJump XA5019
```




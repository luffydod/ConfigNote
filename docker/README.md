# 😽 Docker

## 😲 Install Guide

1. 基础安装流程

```bash
# 😍 --- 1. 清理旧环境 ---
sudo apt-get remove -y docker docker-engine docker.io containerd runc

# 😥 --- 2. 安装依赖与密钥 ---
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# 😈 创建密钥目录
sudo mkdir -p /etc/apt/keyrings
# 💩 下载官方 GPG 密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 👹 --- 3. 写入软件源 ---
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 🙁 --- 4. 安装 Docker 组件 ---
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 🫡 --- 5. 配置非 Root 用户权限（生产环境推荐） ---
# 🤠 将当前用户加入 docker 组
sudo usermod -aG docker $USER
# 😎 刷新组权限（避免注销重登，但建议新开终端测试）
newgrp docker
```

2. 配置

```bash
# 💩 --- 1. 准备新数据目录 ---
sudo mkdir -p /data/docker

# 😱 --- 2. 写入/覆盖 daemon.json (无注释，纯净版) ---
# 🙉 注意：如果原本有文件，请手动编辑，不要直接覆盖
cat <<EOF | sudo tee /etc/docker/daemon.json
{
  "data-root": "/data/docker",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "exec-opts": ["native.cgroupdriver=systemd"],
  "live-restore": true,
  "registry-mirrors": [
    "https://docker.1ms.run"
  ]
}
EOF

# 😵 --- 配置解释 ---
# 😖 "data-root": 修改镜像和容器存储路径
# 🥵 "log-opts": 单个容器日志最大50M，保留3个文件（防止日志占满磁盘）
# 🙃 "live-restore": 守护进程崩溃或重启时，容器保持运行（生产环境强烈推荐）
```

3. 数据迁移

```bash
# 👽 1. 停止 Docker
sudo systemctl stop docker

# 😗 2. 迁移数据 (rsync 保留所有属性)
# 🤡 注意：目录末尾的斜杠 / 很关键，确保目录结构层级正确
sudo rsync -avxP /var/lib/docker/ /data/docker/

# 😼 3. 备份旧目录（以防万一，确认无误后再删）
sudo mv /var/lib/docker /var/lib/docker.bak

# 😎 4. 重新加载配置并启动
sudo systemctl daemon-reload
sudo systemctl start docker

# 👻 5. 验证路径
docker info | grep "Docker Root Dir"
# 😏 输出应为: Docker Root Dir: /data/docker
```

## 🤠 NVIDIA Container Toolkit 安装与配置

### 1. 安装 Toolkit

```bash
# 添加官方 GPG 密钥
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg

# 添加软件源（若需要代理）：
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

# 若无代理，使用中科大镜像源：
echo "deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://mirrors.ustc.edu.cn/libnvidia-container/stable/deb/\$(ARCH) /" | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

# 修复 CUDA 仓库公钥缺失（如有需要）：
curl -fsSL https://developer.download.nvidia.cn/compute/cuda/repos/ubuntu2204/x86_64/3bf863cc.pub | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/nvidia-cuda.gpg

# 安装
sudo apt update
sudo apt install -y nvidia-container-toolkit
```

### 2. 配置 Runtime 并启动

```bash
# 自动配置 NVIDIA Runtime (会自动修改 daemon.json 结合刚才的配置)
sudo nvidia-ctk runtime configure --runtime=docker

# 重新加载系统服务并重启 Docker
sudo systemctl daemon-reload
sudo systemctl restart docker
```

4. 验证与测试

```bash
# 🫡 验证版本
docker version

# 😎 运行 Hello World
docker run --rm hello-world

# 🤣 验证日志策略是否生效（查看某个容器的配置）
# 🤫 启动一个测试容器
docker run -d --name test-log nginx
# 😃 查看该容器的 HostConfig.LogConfig
docker inspect --format='{{.HostConfig.LogConfig}}' test-log
# 😓 输出应包含: {json-file map[max-file:3 max-size:50m]}
```

## 😄 为 Docker 守护进程手动指定代理

1. 创建 Docker 的 systemd 配置目录

```bash
sudo mkdir -p /etc/systemd/system/docker.service.d
```

2. 创建并编辑代理配置文件

```bash
sudo vim /etc/systemd/system/docker.service.d/http-proxy.conf
```

3. 写入配置

```ini
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:7890"
Environment="HTTPS_PROXY=http://127.0.0.1:7890"
Environment="NO_PROXY=localhost,127.0.0.1,.example.com"
```

4. 重载配置并重启dockerfuwu

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```


## 🫥 image list

- [😊 novnc](novnc/README.md)
- [🥳 PyTorch Dev 环境](pytorch_dev/README.md)


## 😝 Docker镜像加速域名

- docker.xuanyuan.me
- 

```bash
docker pull [加速域名]/image_tag
```


## 🤐 1、基础系统镜像源配置

```dockerfile
# 😆 设置语言环境和时区
ENV LC_ALL=C.UTF-8 \
    LANG=C.UTF-8 \
    TZ=Asia/Shanghai
    
# 🤨 配置时区链接
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 🥰 ARG DEBIAN_FRONTEND=noninteractive

# 😞 镜像源
RUN sed 's/\/.*com/\/\/mirrors.aliyun.com/g' /etc/apt/sources.list -i
```

手动换源：`vim /etc/apt/sources.list`

参考：[🥱 清华源](https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/)

换源后 update 失败可能的现象 `No system certificates available. Try installing ca-certificates.` 需要换源前安装 `ca-certificates`。

## 😷 容器 ssh 连接

配置 ssh 服务

```bash
apt update && apt install -y openssh-server sudo net-tools iproute2
mkdir -p /var/run/sshd

# 🤭 修改 SSH 配置
sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config
grep -q '^PermitRootLogin' /etc/ssh/sshd_config || echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config
grep -q '^PasswordAuthentication' /etc/ssh/sshd_config || echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config

# 😓 设置 root 密码
echo "root:123456" | chpasswd

# 😂 启动 SSH 服务（前台模式 -D）
/usr/sbin/sshd -D

# 😜 检查 SSH 服务
ps -ef | grep sshd
```

容器启动命令，端口映射

```bash
# 🤨 启动命令示例
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




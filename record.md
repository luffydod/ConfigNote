系统换源
在终端运行以下命令，查看你的系统代号（Codename）：
lsb_release -c

sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak

Cuda tookit
Nvcc 不能用，只安装了CUDA13.0驱动。
<https://developer.nvidia.com/cuda-13-0-0-download-archive?target_os=Linux&target_arch=x86_64&Distribution=Ubuntu&target_version=22.04&target_type=deb_network>
wget <https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb>
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get -y install cuda-toolkit-13-0
配置环境变量
export PATH=/usr/local/cuda/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH
验证：
nvcc -V

ubuntu@ubuntu:~/Downloads$ export PATH=/usr/local/cuda/bin:$PATH
ubuntu@ubuntu:~/Downloads$ export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH
ubuntu@ubuntu:~/Downloads$ nvcc -V
nvcc: NVIDIA (R) Cuda compiler driver
Copyright (c) 2005-2025 NVIDIA Corporation
Built on Wed_Aug_20_01:58:59_PM_PDT_2025
Cuda compilation tools, release 13.0, V13.0.88
Build cuda_13.0.r13.0/compiler.36424714_0
Docker engine

1. 安装 Docker Engine

# 1. 更新索引并安装依赖

sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release

# 2. 添加 Docker 官方 GPG 密钥 (采用官方最新推荐写法)

sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL <https://download.docker.com/linux/ubuntu/gpg> -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# 3. 设置软件源

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. 安装 Docker

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
2. 用户组配置（免 sudo 运行 docker）
sudo usermod -aG docker $USER

# 注意：执行完此命令后，当前终端需执行以下命令使其立即生效，或者直接退出重新登录

newgrp docker
3. 安装 NVIDIA Container Toolkit

# 1. 添加官方 GPG 密钥和软件源

curl -fsSL <https://nvidia.github.io/libnvidia-container/gpgkey> | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg

# 可能需要代理

curl -s -L <https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list> | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

# 2. 安装 Toolkit

sudo apt update

# 保持代理环境变量： sudo -E apt update

sudo apt install -y nvidia-container-toolkit

# 如果没有代理，改国内镜像

# 1. 覆盖写入中科大镜像源

echo "deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] <https://mirrors.ustc.edu.cn/libnvidia-container/stable/deb/$(ARCH)> /" | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

# 另一种覆写方式

sudo sed -i 's#<https://nvidia.github.io/libnvidia-container#https://mirrors.ustc.edu.cn/libnvidia-container#g>' /etc/apt/sources.list.d/nvidia-container-toolkit.list

# 修复 CUDA 仓库公钥缺失

curl -fsSL <https://developer.download.nvidia.cn/compute/cuda/repos/ubuntu2204/x86_64/3bf863cc.pub> | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/nvidia-cuda.gpg
4. 配置镜像源与 Runtime，并启动服务

# 1. 确保 docker 配置目录存在

sudo mkdir -p /etc/docker

# 2. 先配置镜像源 (如果需要配置多个镜像源，可在列表中用逗号分隔)

sudo tee /etc/docker/daemon.json <<EOF
{
    "registry-mirrors": [
        "https://docker.1ms.run"
    ]
}
EOF

# 3. 自动配置 NVIDIA Runtime (该命令会自动读取上一步的 daemon.json 并将 nvidia runtime 合并进去)

sudo nvidia-ctk runtime configure --runtime=docker

# 4. 重新加载系统服务、设置开机自启并重启 Docker

sudo systemctl daemon-reload
sudo systemctl enable docker
sudo systemctl restart docker
Docker compose

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

RUN echo 'root:rt.1qwe2iop' | chpasswd

# 修改 SSH 配置文件，允许 root 登录和密码认证

RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config

# 设置工作目录

WORKDIR /workspace

# 暴露 22 端口

EXPOSE 22

# 启动 sshd 服务，并以前台模式 (-D) 运行，这能保持容器一直处于运行状态

CMD ["/usr/sbin/sshd", "-D"]
services:
  pytorch_dev:
    # 告诉 Compose 根据当前目录(.)的 Dockerfile 来构建镜像
    build: .  
    # 构建出来的镜像会被自动命名为这个名字
    image: pro_pytorch:latest
    container_name: pro1
    # 强烈建议：vLLM 和 PyTorch 多进程需要直接共享宿主机的 IPC 命名空间，防止 NCCL 报错或卡死
    ipc: host

    ports:
      - "2222:22"
      - "8000:8000"  # 映射 vLLM 默认的服务端口，方便外部调用 API
    volumes:
      # 将宿主机的代码目录挂载到容器内的 /workspace
      - ~/Codespace:/workspace  
      # 建议也将本地系统的时间挂载进去，保持时间同步
      - /etc/localtime:/etc/localtime:ro
      # 挂载本机公钥，便于免密登陆
      - ~/.ssh/id_ed25519.pub:/root/.ssh/authorized_keys:ro
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]  # 核心配置：透传 GPU 给容器
    # shm_size: '16gb'  # 增加共享内存，防止 PyTorch DataLoader 报错 (根据你的物理内存可适当调大)
构建。
docker compose up -d --build

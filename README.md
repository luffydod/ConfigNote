# ConfigNote

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

## git 代理配置

### 1、配置阿里云镜像

```bash
# 替换 github.com 为镜像地址
git config --global url."https://gitclone.com/".insteadOf https://
git clone https://github.com/user/repo.git
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

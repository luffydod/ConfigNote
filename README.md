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


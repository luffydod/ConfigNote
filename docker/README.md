# Dockerfile配置

## image list

- [novnc](novnc/README.md)
- 

## Docker镜像加速域名

- docker.xuanyuan.me
- 

```bash
docker pull [加速域名]/image_tag
```

## 1、基础系统镜像源配置

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

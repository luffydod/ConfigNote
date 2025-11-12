# 👿 novnc

[😞 reference](https://github.com/Tiryoh/docker-ros2-desktop-vnc/blob/master/jazzy/Dockerfile).

已上传的镜像：`docker pull crpi-c30rbdvbl28uwiva.cn-beijing.personal.cr.aliyuncs.com/luffydod/novnc:base`

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

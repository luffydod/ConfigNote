# PyTorch Dev 容器环境

这是一个使用官方 PyTorch 镜像构建的开发环境，内含 SSH、Tmux 等基础工具。

## 构建与启动

运行以下命令构建并启动容器：

```bash
docker compose up -d --build
```

建议使用 VSCode 的 SSH 插件连接，端口已映射到 `2222`，本地主机映射的端口：`8000` 供 vLLM 等服务使用。

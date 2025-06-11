# git

## git 代理配置

### 1、加速域名前缀

```bash

# 加速1
git clone https://github.moeyy.xyz/https://github.com/*

# 加速2
git clone https://gh.xmly.dev/https://github.com/*

# 加速3
git clone https://gh.api.99988866.xyz/https://github.com/*
```

### 2、持久配置

```bash
# 替换 github.com 为镜像地址
git config --global url."https://gitclone.com/".insteadOf https://
git clone https://github.com/user/repo.git
```

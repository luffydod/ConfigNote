# 😬 git

## 🤥 git 代理配置

```bash
# 查看当前代理配置
git config --global --get http.proxy
git config --global --get https.proxy

git config --global http.proxy http://127.0.0.1:7897
git config --global https.proxy http://127.0.0.1:7897

# 取消代理配置
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### 🤭 1、加速域名前缀

```bash

# 😡 加速1
git clone https://github.moeyy.xyz/https://github.com/*

# 😥 加速2
git clone https://gh.xmly.dev/https://github.com/*

# 🤢 加速3
git clone https://gh.api.99988866.xyz/https://github.com/*
```

### 💀 2、持久配置

```bash
# 😰 替换 github.com 为镜像地址
git config --global url."https://gitclone.com/".insteadOf https://
git clone https://github.com/user/repo.git
```

## git 配置 ssh 密钥

1. 生成新的 ssh 密钥

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

ssh-keygen -t ed25519 -C "your_email@example.com"

# 根据以下提示输入自定义目录
Enter file in which to save the key (/home/youruser/.ssh/id_rsa):

ls -al ~/.ssh

# 示例输出
my_custom_ssh_key
my_custom_ssh_key.pub
```

2. 查看 ssh 公钥，添加到 git 平台

```bash
cat ~/.ssh/my_custom_ssh_key.pub
```
然后，前往 GitHub，进入 Settings > SSH and GPG keys > New SSH Key，粘贴公钥，保存即可。

3. 配置自定义密钥文件

```bash
vim ~/.ssh/config

# 添加以下内容
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/my_custom_ssh_key

```
- `Host github.com`：这是一个别名，表示当你使用 git@github.com 时，自动匹配此配置。
- `IdentityFile ~/.ssh/my_custom_ssh_key`：这是私钥的路径

## clash verge规则配置

问题：开启 `TUN` 模型下 git ssh 连接 22 或者 443 端口会拦截，导致 ssh 地址不通。

匹配 github.com 且 目标端口为 22 (SSH) 的流量，让其直连
- AND,((DOMAIN-SUFFIX,github.com),(DST-PORT,22)),DIRECT

## git 批替换指定用户的提交信息

```sh
pip install git-filter-repo
```

```sh
git filter-repo --force --commit-callback '
    if commit.author_email == b"15735184899@163.com":
        commit.author_name = b"allgoo"
        commit.author_email = b"319377758@qq.com"
    if commit.committer_email == b"15735184899@163.com":
        commit.committer_name = b"allgoo"
        commit.committer_email = b"319377758@qq.com"
'
```

强制推送：
```sh
git push origin --force --all
git push origin --force --tags
```

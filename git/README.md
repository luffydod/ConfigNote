# 😻 git

## 🤤 Git代码同步：本地开发+服务器运行

**裸仓库 + 自动化脚本（最规范、最稳定）**

我们在服务器上建立一个专门用于中转的“裸仓库（Bare Repository）”，然后通过 Git Hook（钩子）在接收到本机的推送后，自动把代码部署到实际运行的项目目录中。

1. 在服务器上创建裸仓库，只保存版本历史，专为代码同步而生。

```bash
# 👿 建议在用户主目录下建一个专门放 git 仓库的文件夹
mkdir -p ~/git-repos/myproject.git
cd ~/git-repos/myproject.git
git init --bare
```

2. 配置自动部署钩子 (Git Hook)，让这个裸仓库在收到代码时，自动把文件覆盖到你实际跑项目的目录。

  - 进入钩子目录并创建 post-receive 文件：
```bash
cd ~/git-repos/myproject.git/hooks
vim post-receive
```
  - 在文件中填入以下脚本（注意替换路径）：
```bash
#!/bin/sh
# 😜 将 /path/to/your/project 替换为你服务器上项目实际所在的绝对路径
GIT_WORK_TREE=/path/to/your/project git checkout -f
```
  - 保存退出，并赋予脚本执行权限：
```bash
chmod +x post-receive
```

3. 在本机和服务器之间建立连接

  - 如果你本机还没有代码，直接克隆这个裸仓库：
```bash
git clone username@server_ip:~/git-repos/myproject.git
```
  - 如果你本机已经有了开发好的代码，将其关联到服务器的裸仓库：
```bash
cd /path/to/local/project

# 😁 初始化 Git 仓库，这会在目录下生成一个隐藏的 .git 文件夹
git init

# 👽 将你本地现有的所有项目代码添加到 Git 的暂存区
git add .

# 🥵 做第一次本地提交
git commit -m "Initial commit for server monitor"

# 😡 添加服务器连接
git remote add origin username@server_ip:~/git-repos/myproject.git
git push -u origin master  # 或者 main
```

**补充**

- 本地推送出现错误，分支命名问题

```bash
bangbang@menshiduodeMacBook-Air ~/c/server_monitor (main)> git push -u ori
gin main
Enumerating objects: 19, done.
Counting objects: 100% (19/19), done.
Delta compression using up to 8 threads
Compressing objects: 100% (17/17), done.
Writing objects: 100% (19/19), 23.92 KiB | 7.97 MiB/s, done.
Total 19 (delta 0), reused 0 (delta 0), pack-reused 0
remote: fatal: You are on a branch yet to be born
To YG_A6000:/home/zwb/git-repos/server_monitor.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

当你用 git init --bare 初始化裸仓库时，它的默认分支指针（HEAD）通常指向 master。而你在 macOS 本地用的默认分支是 main。

当代码推送上去后，钩子脚本执行 git checkout -f 时，它会尝试检出默认的 master 分支。但服务器上目前只有你刚推上来的 main 分支，master 分支连一个提交都没有（即“还未出生 / yet to be born”），所以 Git 拒绝了检出操作。

登录你的服务器，进入裸仓库目录，然后修改 HEAD 指针：

```bash
cd /home/zwb/git-repos/server_monitor.git
git symbolic-ref HEAD refs/heads/main
```

- 为了让以后的自动同步绝对稳定，不受你当前所在目录的干扰，建议把钩子脚本也改成这种显式指定绝对路径的方式。

```bash
vim /path/to/your/myproject.git/hooks/post-receive

#!/bin/sh
# 😲 显式指定工作树和仓库路径，确保在任何环境下都能执行成功
git --work-tree=/path/to/your/myproject --git-dir=/path/to/your/myproject.git checkout -f main
```

## 😁 git 代理配置

```bash
# 💀 查看当前代理配置
git config --global --get http.proxy
git config --global --get https.proxy

git config --global http.proxy http://127.0.0.1:7897
git config --global https.proxy http://127.0.0.1:7897

# 🤕 取消代理配置
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### 🙈 1、加速域名前缀

```bash

# 😔 加速1
git clone https://github.moeyy.xyz/https://github.com/*

# 😛 加速2
git clone https://gh.xmly.dev/https://github.com/*

# 😍 加速3
git clone https://gh.api.99988866.xyz/https://github.com/*
```

### 😁 2、持久配置

```bash
# 🙊 替换 github.com 为镜像地址
git config --global url."https://gitclone.com/".insteadOf https://
git clone https://github.com/user/repo.git
```

## 🙂 git 配置 ssh 密钥

1. 生成新的 ssh 密钥

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

ssh-keygen -t ed25519 -C "your_email@example.com"

# 😧 根据以下提示输入自定义目录
Enter file in which to save the key (/home/youruser/.ssh/id_rsa):

ls -al ~/.ssh

# 🫥 示例输出
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

# 🤧 添加以下内容
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/my_custom_ssh_key

```
- `Host github.com`：这是一个别名，表示当你使用 git@github.com 时，自动匹配此配置。
- `IdentityFile ~/.ssh/my_custom_ssh_key`：这是私钥的路径

## 😟 clash verge规则配置

问题：开启 `TUN` 模型下 git ssh 连接 22 或者 443 端口会拦截，导致 ssh 地址不通。

匹配 github.com 且 目标端口为 22 (SSH) 的流量，让其直连
- AND,((DOMAIN-SUFFIX,github.com),(DST-PORT,22)),DIRECT

## 😔 git 批替换指定用户的提交信息

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

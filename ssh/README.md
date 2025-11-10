# SSH

## Github SSH 连接配置

1. 在主机上生成 SSH 密钥对

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"

ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 默认路径（通常是 ~/.ssh/id_ed25519 或 ~/.ssh/id_rsa）
```

2. 将公钥添加到 GitHub 账户
   - 点击页面右上角的你的头像，选择 ​Settings。
   - 在左侧边栏中，点击 ​SSH and GPG keys。
   - 点击绿色的 ​New SSH key​ 按钮。
   - 在 "Title" 字段中，为这个密钥起一个易于识别的名字（例如 "My Production Server" 或 "AWS EC2"）。
   - 在 "Key" 字段中，粘贴你刚刚从服务器复制的整个公钥内容。
   - 点击 ​Add SSH key。

3. 测试 SSH 连接

```bash
ssh -T git@github.com
```

### 密钥文件权限

确保你的 ~/.ssh 目录和密钥文件的权限是正确的，这是 SSH 客户端的一个安全要求。

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519   # 确保私钥权限是 600
chmod 644 ~/.ssh/id_ed25519.pub # 公钥权限可以是 644
```

### 使用多个密钥

如果你为不同的服务（如 GitHub, GitLab）配置了不同的密钥，或者使用了非默认名称的密钥，你需要编辑 ~/.ssh/config 文件来指定针对哪个主机使用哪个密钥。例如：

```bash
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/your_special_key_for_github
```

## SSH 免密登录服务器

1. 生成本地密钥对

```bash
# 生成密钥对（如果已有可跳过）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 默认保存位置：~/.ssh/id_rsa（私钥）和 ~/.ssh/id_rsa.pub（公钥）
# windows默认保存位置：C:\Users\[username]\.ssh\id_rsa
```

2. 复制公钥到服务器

方法一：使用 `ssh-copy-id`

```bash
ssh-copy-id username@server_ip -p port_number
# 示例：ssh-copy-id user@192.168.1.100 -p 22
```

方法二：编辑服务器的 `authorized_keys` 配置

```bash
# 1. 查看公钥内容
cat ~/.ssh/id_rsa.pub

# 2. 登录服务器，将公钥内容添加到 ~/.ssh/authorized_keys
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "你的公钥内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

3. 测试 ssh 连接

```bash
ssh username@server_ip -p port_number
```

## VSCode远程连接配置

```bash
# ~/.ssh/config 文件内容示例
Host myserver  # 自定义别名
    HostName server_ip_or_domain  # 服务器IP或域名
    User your_username           # 用户名
    Port 22                     # 端口号，默认22
    IdentityFile ~/.ssh/id_rsa  # 私钥路径
```


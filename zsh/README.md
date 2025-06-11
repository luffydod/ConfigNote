# 😼 ZSH终端配置

## 😵 install zsh

```bash
sudo apt install zsh -y

# 😋 设置默认终端为zsh
chsh -s /bin/zsh
```

## 注意事项

- zsh 会对通配符（比如 *）进行 文件名扩展（globbing）
  - 解决1：用引号包裹通配符
  - 解决2：关闭 zsh 的 nomatch 检查 `setopt no_nomatch`
- 1

## 😞 install oh-my-zsh

[😪 site](https://ohmyz.sh/#install)

```bash
# 😻 via curl
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# 🤠 via wget
sh -c "$(wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
# 😳 via 国内curl镜像
sh -c "$(curl -fsSL https://gitee.com/pocmon/ohmyzsh/raw/master/tools/install.sh)
```

## 😠 oh-my-zsh主题配置

```bash
# 😖 编辑配置
vim ~/.zshrc

ZSH_THEME="[NAME]"

source ~/.zshrc

# 😿 内置主题
ls ~/.oh-my-zsh/themes
```

### 🥴 powerlevel10k

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

# 🥺 可以使用 gitee.com 上的官方镜像加速下载
git clone --depth=1 https://gitee.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

在 ~/.zshrc 设置 ZSH_THEME="powerlevel10k/powerlevel10k"。接下来，终端会自动引导你配置 powerlevel10k。

## 🙊 oh-my-zsh插件

内置插件可以在 `~/.oh-my-zsh/plugins` 中查看，自定义插件可以安装到 `~/.oh-my-zsh/custom/plugins` 目录。

1. 命令提示插件 zsh-autosuggestions

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# 😶 可以使用下面任意一个加速下载
# 🤖 加速1
git clone https://github.moeyy.xyz/https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
# 💀 加速2
git clone https://gh.xmly.dev/https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
# 🤯 加速3
git clone https://gh.api.99988866.xyz/https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

2. 命令语法校验插件 zsh-syntax-highlighting

```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# 😶 可以使用下面任意一个加速下载
# 😞 加速1
git clone https://github.moeyy.xyz/https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
# 🥹 加速2
git clone https://gh.xmly.dev/https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
# 😂 加速3
git clone https://gh.api.99988866.xyz/https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

3. 仓库地址网页跳转插件 git-open

```bash
git clone https://github.com/paulirish/git-open.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/git-open

# 🤪 加速1
git clone https://github.moeyy.xyz/https://github.com/paulirish/git-open.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/git-open
```

## 😩 zsh启用插件

修改 `~/.zshrc` ：

```bash
# 😗 修改plugins
plugins=(git zsh-autosuggestions zsh-syntax-highlighting z extract git-open)
```

# 🥶 NeoVim

[🤮 帮助 - Neovim 文档 - Neovim 编辑器](https://neovim.fullstack.org.cn/doc/user/)

## 🫠 install on windows

[🥴 neovim/INSTALL.md at master · neovim/neovim](https://github.com/neovim/neovim/blob/master/INSTALL.md)

通过`nvim-win64.msi`一键安装。

[😄 neovim/nvim-lspconfig: Quickstart configs for Nvim LSP](https://github.com/neovim/nvim-lspconfig)

```bash
git clone https://github.com/neovim/nvim-lspconfig C:/Users/ACEone/.config/nvim/pack/nvim/start/nvim-lspconfig
```

## 😃 install on linux

```bash
sudo apt-get install neovim
```

## 😳 base-config

创建配置文件夹

```bash
mkdir -p ~/.config/nvim
```

## 😻 lazyvim

[🥵 🛠️ Installation | LazyVim](https://www.lazyvim.org/installation)

```bash
# required
mv ~/.config/nvim{,.bak}

# optional but recommended
mv ~/.local/share/nvim{,.bak}
mv ~/.local/state/nvim{,.bak}
mv ~/.cache/nvim{,.bak}

# Clone the starter
git clone https://github.com/LazyVim/starter ~/.config/nvim

# Remove the .git folder, so you can add it to your own repo later
rm -rf ~/.config/nvim/.git

# start neovim!
nvim
```

> It is recommended to run `:LazyHealth` after installation. This will load all plugins and check if everything is working correctly.
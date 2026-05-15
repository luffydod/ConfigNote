# 👺 Allgoo Dev

## 😺 FIX PATH

生成的可执行程序路径不在 `PATH` 中

```bash
  Stored in directory: /tmp/pip-ephem-wheel-cache-uykkwqif/wheels/e6/ea/cf/c5237ff6bbb047515293fc75501b28c2a9712603715ac4754c
Successfully built allgoo-cli
Installing collected packages: allgoo-cli
  WARNING: The scripts agent and allgoo are installed in '/home/allgoo/.local/bin' which is not on PATH.
  Consider adding this directory to PATH or, if you prefer to suppress this warning, use --no-warn-script-location.
Successfully installed allgoo-cli-0.8.16
```

需要添加环境变量

```bash
export PATH="/home/allgoo/.local/bin:${PATH}"
```

## 🥲 break system packages

```bash
allgoo@e86b61d14131:~/workspace/allgoo$ pip install -e .
error: externally-managed-environment

× This environment is externally managed
╰─> To install Python packages system-wide, try apt install
    python3-xyz, where xyz is the package you are trying to
    install.
    
    If you wish to install a non-Debian-packaged Python package,
    create a virtual environment using python3 -m venv path/to/venv.
    Then use path/to/venv/bin/python and path/to/venv/bin/pip. Make
    sure you have python3-full installed.
    
    If you wish to install a non-Debian packaged Python application,
    it may be easiest to use pipx install xyz, which will manage a
    virtual environment for you. Make sure you have pipx installed.
    
    See /usr/share/doc/python3.12/README.venv for more information.

note: If you believe this is a mistake, please contact your Python installation or OS distribution provider. You can override this, at the risk of breaking your Python installation or OS, by passing --break-system-packages.
hint: See PEP 668 for the detailed specification.
```

需要添加环境变量

```bash
export PIP_BREAK_SYSTEM_PACKAGES=1
```

## 💩 免密登录挂载姿势

ssh 目录权限检查

```bash
chown -R allgoo:allgoo /home/allgoo/.ssh
chmod 700 /home/allgoo/.ssh
chmod 600 /home/allgoo/.ssh/authorized_keys
```

为你这个容器单独建一个公钥存放目录。

在宿主机上执行：

```bash
mkdir -p ~/allgoo_ssh_keys
cp ~/.ssh/authorized_keys ~/allgoo_ssh_keys/
# 确保权限正确
chmod 700 ~/allgoo_ssh_keys
chmod 600 ~/allgoo_ssh_keys/authorized_keys
```

修改你的 docker-compose.yml：

```yaml
volumes:
  # 只挂载专门给这个容器准备的公钥目录，绝不暴露私钥！
  - ~/allgoo_ssh_keys:/home/allgoo/.ssh:ro
```

这样既避免了单文件的 Inode 问题，又保护了你的私钥安全。

## 😜 pip 依赖修复

从你的终端输出 Requirement already satisfied: numpy<2.0.0... (1.26.4) 可以看出，你的环境里确实已经是 NumPy 1.26.4 了。

那为什么还会报 NumPy 2.0 的错？
因为 fasttext 是 Meta（Facebook）几百年前开源的一个老库，早就没人维护了。当你之前在含有 NumPy 2.0 的环境下安装它时，它的底层 C/C++ 扩展已经按照 2.0 的内存指针方式编译锁死了。现在就算你在 Python 层把 NumPy 降级，它底层的 C 扩展依然在“刻舟求剑”，导致内存拷贝机制崩溃。

既然包管理器 pip 已经理不清这笔烂账了，我们直接采取最暴力、也最立竿见影的“外科手术”级修复方案：直接修改它的源代码。

仔细看报错提示里的这句话：

If using np.array(obj, copy=False) replace it with np.asarray(obj)

官方连怎么改代码都告诉你了！我们直接用 Linux 的 sed 命令帮它把这行写死的错代码替换掉。

请直接在终端复制并运行下面这行命令（它会瞬间将目标文件里的错代码替换为正确的 np.asarray）：

```bash
sudo sed -i 's/np.array(probs, copy=False)/np.asarray(probs)/g' /usr/local/lib/python3.12/dist-packages/fasttext/FastText.py
```
# 😞 Allgoo Dev

## 🤢 FIX PATH

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

## 😙 break system packages

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

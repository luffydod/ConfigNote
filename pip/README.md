# 🤖 pip

## 🙈 虚拟环境下包冲突

通过 `print(sys.path)` 发现 `~/.local/lib/*` 被加载。
Python 依然在加载你主目录里的用户包目录，导致导入了污染的 torch（或其他）包。

解决方法，修改环境变量，用来控制是否加载 用户级的 site-packages 目录：

```bash
# 😌 默认情况下，这个目录会被自动加入到 Python 的模块搜索路径 sys.path 中
~/.local/lib/pythonX.Y/site-packages

# 🤔 只会加载虚拟环境内的包
export PYTHONNOUSERSITE=1
```

## 😮 镜像源配置

```bash
# 😾 配置清华源
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

```

## 加载系统包配置

### Venv

`/path/to/venv/pyvenv.cfg`: `include-system-site-packages = true`

### Conda

conda 下的虚拟环境默认是不继承系统 Python 包的，想要修改：
1. 设置环境变量（临时）
```bash
export PYTHONNOUSERSITE=0
```
2. 手动删除 no-global-site-packages.txt（不推荐）

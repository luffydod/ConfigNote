# ROS2

## install

1. 使用鱼香ros脚本安装

[site](https://fishros.org.cn/forum/topic/20/%E5%B0%8F%E9%B1%BC%E7%9A%84%E4%B8%80%E9%94%AE%E5%AE%89%E8%A3%85%E7%B3%BB%E5%88%97)

```bash
wget http://fishros.com/install -O fishros && . fishros
```

2. install gz sim

```bash
sudo apt install ros-${ROS_DISTRO}-ros-gz

# Fortress uses "ign gazebo" instead of "gz sim"
gz sim

```

3. install moveit2

```bash
# 暴力install所有
sudo apt install ros-${ROS_DISTRO}-moveit-*

# install moveit-py if using Moviet Python API
sudo apt install ros-${ROS_DISTRO}-moveit-py
```

4. install ros2 control

```bash
sudo apt install ros-${ROS_DISTRO}-ros2-control

# for gz sim
sudo apt install ros-${ROS_DISTRO}-gz-ros2-control
```

## zsh

如果使用了 zsh 终端，原有的环境变量配置 `~/.bashrc` 要记得对应迁移到 `~/.zshrc`。
此外，常见的更新项目环境变量要替换：

```bash
# in bashrc
source /opt/ros/jazzy/setup.bash
# in project 
source install/setup.bash

# in zshrc
source /opt/ros/jazzy/setup.zsh
# in project use zsh
source install/setup.zsh
```

## Domain ID

in `~/.bashrc`: 

```bash
export ROS_DOMAIN_ID=36 # 0~100
```

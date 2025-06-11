FROM ubuntu:noble-20250404

# Automatic platform ARGs in the global scope
# https://docs.docker.com/reference/dockerfile/#automatic-platform-args-in-the-global-scope
ARG TARGETPLATFORM
ARG TARGETARCH

# The QEMU_CPU option is used to speed up arm64 image builds,
# amd64 is unaffected as it does not use QEMU.
# This environment variable is only declared at build time.
ARG QEMU_CPU

SHELL ["/bin/bash", "-c"]

# 设置语言环境和时区
ENV LC_ALL=C.UTF-8 \
    LANG=C.UTF-8 \
    TZ=Asia/Shanghai

# 配置时区链接
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
ARG DEBIAN_FRONTEND=noninteractive
RUN sed 's/\/.*com/\/\/mirrors.aliyun.com/g' /etc/apt/sources.list -i

# Upgrade OS
RUN apt-get update -q && \
    DEBIAN_FRONTEND=noninteractive apt-get upgrade -y && \
    apt-get autoclean && \
    apt-get autoremove && \
    rm -rf /var/lib/apt/lists/*

# Install Ubuntu Mate desktop
RUN apt-get update -q && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
        ubuntu-mate-desktop && \
    apt-get autoclean && \
    apt-get autoremove && \
    rm -rf /var/lib/apt/lists/*

# Add Package
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
        tigervnc-standalone-server tigervnc-common \
        supervisor wget curl gosu git sudo python3-full python3-pip tini \
        build-essential vim sudo lsb-release locales \
        bash-completion tzdata terminator && \
    apt-get autoclean && \
    apt-get autoremove && \
    rm -rf /var/lib/apt/lists/*

# noVNC and Websockify
RUN git config --global url."https://gitclone.com/".insteadOf https://

RUN git clone https://github.com/AtsushiSaito/noVNC.git -b add_clipboard_support /usr/lib/novnc

# RUN pip install --no-cache-dir --break-system-packages git+https://github.com/novnc/websockify.git@v0.12.0
COPY websockify-0.13.0.tar.gz /tmp/

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
    python3-dev gcc gfortran && \
    apt-get autoclean && \
    apt-get autoremove && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --break-system-packages numpy -i https://pypi.tuna.tsinghua.edu.cn/simple

COPY websockify-0.10.0.tar.gz /tmp/

RUN pip install --no-cache-dir --break-system-packages -i https://pypi.tuna.tsinghua.edu.cn/simpl \
    /tmp/websockify-0.10.0.tar.gz && \
    rm /tmp/websockify-0.10.0.tar.gz /tmp/websockify-0.13.0.tar.gz

RUN ln -s /usr/lib/novnc/vnc.html /usr/lib/novnc/index.html

# Set remote resize function enabled by default
RUN sed -i "s/UI.initSetting('resize', 'off');/UI.initSetting('resize', 'remote');/g" /usr/lib/novnc/app/ui.js

# Disable auto update and crash report
RUN sed -i 's/Prompt=.*/Prompt=never/' /etc/update-manager/release-upgrades
RUN sed -i 's/enabled=1/enabled=0/g' /etc/default/apport

# Install VSCodium
RUN wget https://gitlab.com/paulcarroty/vscodium-deb-rpm-repo/raw/master/pub.gpg \
    -O /usr/share/keyrings/vscodium-archive-keyring.asc && \
    echo 'deb [ signed-by=/usr/share/keyrings/vscodium-archive-keyring.asc ] https://paulcarroty.gitlab.io/vscodium-deb-rpm-repo/debs vscodium main' \
    | tee /etc/apt/sources.list.d/vscodium.list && \
    apt-get update -q && \
    apt-get install -y codium && \
    apt-get autoclean && \
    apt-get autoremove && \
    rm -rf /var/lib/apt/lists/*

# Enable apt-get completion after running `apt-get update` in the container
RUN rm /etc/apt/apt.conf.d/docker-clean

# clean vnc ignore file
RUN cd /usr/lib/novnc && \
    rm -rf .git* *.md tests
 
COPY ./entrypoint.sh /
ENTRYPOINT [ "/bin/bash", "-c", "/entrypoint.sh" ]

ENV USER ubuntu
ENV PASSWD ubuntu
#!/usr/bin/env bash
# ============================================================
# 迁移单个用户目录到新磁盘，并在原路径挂载回来（v1.1）
# ============================================================

set -euo pipefail

# ---------- 用户可配置部分 ----------
USERNAME="${1:-}"             # 第一个参数：用户名
TARGET_BASE="/mnt/sdb"         # 新磁盘挂载点
RSYNC_OPTS="-aAXHv --progress"
FSTAB_FILE="/etc/fstab"
LOG_FILE="/var/log/migrate_user_home.log"
# ------------------------------------

# ---------- 彩色输出 ----------
GREEN="\033[1;32m"; YELLOW="\033[1;33m"; RED="\033[1;31m"; NC="\033[0m"
log() { echo -e "${GREEN}[INFO]${NC} $*" | tee -a "$LOG_FILE"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*" | tee -a "$LOG_FILE"; }
err() { echo -e "${RED}[ERROR]${NC} $*" | tee -a "$LOG_FILE" >&2; exit 1; }

# ---------- 前置检查 ----------
[[ $EUID -ne 0 ]] && err "请使用 root 用户或 sudo 运行此脚本。"
[[ -z "$USERNAME" ]] && err "用法: sudo $0 <username>"

USER_HOME="/home/$USERNAME"
TARGET_HOME="$TARGET_BASE/$USERNAME"

id "$USERNAME" &>/dev/null || err "用户 $USERNAME 不存在。"
[[ -d "$USER_HOME" ]] || err "用户目录 $USER_HOME 不存在。"
mountpoint -q "$TARGET_BASE" || err "$TARGET_BASE 未挂载，请先确认 /dev/sdb1 已挂载。"

# ---------- 创建目标目录 ----------
log "创建目标目录: $TARGET_HOME ..."
mkdir -p "$TARGET_HOME"
chown root:root "$TARGET_HOME"

# ---------- 复制数据 ----------
log "开始复制数据（使用 rsync）..."
rsync $RSYNC_OPTS "$USER_HOME/" "$TARGET_HOME/" | tee -a "$LOG_FILE"

# ---------- 智能差异检测 ----------
log "进行差异检测（自动忽略临时文件）..."
DIFF_IGNORE=(
  ".cache"
  ".gvfs"
  ".dbus"
  "snap"
  ".config/ibus"
  ".config/gtk-2.0"
  ".config/gtk-3.0"
  ".local/share/themes"
  ".themes"
)
DIFF_ARGS=()
for pattern in "${DIFF_IGNORE[@]}"; do
  DIFF_ARGS+=(--exclude="$pattern")
done

if ! diff -r "${DIFF_ARGS[@]}" "$USER_HOME" "$TARGET_HOME" >/dev/null 2>&1; then
  warn "检测到差异（仅限非关键或临时文件，可忽略）。"
else
  log "数据复制校验一致。"
fi

# ---------- 备份旧目录 ----------
log "备份旧目录..."
mv "$USER_HOME" "${USER_HOME}.bak"
mkdir -p "$USER_HOME"

# ---------- 临时绑定挂载 ----------
log "绑定挂载: $TARGET_HOME -> $USER_HOME"
mount --bind "$TARGET_HOME" "$USER_HOME"

# ---------- 权限修复 ----------
log "修正权限..."
chown -R "$USERNAME:$USERNAME" "$TARGET_HOME"

# ---------- 验证挂载 ----------
log "验证挂载状态："
findmnt "$USER_HOME" | tee -a "$LOG_FILE"

# ---------- 用户访问测试 ----------
log "测试用户访问："
if sudo -u "$USERNAME" ls "$USER_HOME" >/dev/null 2>&1; then
  log "用户访问正常。"
else
  warn "用户访问异常，请人工检查。"
fi

# ---------- 更新 /etc/fstab ----------
UUID=$(blkid -s UUID -o value /dev/sdb1)
if ! grep -q "$TARGET_HOME" "$FSTAB_FILE"; then
  log "更新 /etc/fstab ..."
  echo "# 自动添加: 绑定挂载 $USERNAME home" >> "$FSTAB_FILE"
  echo "$TARGET_HOME   $USER_HOME   none   bind   0   0" >> "$FSTAB_FILE"
else
  warn "fstab 已存在该挂载条目，跳过。"
fi

# ---------- 最终测试 ----------
log "测试挂载..."
umount "$USER_HOME"
mount -a

log "最终挂载验证："
df -h "$USER_HOME" | tee -a "$LOG_FILE"

echo -e "\n${GREEN}🎉 用户 $USERNAME 的 home 目录已成功迁移到 $TARGET_HOME${NC}"
echo "旧目录已备份为 ${USER_HOME}.bak，可在验证后删除。"
echo
echo "如需回滚："
echo "  sudo umount $USER_HOME"
echo "  sudo rm -rf $USER_HOME && sudo mv ${USER_HOME}.bak $USER_HOME"
echo
log "迁移完成 ✅"

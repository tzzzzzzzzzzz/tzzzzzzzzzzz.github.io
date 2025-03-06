---
title: rclone的使用
date: 2025-01-17 14:26:17
tags: "实用教程"
categories: 
    - "NAS"
keywords: "实用教程"
top_img: 'https://minapi.tianxiyou.site:43200/tianzhepic/2025/01/17/20250117151902404.png'
cover: 'https://minapi.tianxiyou.site:43200/tianzhepic/2025/01/17/20250117151902404.png'
---
# 群晖

```bash
# 安装
sudo -v ; curl https://rclone.org/install.sh | sudo bash
# 增加挂载点
reclone config
# 映射挂载目录
rclone mount alist_dav:/ /volume1/docker/rclone/alist --use-mmap --umask 000 --network-mode --no-check-certificate --allow-other --allow-non-empty --dir-cache-time 4h --cache-dir=/volume1/docker/rclone/cache --header "Referer:https://www.aliyundrive.com/" --vfs-cache-mode full --buffer-size 512M --vfs-read-chunk-size 64M --vfs-read-chunk-size-limit 1G --vfs-cache-max-size 10G --daemon
# 卸载挂载目录
fusermount -qzu /volume1/docker/rclone/alist

# 检查更新
rclone selfupdate --check
# 更新到指定版本
rclone selfupdate --ver
```
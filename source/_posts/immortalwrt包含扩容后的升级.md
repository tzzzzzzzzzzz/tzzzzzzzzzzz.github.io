---

title: immortalwrt包含扩容后的升级
date: 2025-11-05 09:24:47
tags:
    - "实用教程"
categories: " 技术分享"
description: 必须用最新版本的执念会毁掉人类。
top_img: 'https://cdn.jsdelivr.net/gh/tzzzzzzzzzzz/blog-img@main/G4xHJSWboAAgjB0.jpeg'
cover: 'https://cdn.jsdelivr.net/gh/tzzzzzzzzzzz/blog-img@main/G4xHJSWboAAgjB0.jpeg'

---
# 前言

在群晖中通过虚拟机部署了immortalwrt 之后，看软件包的空间即将不够了，所以按照谷歌的方法进行扩容。

扩容后，immortalwrt 升级时出现了一些错误，也没找到具体问题，但是大概率是因为扩容导致的，又搜了一下解决方案，现在记录一下。

# 固件下载

1.  下载地址：https://downloads.immortalwrt.org/releases/
2.  下载的文件路径：https://downloads.immortalwrt.org/releases/24.10.2/targets/x86/64/immortalwrt-24.10.2-x86-64-generic-squashfs-combined.img.gz 替换24.10.2为最新

immortalwrt 的值守更新时好时坏，还是建议通过immortalwrt 的固件刷写进行固件上传更新，更加稳定可靠。

**更新之前记得拍快照！**

**更新之前记得拍快照！**

**更新之前记得拍快照！**

# 遇到的问题

- 因为\[扩容\]([OpenWrt 存储空间扩容的两种方案 - OpenWrt开发者之家](:/b8fa24a69b7b443190a2178478583f6c))，升级后无法识别扩容空间

1.  先卸载在**已挂载的文件系统**中挂载的/dev/sda1（这一步也许也不需要。）

2.  编辑**挂载点**中挂载的/dev/sda1，点击启用，挂载点选择：作为根文件系统使用（/）

3.  保存并应用

4.  执行以下语句

    ```linux
    mkdir -p /tmp/introot
    mkdir -p /tmp/extroot
    mount --bind / /tmp/introot
    mount /dev/sdb1 /tmp/extroot # 修改后
    tar -C /tmp/introot -cvf - . | tar -C /tmp/extroot -xf -
    umount /tmp/introot
    umount /tmp/extroot
    ```

5.  **此时并没有识别到之前扩容空间中的内容，必须要重启：reboot。**

- 更新之后openclash报错"Start TUN listening error: configure tun interface: no such file or directory"

  确保系统已安装 **必需的依赖包**，特别是 `kmod-tun`（提供 `tun` 模块）和 `ip-full`（提供完整的 `ip` 路由命令工具）。安装命令因系统而异：

  ```bash
  # OpenWrt 系统 (opkg)
  opkg update
  opkg install kmod-tun ip-full
  ```


# 其他

因为使用的是immortalwrt+openclash，还用上smart内核，所以这里也贴一下openclash相关的下载内容：

immortalwrt固件：[ **点击这里**](https://firmware-selector.immortalwrt.org/)

openclash smart 核心地址：[点击这里](https://github.com/vernesong/mihomo/releases)

openclash luci地址：[ **点击这里**](https://github.com/vernesong/OpenClash)

openclash核心地址：[ **点击这里**](https://github.com/vernesong/OpenClash/tree/core/master)

clashmeta官方核心地址：[ **点击这里**](https://github.com/MetaCubeX/mihomo/tree/Alpha)

adguardhome luci地址：[ **点击这里**](https://github.com/kongfl888/luci-app-adguardhome/releases)

adguardhome核心地址：[ **点击这里**](https://github.com/AdguardTeam/AdGuardHome)

订阅后端subconverter支持文档：[ **点击这里**](https://github.com/tindy2013/subconverter/blob/master/README-cn.md)

规则集地址：[ **ACL4SSR**](https://github.com/ACL4SSR/ACL4SSR/tree/master/Clash)  [ **blackmatrix7**](https://github.com/blackmatrix7/ios_rule_script/tree/master/rule/Clash)

规则文件：[ **点击这里**](https://drive.google.com/drive/folders/1j2uMkA_R8ppINtKkQY78gJrBJjBPtJia)

DNS泄露检测：[ **网站一**](https://ipleak.net/)  [ **网站二**](https://browserleaks.com/dns)

**来源是[七尺宇](https://qichiyu.blogspot.com/)大佬。**


---

title: 群晖部署immortalwrt记录
date: 2025-03-13 17:23:45
tags:
    - "实用教程"
categories: " 技术分享"
description: 简单记录一下部署过程。
top_img: 'https://cdn.jsdelivr.net/gh/tzzzzzzzzzzz/blog-img@main/20250313172545067.png'
cover: 'https://cdn.jsdelivr.net/gh/tzzzzzzzzzzz/blog-img@main/20250313172545067.png'

---
### 下载

地址：https://downloads.immortalwrt.org

### 安装映像

1. 找的是最新版本的 / [targets](https://downloads.immortalwrt.org/releases/24.10.0/targets/) / [x86](https://downloads.immortalwrt.org/releases/24.10.0/targets/x86/) / [64](https://downloads.immortalwrt.org/releases/24.10.0/targets/x86/64/) / 中的`generic-squashfs-combined.img.gz`名称的包。

2. 群晖使用需要先**解压**

3. 在 VMM 中点击映像-硬盘映像-新增，添加刚才解压出来的 img 文件

4. 上传完成之后，确保状态**良好**

   ![](https://cdn.jsdelivr.net/gh/tzzzzzzzzzzz/blog-img@main/20250313163800829.png)

### 安装虚拟机

1. 点击虚拟机-新增![](https://cdn.jsdelivr.net/gh/tzzzzzzzzzzz/blog-img@main/20250313164054669.png)
2. 选择 Linux![](https://cdn.jsdelivr.net/gh/tzzzzzzzzzzz/blog-img@main/20250313164122446.png)
3. 按照下图的填写配置内容：![image-20250313164213593](/Users/tianzhe/Library/Application Support/typora-user-images/image-20250313164213593.png)

### openwrt 初始化设置

1. 创建虚拟机之后，在VMM虚拟机界面选中刚才创建的openWRT虚拟机，点击连接

2. 取决于运行速度和磁盘性能，第一次开机需要等待十几秒到一分钟时间，在远程连接窗口里按一下回车，如果出现LEDE画面和闪烁的光标，说明已经启动完成可以开始配置了

3. 输入以下命令后回车，修改openwrt的默认ip地址：

   ```ssh
   vi /etc/config/network
   ```

4. 在命令行界面上按一下键盘上的i键进入修改，把config interface ‘lan’下边的option ipaddr从192.168.1.1改成你主路由同网断的ip，ip地址不要和其他设备重复了：![](https://cdn.jsdelivr.net/gh/tzzzzzzzzzzz/blog-img@main/20250313165301602.png)

5. 作为旁路由，配置接口内容，注意设备这个选项，如果选错了无法联网。![](https://cdn.jsdelivr.net/gh/tzzzzzzzzzzz/blog-img@main/20250313165918580.png)

6. 如果是原生的immortalwrt 固件是原生的 webui，安装非常流行的[ArgonTheme](https://github.com/jerrykuku/luci-theme-argon)主题，immortalwrt软件包可能需要代理，所以现`opkg update`一下，看看能不能更新，如果不能更新，先从网络-接口改一下网关和 DNS 指向一个部署好的代理地址进行下载。

   ```ssh
   opkg install luci-compat
   opkg install luci-lib-ipkg
   wget --no-check-certificate https://github.com/jerrykuku/luci-theme-argon/releases/download/v2.3.2/luci-theme-argon_2.3.2-r20250207_all.ipk
   opkg install luci-theme-argon*.ipk
   ```


7. 安装 docker 相关内容![](https://cdn.jsdelivr.net/gh/tzzzzzzzzzzz/blog-img@main/20250313170246248.png)

8. 安装 openclash


   1. 在https://github.com/vernesong/OpenClash/releases 下载最新的 ipk 文件。
   2. 点击openwrt 中的系统-软件包，点击上传软件包，上传下载的 ipk 文件。
   3. 清除浏览器缓存然后刷新，可以看到服务中出现 openclash。
   4. 具体的 openclash 用法和教学，可以参考[七尺宇](https://www.youtube.com/@qichiyu)大佬相关视频，讲的非常详细。

9. 安装adguardhome，用来自建 openclash 中 NDS 覆写的`nameserver`

   ```dockerfile
   docker run --rm --privileged multiarch/qemu-user-static --reset -p yes --credential yes
   ```

10. 安装subconverter 订阅转换工具

    ```dockerfile
    ---
    version: '3'
    services:
      subconverter:
        image: tindy2013/subconverter:latest
        container_name: subconverter
        ports:
          - "25500:25500"
        restart: always
    ```

11. 安装 sublink 订阅集合工具

    ```dockerfile
    docker run --name sublinkx -p 8000:8000 \
    -v $PWD/db:/app/db \
    -v $PWD/template:/app/template \
    -v $PWD/logs:/app/logs \
    -d jaaksi/sublinkx
    ```

### 设备使用

在需要代理的设备上进行网关和 NDS 设置指向openwrt 的静态地址即可。

![](https://cdn.jsdelivr.net/gh/tzzzzzzzzzzz/blog-img@main/20250313172545067.png)
---
title: RSS 服务自建之路
date: 2024-07-05
tags: 
    - "docker"
    - "RSS"
    - "实用教程"
categories: 
    - "NAS"
keywords: "NAS"
description: 折腾rsshub、freshrss、miniflux全记录
top_img: 'https://cdn.jsdelivr.net/gh/tzzzzzzzzzzz/blog-img@main/20250117100837942.png'
cover: 'https://cdn.jsdelivr.net/gh/tzzzzzzzzzzz/blog-img@main/20250117100837942.png'
---
# **rss是什么？**

> RSS（英文全称：RDF Site Summary 或 Really Simple Syndication[2]），中文译作简易信息聚合[3]，也称聚合内容[4]，是一种消息来源格式规范，用以聚合多个网站更新的内容并自动通知网站订阅者。使用 RSS 后，网站订阅者便无需再手动查看网站是否有新的内容，同时 RSS 可将多个网站更新的内容进行整合，以摘要的形式呈现，有助于订阅者快速获取重要信息，并选择性地点阅查看。
> 
> 
> “资源描述框架站点摘要”（RDF Site Summary）即 RSS 的英文原意，后来通过[**逆向首字母缩略词**](https://zh.wikipedia.org/wiki/%E9%80%86%E5%90%91%E9%A6%96%E5%AD%97%E6%AF%8D%E7%BC%A9%E7%95%A5%E8%AF%8D)变更为“Really Simple Syndication”（简易信息聚合）。将新闻标题、摘要（Feed）、内容按照用户的要求，推送至用户的桌面便是 RSS 的目的。有时 RSS 一词大体上意为“社会性书签”，包括各种 RSS 的不同格式；例如，[**Blogspace**](https://zh.wikipedia.org/w/index.php?title=Blogspace&action=edit&redlink=1) 对使用网摘于一集成器内之动作标为 RSS info 和 RSS reader，虽然它的第一个句子就包含明确的 [**Atom**](https://zh.wikipedia.org/wiki/Atom_(%E6%A8%99%E6%BA%96)) 格式：“RSS 和 Atom 文件能够用简单的格式从网站更新消息至你的电脑！”
> 
> RSS 摘要可以借由 RSS 阅读器、feed reader 或 aggregator 等网页或以桌面为架构的软件来阅读。标准的 [**XML**](https://zh.wikipedia.org/wiki/XML) 档式可允许信息在一次发布后通过不同的程序阅览。用户借由将网摘输入 RSS 阅读器，或是用鼠标点取浏览器上指向订阅程序的 RSS 小图标 [**URI**](https://zh.wikipedia.org/wiki/URI)（非通常所称的 [**URL**](https://zh.wikipedia.org/wiki/URL)）来订阅网摘。RSS 阅读器会定期检阅网站是否有更新，然后下载至监看用户界面。
> 
> RSS 可以是以下三种解释中任何一种的缩写，但其实这三者都是指同一种联合供稿（Syndication）的技术：
> 
> - RSS 2.0（Really Simple Syndication）
> - RSS 0.91, RSS 1.0（[**RDF**](https://zh.wikipedia.org/wiki/%E8%B3%87%E6%BA%90%E6%8F%8F%E8%BF%B0%E6%A1%86%E6%9E%B6)（Resource Description Framework）Site Summary）
> - RSS 0.9 and 1.0（Rich Site Summary）

# **为什么要用rss？**

> 使用 RSS（Really Simple Syndication）有许多好处，尤其是在获取和管理大量信息时。以下是一些主要原因：
> 
> 1. **简化信息获取**：通过订阅 RSS 源，用户可以集中获取多个网站的最新内容，而无需逐个访问这些网站。
> 2. **节省时间**：RSS 使用户能够在一个地方查看所有订阅网站的最新更新，避免了手动搜索和访问多个网站的时间。
> 3. **信息定制**：用户可以选择订阅他们感兴趣的特定内容源，确保他们收到的都是与自己相关的信息。
> 4. **无广告干扰**：RSS 通常只提供内容而不包含广告，这意味着用户可以获得更干净、更集中的信息。
> 5. **离线阅读**：许多 RSS 阅读器允许用户将内容下载到本地设备上，方便用户在没有网络连接时阅读。
> 6. **实时更新**：RSS 源会自动更新，用户可以实时获取最新的信息和文章。
> 7. **保持隐私**：相比直接访问网站，使用 RSS 不会暴露用户的浏览习惯，有助于保护用户隐私。
> 
> 通过 RSS，用户可以更加高效、方便地管理和获取他们感兴趣的内容。
> 

上面是 ChatGPT 说的，实际上对我来说最主要的是：

1. 信息类的国内 APP 都太过臃肿了
2. 输出的内容也不够优质
3. 铺天盖地的牛皮癣广告
4. 每种类型的信息内容，需要到不同的平台去查看，不能做到 **all-in-one**
5. 不会被大数据限制推送阅读的范围，可以做到想看什么就看什么
6. **~~需要折腾~~**

# **RSS 的食用方式**

## **阅读 RSS 的工具**

1. 苹果生态
    - [**Reeder**](https://reederapp.com/)，买断制，一次付费苹果生态内全部能用，支持的协议比较全面。
    - [**Fluent reader**](https://github.com/yang991178/fluent-reader)，开源免费的 rss 阅读器，全平台免费
2. windows 生态
    - [**Fluent reader**](https://github.com/yang991178/fluent-reader)
3. 安卓生态
    - [**feedme**](https://github.com/seazon/FeedMe)

## **如何使用？**

### **网站自带的 RSS**

有一些自带rss 的网站、博客，比如本站的 rss 地址：[**https://blog.tianxiyou.site/rss/feed.xml**](https://blog.tianxiyou.site/rss/feed.xml)，还有少数派的：[**https://sspai.com/feed**](https://sspai.com/feed)。

这些地址直接通过上述的**阅读 RSS 的工具**进行订阅，然后就能看到网站提供的 RSS 内容了。

但是这样有两个问题：

1. 阅读器因为平台的限制，可能不能进行阅读进度同步，也就是有些文章已读未读都无法记录，下次换个设备，还是得重新筛选一遍信息。
2. 有些网站，不提供 RSS，但是又有非常好的内容想要及时的获取，比如一些优质论坛、图片壁纸发布网站等等，不可能随时监控他们有没有更新，这个时候，不提供 rss 的站怎么订阅更新呢？

### **自建订阅源——解决不提供 rss 服务的网站的问题**

### **rsshub的安装**

这个时候就要拉出来大名鼎鼎的 [**rsshub**](https://docs.rsshub.app/) 了，他的作用就是对各种网站生成 rss 地址，涵盖了世界上大部分知名网站，具体的介绍可以访问文档查看不再展开。

!https://minapi.tianxiyou.site:43200/tianzhepic/2024/07/05/202407051720051.png

这里只说一下[**docker-compose**](https://docs.docker.com/compose/install/)部署方式，下面是我安装的实例：

```yaml
version: '3.9'

services:
    rsshub:
        # two ways to enable puppeteer:
        # * comment out marked lines, then use this image instead: diygod/rsshub:chromium-bundled
        # * (consumes more disk space and memory) leave everything unchanged
        image: diygod/rsshub
        restart: always
        ports:
            - '1200:1200' # 对外映射端口（可改）：实际容器端口（不可改）
        environment:
            NODE_ENV: production
            CACHE_TYPE: redis
            REDIS_URL: 'redis://redis:6379/'
            PUPPETEER_WS_ENDPOINT: 'ws://browserless:3000'  # marked
        depends_on:
            - redis
            - browserless  # marked

    browserless:  # marked
        image: browserless/chrome  # marked
        restart: always  # marked
        ulimits:  # marked
          core:  # marked
            hard: 0  # marked
            soft: 0  # marked

    redis:
        image: redis:alpine
        restart: always
        volumes:
            - /volume1/docker/redis-6379:/data #实际部署的 redis 地址，/volume1/docker/redis-6379按照实际情况修改
```

部署完成之后，访问：[**http://ip:1200**](http://ip:1200/)，就能访问了。

### **rsshub 的使用**

在需要嗅探的网站上，安装一个浏览器插件[**RSSHub-Radar**](https://github.com/DIYgod/RSSHub-Radar)，那么在可以进行生成 rss 地址的网站上，这个插件就会标注出地址或者跳转文档页。

点击齿轮，按照需求进行编辑选项。

在拿到了网站的路由之后，拼上自己的地址就得到完全属于自己的 rss 订阅源了，导入软件就可以食用了。

当然，这里面还有一些别的操作，比如 nginx 代理，外网访问等等，但是不在本篇内容的讨论范围。

### **自建 RSS 管理端——解决数据同步的问题**

为了解决数据同步的问题，可以有两个思路：

1. 软件同步
    - 苹果生态下用 Reeder，然后 iCloud 同步
    - 全平台rss 阅读器，用官方付费的同步方式
2. 自建 rss 服务端，自助同步进度

作为一个能折腾的人，我当然选择第二种，目前比较流行的自建 RSS 是 [**freshrss**](https://github.com/FreshRSS/FreshRSS)，有非常友好的界面，支持插件，还有比较小众的是 [**miniflux**](https://github.com/miniflux/v2)，不支持插件，但是支持图片代理（使用服务所在服务器直接缓存图片，而不是在客户端下载图片）、全文抓取，而且有非常简洁的 webui，并且支持自定义 css 样式。

所以最终我选择了 miniflux 的方案，而且现在彻底抛弃各种第三方的 rss 阅读器~~（实际上是因为没有搞定 miniflux 在图片代理后，第三方阅读器上无法展示图片的问题，但是我不说谁又知道呢桀桀桀～）~~。

同样使用docker-compose的方式部署：

```yaml
version: '3.4'
services:
  miniflux:
    image: ${MINIFLUX_IMAGE:-miniflux/miniflux:latest}
    container_name: miniflux
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgres://miniflux:miniflux_pass@db/miniflux?sslmode=disable
      - RUN_MIGRATIONS=1
      - FETCH_YOUTUBE_WATCH_TIME=1
      - CREATE_ADMIN=1
      - ADMIN_USERNAME=user  # 登录用户名
      - ADMIN_PASSWORD=password  # 登录密码
      - BASE_URL=https://miniflux.test.com/  # 阅读器的域名
      - POLLING_FREQUENCY=10  # 每个 feed 的刷新间隔
      - POLLING_PARSING_ERROR_LIMIT=0 #拉取出错后不会停止拉去，还是会按计划继续拉
      - BATCH_SIZE=100  # 每次拉取的 feed 数量
      - POLLING_SCHEDULER=entry_frequency # 拉取类型，根据上周的平均更新周期来拉取
      - SCHEDULER_ENTRY_FREQUENCY_MAX_INTERVAL=30 # 接上条，但也不会大于 30 分钟，建议和 POLLING_FREQUENCY 参数一起来看
      - MEDIA_PROXY_MODE=all # 图片代理功能，Miniflux 先把源端的图片缓存到服务器上来，后续就不用客户端去源服务器拉了
      - MEDIA_PROXY_PRIVATE_KEY=password # 使用客户端缓存过文章，然后某个时间重启了 docker 实例，那么会导致图片无法显示的情况，这是因为每次重启会随机生成 PROXY_PRIVATE_KEY,所以可以增加参数 PROXY_PRIVATE_KEY 固化 key ，便于解决更新、重启等场景下的图片显示问题。
      - DATABASE_MAX_CONNS=50 # 增加数据库连接数，对于多图片的 feed 非常有效，可以大幅提升加载和访问速度
      - DATABASE_MIN_CONNS=5  # 同上
      - WORKER_POOL_SIZE=10  # 默认，或适当加大
    restart: unless-stopped
    ports:
      - "1400:8080"
  db:
    image: postgres:15
    container_name: postgres
    environment:
      - POSTGRES_USER=miniflux
      - POSTGRES_PASSWORD=miniflux_pass
      - POSTGRES_DB=miniflux
    volumes:
      - /volume1/docker/miniflux/miniflux-db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "miniflux"]
      interval: 10s
      start_period: 30s
    restart: unless-stopped
```

部署完成之后，访问 1400 端口地址就能访问了，整体的使用方式非常简洁直观。

!https://minapi.tianxiyou.site:43200/tianzhepic/2024/07/05/202407051751420.png

我的webui 的样式参考了此项目：[**https://github.com/rootknight/Miniflux-Theme-Reeder**](https://github.com/rootknight/Miniflux-Theme-Reeder)

# **总结**

折腾了一个星期后，终于是把 rss 的方案定下了，下一个折腾啥呢？

<aside>
<img src="/icons/clock_gray.svg" alt="/icons/clock_gray.svg" width="40px" /> 2024 年 7 月 5 日 17:58:58

</aside>
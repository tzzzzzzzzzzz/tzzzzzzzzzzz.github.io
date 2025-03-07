---
title: RSS自建服务使用图片代理的方法
date: 2025-03-07 10:25:51
tags: 
    - "实用教程"
    - "RSS"
categories: 
    - "技术分享"
description: 被 freshrss 这事折磨了挺久
top_img: 'https://cdn.jsdelivr.net/gh/tzzzzzzzzzzz/blog-img@main/20250307101838569.png'
cover: 'https://cdn.jsdelivr.net/gh/tzzzzzzzzzzz/blog-img@main/20250307101838569.png'
---
最初尝试自建的时候尝试了两种 RSS 服务：[miniflux](https://github.com/miniflux/v2) 和 [freshrss](https://github.com/FreshRSS/FreshRSS)，这两个服务各有千秋，总结如下，**以下表格由谷歌 AI 自动总结**：

| 特性     | Miniflux                               | FreshRSS                                   |
| -------- | -------------------------------------- | ------------------------------------------ |
| 设计理念 | 极简主义，速度                         | 功能丰富，可定制性                         |
| 资源占用 | 低                                     | 相对较高                                   |
| 扩展性   | 有限，依赖插件                         | 强大，插件丰富                             |
| 用户界面 | 简洁，直观                             | 相对复杂，可定制性强                       |
| 数据存储 | PostgreSQL, SQLite                     | MySQL/MariaDB, PostgreSQL                  |
| 社交功能 | 简单                                   | 丰富                                       |
| 学习曲线 | 容易                                   | 相对复杂                                   |
| 代码质量 | 简洁，易于理解                         | 相对复杂                                   |
| 适用场景 | 资源有限的环境，需要快速简洁的阅读体验 | 需要更多功能和定制选项，资源相对充足的环境 |

在我之前写的rss 博客里，只是简写了这两个自建服务的部署方式和使用，在我看来，rss 服务最关键的地方在于「轻量」、「无痕」，而且作为单一用户来说，**miniflux** 是更好的选择。

日常使用的过程中因为使用了公网将部署到群晖中的miniflux 发布出来了，群晖本身被旁路由加持了代理，在局域网中访问即使是非代理环境一样可以加载外网的 rss。

我的最终目标：**外网环境，可以使用部署所在服务进行网络代理。**

### miniflux 的图片代理设置

miniflux 的图片代理设置非常简单，在 docker-compose 部署的过程中加上如下内容：

```yaml
    environment:
      - BASE_URL=https://miniflux.tianxiyou.site:43200/  #阅读器的域名
      - MEDIA_PROXY_MODE=all #图片代理功能，Miniflux 先把源端的图片缓存到服务器上来，后续就不用客户端去源服务器拉了
      - MEDIA_PROXY_PRIVATE_KEY=password # 使用客户端缓存过文章，然后某个时间重启了 docker 实例，那么会导致图片无法显示的情况，这是因为每次重启会随机生成 PROXY_PRIVATE_KEY,所以可以增加参数 PROXY_PRIVATE_KEY 固化 key ，便于解决更新、重启等场景下的图片显示问题。 
```

1. 需要注意的是，如果你和我一样使用的是公网+域名的方式，`BASE_URL`必须要加，否则无法正常生成代理图片链接，~~我在这里卡了两三天~~。
2. 根据官网对图片代理的介绍 ，`MEDIA_PROXY_MODE`有三种方式：`http-only`, `all`, or `none`，代表的含义分别是只代理http地址、所有图片都代理、不进行图片代理。经过尝试，如果使用http这种方式不会走旁路由代理，all是最后我选择的方式，图片的网络分流交由旁路由的分流进行。

### freshrss的图片代理设置

freshrss确实是功能非常强大，而且界面更正式，不像是miniflux像是个草台班子，但是强大的功能带来的缺点就是设置项非常复杂，这种感觉也出现在openclash，作为旁路由里面的代理扛把子，反人类的设置项真让人头皮发麻。

不过本着「不折腾明白不算完」的核心思想，还是跟freshrss死磕了很长时间~~（一年）~~，想要完成上面的最终目标。

其实文档里写的非常清楚了，只是我在读文档的时候不长眼睛，傻瓜式操作为：

1. 把官方提供的 [image-proxy](https://github.com/FreshRSS/Extensions/tree/master/xExtension-ImageProxy)包下载下来，然后放到 freshrss 部署目录下的 `./extensions` 中。

2. 在 freshrss 中的插件仓库启用一下 image proxy 插件。

3. 按照官方的文档在 nginx 中加入以下代码：

   ```nginx
   # Use 1 GiB cache with a 1 MiB memory zone (enough for ~8,000 keys).
   # Delete data that has not been accessed for 12 hours.
   proxy_cache_path /var/cache/nginx/freshrss levels=1:2 keys_zone=freshrss:1m
                    max_size=1g inactive=12h use_temp_path=off;
   
   server {
   …
       location /proxy {
       	# arg_key是可以自定义的，最好设置成复杂的内容
           if ($arg_key = "changeme") {
               proxy_pass $arg_url;
           }
           # Handle redirects coming from the target server.
       	# 此处的www.example.org填的反代后的 freshrss服务的域名。
           proxy_redirect ~^(.*)$ https://www.example.org/proxy?key=$arg_key&url=$1;
           proxy_ssl_server_name on;
           proxy_cache freshrss;
           # Cache positive answers for up to 2 days.
           proxy_cache_valid 200 301 302 307 308 2d;
       
   …
   }

4. 如果你使用的是和我一样的Nginx Proxy Manager你需要以下步骤

   1. 点击编辑

   2. 点击Advanced，中文不知道是什么，反正就是最后一项

   3. 加入以下内容，因为我不知道怎么在NPM中启用缓存，~~也不知道有什么用，~~所以官方的`proxy_cache_path`部分和代理内容中`proxy_cache`内容全部去掉了：

      ```nginx
      location /proxy {
        	  # arg_key是可以自定义的，最好设置成复杂的内容
              if ($arg_key = "changeme") {
                  proxy_pass $arg_url;
              }
              # Handle redirects coming from the target server.
              # 此处的www.example.org填的反代后的 freshrss服务的域名。
              proxy_redirect ~^(.*)$ www.example.org/proxy?key=$arg_key&url=$1;
              proxy_ssl_server_name on;
              #proxy_cache freshrss;
              # Cache positive answers for up to 2 days.
              #proxy_cache_valid 200 301 302 307 308 2d;
        	  # v 站的 v 友告诉我如果图片无法正常显示，加上这个会有效，还没验证此处的必要性，如果不能正常代理可以加上试试。
              resolver 8.8.8.8;
          }
      ```

5. 回到freshrss的imageproxy的设置页面，分别有以下几个选项：填写的这个内容要和上面在 nginx 中设置的完全一致。
   - `proxy_url` = **https://www.example.org/proxy?key=changeme&url=**
   - `scheme_include` = **1**
   - `Proxy HTTP/HTTPS`=**1** 
   - `url_encode` = **0** ~~（我就是因为没看这个导致无法使用的）~~

### 使用感受

因为我长期在Reeder中使用，基本不是用web端应用，所以对这两个的web应用的感触不多，但是我确实更喜欢miniflux这种极简风格，而起miniflux开箱即用，基本不需要什么设置，freshrss则需要设置一些常见的内容，比如：

- 自动刷新订阅源，miniflux自带，可以通过配置文件设置，freshrss目前得通过插件实现，我还没研究咋用。
- 全文抓取，像是少数派这种，miniflux直接在订阅源设置抓取全文即可，freshrss还是得通过插件实现。
- 同一个订阅源，比如yande.re 的图片，miniflux 自动隐藏了订阅源中包含的「原文件」，只显示核心的图片内容，但是 freshrss 不会，会显示两张图片，目前也没找到在哪设置。

**总的来说，对于这两个rss 服务，我更推荐大家搭建 miniflux**，~~miniflux 给我结一下推广费，谢谢~~。
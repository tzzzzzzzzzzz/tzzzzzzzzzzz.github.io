var posts=["2025/04/10/28 - > 29/","2024/07/12/7月济南游记/","2024/07/05/RSS服务自建之路/","2025/01/17/rclone的使用/","2024/08/07/一骑红尘妃子笑/","2025/04/01/你是自由的！/","2025/03/27/关于「意义」/","2024/05/23/写的故事/","2025/03/07/RSS自建服务使用图片代理的方法/","2025/03/18/关于「谎言」/","2025/03/10/我在打麻将的时候胆小如鼠/","2025/01/06/再见👋，2024/","2025/04/02/我以为自己心如铁石/","2025/03/06/如何在N个电脑上写hexo博客并发布到github-io/","2025/03/06/我的阴暗面/","2025/04/10/摔跤/","2024/04/24/明朝那些事读后感/","2025/02/20/机场折腾记录/","2025/03/11/结婚两周年——婚姻给我带来了什么？/","2025/03/13/群晖部署immortalwrt记录/","2025/04/07/金砖/","2024/08/27/雨案/","2024/07/12/十年了，applewatch还是最优解？/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };
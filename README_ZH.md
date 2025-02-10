<div align="center">
  <img src=".github/assets/logo.svg" height="150" />

# PageSpy Extensions

<a href="https://www.producthunt.com/posts/pagespy?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-pagespy" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=429852&theme=light" alt="PageSpy - Remote&#0032;debugging&#0032;as&#0032;seamless&#0032;as&#0032;local&#0032;debugging&#0046; | Product Hunt" height="36" /></a> <a href="https://news.ycombinator.com/item?id=38679798" target="_blank"><img src="https://hackernews-badge.vercel.app/api?id=38679798" alt="PageSpy - Remote&#0032;debugging&#0032;as&#0032;seamless&#0032;as&#0032;local&#0032;debugging&#0046; | Hacker News" height="36" /></a>

[English](./README.md) | 中文

</div>

## 介绍

PageSpy 浏览器扩展 monorepo 仓库。

## 使用

1. 进入 [package/*](./packages/) 目录，下载 `dist.tar.gz` 并解压；
2. 打开浏览器并访问 "chrome://extensions"；
3. 在页面右上角开启 "开发者模式"；
4. 点击页面左上角的 "加载"；
5. 选择解压后的 "dist" 目录；

以上就是全部，希望你使用愉快 ❤️。

## 升级

```bash
yarn update
```

## 开发

```bash
git clone git@github.com:HuolalaTech/page-spy-extension.git && cd page-spy-extension

# 安装依赖
yarn install

# 进入 packages/* 后执行
yarn build
```

## License

[MIT LICENSE](./LICENSE)

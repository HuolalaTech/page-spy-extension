<div align="center">
<img src=".github/assets/logo.svg" height="150" />

# PageSpy Extensions

<a href="https://www.producthunt.com/posts/pagespy?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-pagespy" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=429852&theme=light" alt="PageSpy - Remote&#0032;debugging&#0032;as&#0032;seamless&#0032;as&#0032;local&#0032;debugging&#0046; | Product Hunt" height="36" /></a> <a href="https://news.ycombinator.com/item?id=38679798" target="_blank"><img src="https://hackernews-badge.vercel.app/api?id=38679798" alt="PageSpy - Remote&#0032;debugging&#0032;as&#0032;seamless&#0032;as&#0032;local&#0032;debugging&#0046; | Hacker News" height="36" /></a>

English | [中文](./README_ZH.md)

</div>

## Intro

PageSpy browser extension monorepo.

## Usage

1. Download the `dist.tar.gz` in [packages/*](./packages/) and unpacked.
2. Open your browser and visit the "chrome://extensions".
3. Enable "Developer mode" in the top right corner.
4. Click the "Load unpacked" in the top left corner.
5. Select the unpacked "dist" directory.

That's all, enjoy it ❤️.

## Update

```bash
yarn update
```

## Development

```bash
git clone git@github.com:HuolalaTech/page-spy-extension.git && cd page-spy-extension

# Install
yarn install

# enter packages/* and run
yarn build
```

## License

[MIT LICENSE](./LICENSE)

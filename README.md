# ghproxy

- https://codeberg.org/ghproxy/pages （开源）

**网址：**

1. https://gh.869.pw
2. https://ghproxy.ixxx.workers.dev

本项目参考 [hunshcn/gh-proxy](https://github.com/hunshcn/gh-proxy)，并作了一定的修改：

- 使用 `typescript` 重写；
- 仅支持 [`CloudFlare` 项目](https://developers.cloudflare.com/workers/)；
- 支持非 GitHub 项目文件加速；

  ```bash
   # 图片会直接显示
   https://gh.869.pw/https://kernel.org/theme/images/logos/tux.png

   # 文件会直接下载
   https://gh.869.pw/https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.1.18.tar.xz
  ```

## Template: worker-typescript

- https://github.com/cloudflare/workers-sdk/tree/main/templates

```bash
# full repository clone
$ git clone --depth 1 https://github.com/cloudflare/workers-sdk

# copy the "worker-typescript" example to "my-project" directory
$ cp -rf workers-sdk/templates/worker-typescript my-project

# setup & begin development
$ cd my-project && npm install && npm run dev
```

```bash
HTTP_PROXY=http://localhost:20171 wrangler publish
```

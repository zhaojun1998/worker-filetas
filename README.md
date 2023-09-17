# 文件加速

基于 Cloudflare Workers 的文件传输加速服务 (File transfer acceleration service)

- https://jihulab.com/devdo/worker-filetas
- https://github.com/devdoz/worker-filetas

**预览网址：**

1. https://wfile.kkgo.cc
2. https://filetas.w.skiy.net
3. https://filetas.ixxx.workers.dev

- 仅支持 [`CloudFlare Workers` 项目](https://developers.cloudflare.com/workers/)；

  ```bash
   # 图片会直接显示
   https://cfile.kkgo.cc/https://kernel.org/theme/images/logos/tux.png

   # 文件会直接下载
   https://cfile.kkgo.cc/https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.1.18.tar.xz
  ```

## 布署教程

1. 注册 [CloudFlare 账号](https://www.cloudflare.com/)，并且设置 **Workers** 域名 (比如：`***.workers.dev`)
2. 安装 [Wrangler 命令行工具](https://developers.cloudflare.com/workers/wrangler/)。
   ```bash
    npm install -g wrangler
   ```
3. 登录 `Wrangler`（可能需要扶梯）：

   ```bash
   # 登录，可能登录不成功
   wrangler login

   # 若登录不成功，可能需要使用代理。
   # 每个命令行前，均需要加 HTTP_PROXY=http://localhost:20171 （需自行修改）
   HTTP_PROXY=http://localhost:20171 wrangler login
   ```

4. 拉取本项目：

   ```bash
   git clone https://jihulab.com/devdo/worker-filetas.git
   ```

5. 修改 `wrangler.toml` 文件中的 `name`（filetas）为服务名 `xxx`（访问域名为：`xxx.***.workers.dev`）

6. 本地测试

   ```bash
   npm install
   npm run dev
   ```

7. 发布

   ```bash
    HTTP_PROXY=http://localhost:20171 wrangler deploy
   ```

   发布成功将会显示对应的网址

   ```bash
   Proxy environment variables detected. We'll use your proxy for fetch requests.
   ⛅️ wrangler 2.12.2
   --------------------
   Total Upload: 4.48 KiB / gzip: 1.40 KiB
   Uploaded xxx (2.20 sec)
   Published xxx (1.83 sec)
   	https://xxx.***.workers.dev
   Current Deployment ID: xxxx.xxxx.xxxx.xxxx
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
HTTP_PROXY=http://localhost:20171 wrangler deploy
```

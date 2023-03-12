# ghproxy

- https://gitcode.net/flydo/ghproxy
- https://codeberg.org/ghproxy/pages

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

## 参考

- https://github.com/hunshcn/gh-proxy

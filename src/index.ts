import { htmlTemplate } from './template'

export interface Env {
	TITLE: string
	BASEURL: string
}

export default {
	async fetch(request: Request, env: Env) {
		// 前缀，如果自定义路由为 example.com/gh/*，将 PREFIX 改为 '/gh/'，注意，少一个杠都会错！
		const PREFIX = '/';

		const whiteList: string[] = []; // 白名单，路径里面有包含字符的才会通过，e.g. ['/username/']
		const blockList: string[] = []; // 黑名单，路径里面有包含字符的都会被拦截，e.g. ['/username/']

		/** @type { RequestInit } */
		const PREFLIGHT_INIT: RequestInit = {
			headers: new Headers({
				'access-control-allow-origin': '*',
				'access-control-allow-methods': 'GET,POST,PUT,PATCH,TRACE,DELETE,HEAD,OPTIONS',
				'access-control-max-age': '1728000',
			}),
		};

		// 判断网址是 GitHub
		const exp1 = /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/(?:releases|archive)\/.*$/i;
		const exp2 = /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/(?:blob|raw)\/.*$/i;
		const exp3 = /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/(?:info|git-).*$/i;
		const exp4 = /^(?:https?:\/\/)?raw\.(?:githubusercontent|github)\.com\/.+?\/.+?\/.+?\/.+$/i;
		const exp5 = /^(?:https?:\/\/)?gist\.(?:githubusercontent|github)\.com\/.+?\/.+?\/.+$/i;
		const exp6 = /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/tags.*$/i;
		const checkIsGithub = (u: string) => {
			for (let i of [exp1, exp2, exp3, exp4, exp5, exp6]) {
				if (u.search(i) === 0) {
					return true;
				}
			}
			return false;
		};

		async function proxy(urlObj: URL, reqInit: ResponseInit): Promise<Response> {
			console.log(urlObj.href, reqInit);
			const res = await fetch(urlObj.href, reqInit);
			const resHdrOld = res.headers;
			const resHdrNew = new Headers(resHdrOld);
			const status = res.status;

			if (resHdrNew.has('location')) {
				const _location_data = resHdrNew.get('location');
				const _location = _location_data ?? '';
				if (checkIsGithub(_location)) {
					resHdrNew.set('location', PREFIX + _location);
				} else {
					return proxy(new URL(_location), reqInit);
				}
			}

			resHdrNew.set('access-control-expose-headers', '*');
			resHdrNew.set('access-control-allow-origin', '*');

			resHdrNew.delete('content-security-policy');
			resHdrNew.delete('content-security-policy-report-only');
			resHdrNew.delete('clear-site-data');

			return new Response(res.body, {
				status,
				headers: resHdrNew,
			});
		}

		const httpHandler = (req: Request, path: string) => {
			// preflight
			if (req.method === 'OPTIONS' && req.headers.has('access-control-request-headers')) {
				return new Response(null, PREFLIGHT_INIT);
			}

			if (!checkAllowAccess(path)) {
				return new Response('blocked', { status: 403 });
			}

			// 请求信息
			const reqInit: RequestInit = {
				headers: req.headers,
				method: req.method,
				body: req.body,
				redirect: 'manual',
			};
			return proxy(new URL(path), reqInit);
		};

		const fetchHandler = async (req: Request) => {
			// 转为 URL 对象
			const urlObj = new URL(req.url);

			// 获取请求参数 q 的值进行跳转, 如访问 http://xxx.com?q=github.com ，将跳转到 http://xxx.com/github.com，等于反向代理了 https://github.com
			let path = urlObj.searchParams.get('q');
			if (path) {
				return Response.redirect(urlObj.protocol + '//' + urlObj.host + PREFIX + path, 301);
			}

			// 根据参数 u 的值，直接拉取网页内容并返回，和上面的跳转不同，这里是直接返回网页内容，不过还是反向代理，不过 url 不会改变
			const filepath = urlObj.searchParams.get('u');
			if (filepath) {
				return fetch(filepath);
			}

			// 如果是根目录，返回网页正文，并根据 env.TITLE 设置网页标题
			if (urlObj.pathname === '' || urlObj.pathname === '/') {
				const title = env.TITLE
				const html = htmlTemplate.replace(/{{ title }}/g, title)
				return rawHtmlResponse(html)
			}

			// 网站图标, 无图标，返回 204
			if (urlObj.pathname === '/favicon.ico') {
				return new Response(null, { status: 204 })
			}

			// 将当前请求的 url 中取要代理的部分，如访问 http://xxx.com/github.com ，将取到 github.com
			path = urlObj.href.substr(urlObj.origin.length + PREFIX.length);
			// 去除开头多余的斜杠
			path = removeLeadingSlashes(path);
			// 如果没添加 http 或者 https 协议头，自动添加 https 协议头
			if (path != "" && path != "/" && !path.startsWith('https://') && !path.startsWith('http://')) {
				path = 'https://' + path;
			}

			if (path.search(exp2) === 0) {
				path = path.replace('/blob/', '/raw/');
			}
			return httpHandler(req, path);
		};

		/**
		 * 返回 html 响应
		 * @param 	html	html 文本
		 */
		function rawHtmlResponse(html: string) {
			return new Response(html, {
				headers: {
					'content-type': 'text/html;charset=UTF-8',
				},
			})
		}

		/**
		 * 去除开头的斜杠, 如 http://baidu.com, //http://baidu.com 都返回 http://baidu.com
		 * @param str
		 */
		function removeLeadingSlashes(str: string) {
			return str.replace(/^\/+/, '');
		}

		/**
		 * 检查是否允许访问:
		 * - 如果开启了白名单，只有在白名单里面的路径才允许访问
		 * - 如果开启了黑名单，只有不在黑名单里面的路径才允许访问
		 * - 如果两个都开启了，只有在白名单里面且不在黑名单里面的路径才允许访问
		 * - 如果两个都没开启，所有路径都允许访问
		 *
		 * 注意：白名单和黑名单是部分匹配，如白名单为 ['/username/']，则 /username/abc 和 /username/def 都允许访问
		 * 返回 true 表示允许访问，false 表示不允许访问，
		 */
		const checkAllowAccess = (url: string): boolean => {
			if (whiteList.length > 0 && !whiteList.some((i) => url.includes(i))) {
				return false;
			}
			if (blockList.length > 0 && blockList.some((i) => url.includes(i))) {
				return false;
			}
			return true;
		}
		return fetchHandler(request);
	},
};

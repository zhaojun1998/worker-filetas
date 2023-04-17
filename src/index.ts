import { htmlTemplate } from './template'

export interface Env {
	TITLE: string
	BASEURL: string
}

export default {
	async fetch(request: Request, env: Env) {
		function rawHtmlResponse(html) {
			return new Response(html, {
				headers: {
					'content-type': 'text/html;charset=UTF-8',
				},
			})
		}

		async function gatherResponse(response) {
			const { headers } = response
			const contentType = headers.get('content-type') || ''
			if (contentType.includes('application/json')) {
				return JSON.stringify(await response.json())
			} else if (contentType.includes('application/text')) {
				return response.text()
			} else if (contentType.includes('text/html')) {
				return response.text()
			} else {
				return response.text()
			}
		}

		// https://developers.cloudflare.com/workers/examples/cors-header-proxy/
		async function handleRequest(reqUrl: string) {
			const url = new URL(reqUrl)
			let response: Response

			try {
				url.protocol = 'https:'
				const newRequest = new Request(url.href, request)
				newRequest.headers.set('Origin', new URL(url.href).origin)
				response = await fetch(reqUrl)
			} catch (e) {
				if (e instanceof TypeError) {
					url.protocol = 'http:'
					const newRequest = new Request(url.href, request)
					newRequest.headers.set('Origin', new URL(url.href).origin)
					response = await fetch(newRequest)
				} else {
					throw e
				}
			}

			response = new Response(response.body, response)
			response.headers.set('Access-Control-Allow-Origin', url.origin)
			response.headers.append('Vary', 'Origin')

			return response
		}

		if (request.method !== 'GET') {
			return new Response('Method Not Allowed', { status: 405 })
		}

		const url = new URL(request.url)
		if (env.BASEURL !== '' && env.BASEURL !== url.origin) {
			return Response.redirect(env.BASEURL, 302)
		}

		if (url.pathname === '' || url.pathname === '/') {
			const title = env.TITLE
			const html = htmlTemplate.replace(/{{ title }}/g, title)
			return rawHtmlResponse(html)
		}

		if (url.pathname === '/favicon.ico') {
			return new Response(null, { status: 204 })
		}

		let redirectUrl = url.pathname.slice(1)

		const httpReg = /^http?:\/\//
		const httpsReg = /^https?:\/\//

		// https://xx.com/https://xx.com/x.zip
		if (redirectUrl.match(httpReg) || redirectUrl.match(httpsReg)) {
			return handleRequest(redirectUrl)
		}

		redirectUrl = redirectUrl.replace(/^\/+/g, 'https://')
		// https://xx.com////https://xx.com/x.zip
		if (redirectUrl.match(httpReg) || redirectUrl.match(httpsReg)) {
			return handleRequest(redirectUrl)
		}

		redirectUrl = url.href
		// https://xx.com/////xx.com/x.zip
		if (redirectUrl.match(httpReg) || redirectUrl.match(httpsReg)) {
			return handleRequest(redirectUrl)
		}

		return new Response(`request url: ${request.url}`)
	},
}

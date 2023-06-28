import type { APIRoute } from 'astro'
import { Api } from '@util/config'
import { httpHeaders } from '@util/common'

export const get: APIRoute = async ({ url }) => {
    try {
        const payload = await fetch(`${Api.site}/api/video/list?${url.searchParams}`).then(
            response => response.text()
        )
        return new Response(payload, {
            status: 200,
            headers: httpHeaders.json
        })
    }
    catch (err) {
        return new Response(JSON.stringify({
            code: -1,
            data: null,
            msg: String(err)
        }), {
            status: 503,
            headers: httpHeaders.json
        })
    }
}

import type { APIRoute } from 'astro'
import { Api } from '@util/config'
import { httpHeaders } from '@util/common'

export const GET: APIRoute = async ({ url }) => {
    const headers = {
        ...httpHeaders.json,
        ...httpHeaders.cors
    }
    try {
        const response = await fetch(`${Api.site}/api/video/list?${url.searchParams}`)
        return new Response(response.body, {
            status: 200,
            headers
        })
    }
    catch (err) {
        return new Response(JSON.stringify({
            code: -1,
            data: null,
            msg: String(err)
        }), {
            status: 503,
            headers
        })
    }
}

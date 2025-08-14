import type { APIRoute } from 'astro'
import { httpHeaders } from '@util/common'
import { withHost } from './'

export const GET: APIRoute = async () => {
    const host = await withHost()
    return new Response(JSON.stringify({
        code: 0,
        data: host,
        msg: '成功'
    }), {
        headers: {
            ...httpHeaders.json,
            ...httpHeaders.cors
        }
    })
}
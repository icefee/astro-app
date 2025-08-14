import type { APIRoute } from 'astro'
import { httpHeaders } from '@util/common'

export const GET: APIRoute = async ({ url }) => {
    const params = url.searchParams
    const host = params.get('host')
    return new Response(JSON.stringify({
        code: 0,
        data: `https://${host}/api/${params.get('c') ? 'f1l2/l1_aaaa' : 'b1q2/l1_cccc'}`,
        msg: '成功'
    }), {
        headers: {
            ...httpHeaders.json,
            ...httpHeaders.cors
        }
    })
}
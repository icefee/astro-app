import type { APIRoute } from 'astro'
import { httpHeaders } from '@util/common'
import { host } from '.'

export const GET: APIRoute = async ({ url }) => {
    return new Response(JSON.stringify({
        code: 0,
        data: `https://${host}/api/${url.searchParams.get('c') ? 'f1l2/l1_aaaa' : 'b1q2/l1_cccc'}`,
        msg: '成功'
    }), {
        headers: {
            ...httpHeaders.json,
            ...httpHeaders.cors
        }
    })
}
import type { APIRoute } from 'astro'
import { httpHeaders } from '@util/common'
import { host } from '.'

export const GET: APIRoute = async () => {
    return new Response(JSON.stringify({
        code: 0,
        data: `https://${host}/api/s1s2/l1_bbbb`,
        msg: '成功'
    }), {
        headers: {
            ...httpHeaders.json,
            ...httpHeaders.cors
        }
    })
}
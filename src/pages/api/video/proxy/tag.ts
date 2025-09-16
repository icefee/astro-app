import type { APIRoute } from 'astro'
import { host, proxyResponse } from '.'
import { httpHeaders } from '@util/common'

export const GET: APIRoute = async ({ url, request }) => {
    const body = await request.json()
    const target = `https://${host}/api/${url.searchParams.get('c') ? 'f1l2/l1_aaaa' : 'b1q2/l1_cccc'}`
    return proxyResponse(target, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            ...httpHeaders.json,
            ...httpHeaders.cors
        }
    })
}
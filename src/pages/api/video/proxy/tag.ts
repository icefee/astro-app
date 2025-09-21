import type { APIRoute } from 'astro'
import { host, proxyResponse } from '.'

export { OPTIONS } from '.'

export const POST: APIRoute = async ({ url, request }) => {
    const category = url.searchParams.get('c')
    const api = category ? 'f1l2/l1_aaaa' : 'b1q2/l1_cccc'
    const body = await request.json()
    return proxyResponse(`https://${host}/api/${api}`, {
        method: 'post',
        body: JSON.stringify(body),
        headers: request.headers
    })
}
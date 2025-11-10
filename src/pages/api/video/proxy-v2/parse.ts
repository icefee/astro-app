import type { APIRoute } from 'astro'
import { host, proxyResponse } from '.'

export { OPTIONS } from '.'

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json()
    return proxyResponse(`https://${host}/api/p1/x1_q2_aaaa`, {
        method: 'post',
        headers: request.headers,
        body: JSON.stringify(body)
    })
}
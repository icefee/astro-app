import type { APIRoute } from 'astro'
import { httpHeaders } from '@util/common'
import { host, proxyResponse } from '.'

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json()
    return proxyResponse(`https://${host}/api/s1s2/l1_bbbb`, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            ...httpHeaders.json,
            ...httpHeaders.cors
        }
    })
}
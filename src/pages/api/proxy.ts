import type { APIRoute } from 'astro'
import { httpHeaders, unsafe_fetch } from '@util/common'
import { userAgent } from '@util/env'

const inheritedHeaders: Array<{
    key: string;
    defaultValue: string | null;
}> = [
        {
            key: 'content-type',
            defaultValue: 'text/plain'
        },
        {
            key: 'content-range',
            defaultValue: null
        },
        {
            key: 'transfer-encoding',
            defaultValue: 'chunked'
        },
        {
            key: 'content-disposition',
            defaultValue: null
        }
    ]

export const GET: APIRoute = async ({ url, request }) => {
    const params = url.searchParams
    const targetUrl = params.get('url'), cors = params.get('cors') === '1'
    if (targetUrl) {
        let headers = new Headers(request.headers)
        headers.set('user-agent', userAgent)
        const { body, status, headers: originHeaders } = await unsafe_fetch(targetUrl, {
            headers
        })
        headers = new Headers(cors ? httpHeaders.cors : undefined)
        for (const { key, defaultValue } of inheritedHeaders) {
            const value = originHeaders.get(key) ?? defaultValue;
            if (value) {
                headers.append(key, value)
            }
        }
        return new Response(body, {
            status,
            headers
        })
    }
    return new Response('invalid url', {
        status: 200,
        headers: httpHeaders.html
    })
}
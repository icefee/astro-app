import type { APIRoute } from 'astro'
import { httpHeaders } from '@util/common'

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
    const targetUrl = url.searchParams.get('url')
    if (targetUrl) {
        const { body, status, headers: originHeaders } = await fetch(targetUrl, {
            headers: request.headers
        })
        const headers = new Headers()
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
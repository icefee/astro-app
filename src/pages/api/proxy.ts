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
            key: 'accept-ranges',
            defaultValue: 'bytes'
        },
        {
            key: 'content-disposition',
            defaultValue: null
        },
        {
            key: 'set-cookie',
            defaultValue: null
        }
    ]

export const GET: APIRoute = async ({ url, request }) => {
    const params = url.searchParams
    const target = params.get('url'), cors = params.get('cors') === '1'
    if (target) {
        const requestHeaders = new Headers(request.headers)
        requestHeaders.delete('host')
        requestHeaders.set('user-agent', userAgent)
        const { body, status, headers: originHeaders } = await unsafe_fetch(target, {
            headers: requestHeaders
        })
        const headers = new Headers(cors ? httpHeaders.cors : undefined)
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
        headers: httpHeaders.html
    })
}

export const POST: APIRoute = async ({ url, request }) => {
    const params = url.searchParams
    const target = params.get('url')
    if (target) {
        const headers = new Headers(request.headers)
        headers.delete('host')
        headers.set('user-agent', userAgent)
        const response = await unsafe_fetch(target, {
            method: 'POST',
            headers,
            body: await request.text()
        })
        const responseHeaders = new Headers(response.headers)
        responseHeaders.delete('content-encoding')
        try {
            const data = await response.json()
            return new Response(JSON.stringify(data), {
                status: response.status,
                headers: {
                    ...responseHeaders,
                    ...httpHeaders.json
                }
            })
        }
        catch (err) {
            return new Response(await response.blob(), {
                status: response.status,
                headers: responseHeaders
            })
        }
    }
    return new Response('invalid url', {
        headers: httpHeaders.html
    })
}
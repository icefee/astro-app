import type { APIRoute } from 'astro'
import { getResponse } from '@adaptors/common'
import { httpHeaders } from '@util/common'

export const host = '88xx.info'

export const proxyResponse = async (...args: Parameters<typeof getResponse>) => {
    const response = await getResponse(...args)
    return new Response(await response.blob(), {
        status: 200,
        headers: {
            ...httpHeaders.cors,
            ...httpHeaders.json
        }
    })
}

export const OPTIONS: APIRoute = () => new Response('ok', {
    status: 200,
    statusText: 'ok',
    headers: httpHeaders.cors
})

export const GET: APIRoute = async ({ url }) => {
    let path = 's1y2/f1_l2_l3_bbbb'
    if (url.searchParams.get('s')) {
        path = 's1s2/l1_bbbb'
    }
    return proxyResponse(`https://${host}/api/${path}`)
}
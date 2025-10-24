import type { APIRoute } from 'astro'
import { proxyRequest } from '@adaptors/common'
import { getApiUrl, getPageParams } from '.'

export const GET: APIRoute = async ({ url }) => {
    const params = url.searchParams
    const host = params.get('host')!
    const t = params.get('t')
    return proxyRequest(
        getApiUrl(host, 'category_posts'),
        {
            method: 'post',
            body: JSON.stringify({
                typename: t,
                ...getPageParams(params)
            })
        }
    )
}
import type { APIRoute } from 'astro'
import { proxyRequest } from '@adaptors/common'
import { getApiUrl, getPageParams } from '.'

export const GET: APIRoute = ({ url }) => {
    const params = url.searchParams
    const host = params.get('host')!
    const c = params.get('c')
    return proxyRequest(
        getApiUrl(host, 'category_posts'),
        {
            method: 'post',
            body: JSON.stringify({
                typename: c,
                ...getPageParams(params)
            })
        }
    )
}
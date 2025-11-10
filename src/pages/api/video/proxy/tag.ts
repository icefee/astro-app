import type { APIRoute } from 'astro'
import { proxyRequest } from '@adaptors/common'
import { getApiUrl, getPageParams, invalidQueryRequest } from '.'

export const GET: APIRoute = ({ url }) => {
    const params = url.searchParams
    const host = params.get('host')!
    const t = params.get('t')
    return t ? proxyRequest(
        getApiUrl(host, 'tags_posts'),
        {
            method: 'post',
            body: JSON.stringify({
                type: t,
                ...getPageParams(params)
            })
        }
    ) : invalidQueryRequest('t')
}
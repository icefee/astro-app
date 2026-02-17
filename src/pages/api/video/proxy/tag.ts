import type { APIRoute } from 'astro'
import { proxyRequest } from '@adaptors/common'
import { getApiUrl, getPageParams, invalidQueryRequest } from '.'

export const GET: APIRoute = ({ url }) => {
    const params = url.searchParams
    const host = params.get('host')!
    const t = params.get('t')
    const { page } = getPageParams(params)
    return t ? proxyRequest(
        getApiUrl(host, `/json/tag/tag_${t}_page_${page}.json`)
    ) : invalidQueryRequest('t')
}
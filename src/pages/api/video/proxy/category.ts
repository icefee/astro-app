import type { APIRoute } from 'astro'
import { proxyRequest } from '@adaptors/common'
import { getApiUrl, getPageParams, invalidQueryRequest } from '.'

export const GET: APIRoute = ({ url }) => {
    const params = url.searchParams
    const host = params.get('host')!
    const c = params.get('c')
    const { page } = getPageParams(params)
    return c ? proxyRequest(
        getApiUrl(host, `/json/category/ctg_${c}_page_${page}.json`)
    ) : invalidQueryRequest('c')
}
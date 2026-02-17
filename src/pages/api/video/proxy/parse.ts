import type { APIRoute } from 'astro'
import { proxyRequest } from '@adaptors/common'
import { getApiUrl, invalidQueryRequest } from '.'

export const GET: APIRoute = ({ url }) => {
    const params = url.searchParams
    const host = params.get('host')!
    const id = params.get('id')
    return id ? proxyRequest(
        getApiUrl(host, `/json/detail/detail_${id}.json`)
    ) : invalidQueryRequest('id')
}
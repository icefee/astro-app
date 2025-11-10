import type { APIRoute } from 'astro'
import { proxyRequest } from '@adaptors/common'
import { getApiUrl } from '.'

export const GET: APIRoute = ({ url }) => {
    const host = url.searchParams.get('host')!
    return proxyRequest(getApiUrl(host, 'index_rmd'))
}
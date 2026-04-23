import type { APIRoute } from 'astro'
import { getPagedList, invalidQueryRequest } from '.'

export const GET: APIRoute = ({ url }) => {
    const params = url.searchParams
    const t = params.get('t')
    if (t !== null) {
        return getPagedList(`/tags/${t}/`, params)
    }
    return invalidQueryRequest('c')
}
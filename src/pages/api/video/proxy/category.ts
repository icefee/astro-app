import type { APIRoute } from 'astro'
import { getPagedList, invalidQueryRequest } from '.'

export const GET: APIRoute = ({ url }) => {
    const params = url.searchParams
    const c = params.get('c')
    if (c !== null) {
        return getPagedList(`/category/${c}/`, params)
    }
    return invalidQueryRequest('c')
}
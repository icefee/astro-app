import type { APIRoute } from 'astro'
import { proxyRequest } from '@adaptors/common'
import { getApiUrl, getPageParams } from '.'

export const GET: APIRoute = ({ url }) => {
    const params = url.searchParams
    const c = params.get('c')
    return c ? proxyRequest(
        getApiUrl('category_posts'),
        {
            method: 'post',
            body: JSON.stringify({
                typename: c,
                ...getPageParams(params)
            })
        }
    ) : new Response('invalid query param: c')
}
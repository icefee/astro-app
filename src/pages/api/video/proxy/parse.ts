import type { APIRoute } from 'astro'
import { proxyRequest } from '@adaptors/common'
import { getApiUrl } from '.'

export const GET: APIRoute = ({ url }) => {
    const id = url.searchParams.get('id')
    return id ? proxyRequest(
        getApiUrl('source_data'),
        {
            method: 'post',
            body: JSON.stringify({
                id: +id
            })
        }
    ) : new Response('invalid query param: id')
}
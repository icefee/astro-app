import type { APIRoute } from 'astro'
import { httpHeaders } from '@util/common'

export const GET: APIRoute = async ({ url }) => {
    const host = url.searchParams.get('host')
    const params = new URLSearchParams(url.searchParams)
    params.delete('host')
    return new Response(null, {
        status: 302,
        headers: {
            ...httpHeaders.cors,
            location: `https://${host}/api/t1j2/l1_dddd?${params}`
        }
    })
}
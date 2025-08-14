import type { APIRoute } from 'astro'
import { httpHeaders } from '@util/common'

export const GET: APIRoute = async ({ url }) => {
    const host = url.searchParams.get('host')
    return new Response(null, {
        status: 302,
        headers: {
            ...httpHeaders.cors,
            location: `https://${host}/api/s1y2/b1_f2_cccc`
        }
    })
}
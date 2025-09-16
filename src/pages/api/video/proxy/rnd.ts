import type { APIRoute } from 'astro'
import { httpHeaders } from '@util/common'
import { host } from '.'

export const GET: APIRoute = async ({ url }) => {
    return new Response(null, {
        status: 302,
        headers: {
            ...httpHeaders.cors,
            location: `https://${host}/api/t1j2/l1_dddd?${url.searchParams}`
        }
    })
}
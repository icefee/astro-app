import type { APIRoute } from 'astro'
import { httpHeaders } from '@util/common'
import { host } from '.'

export const GET: APIRoute = async () => {
    return new Response(null, {
        status: 302,
        headers: {
            ...httpHeaders.cors,
            location: `https://${host}/api/s1y2/b1_f2_cccc`
        }
    })
}
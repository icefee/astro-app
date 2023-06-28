import type { APIRoute } from 'astro'
import { httpHeaders } from '@util/common'

export const get: APIRoute = ({ params, request }) => {
    return new Response(JSON.stringify({
        message: "It's works!"
    }), {
        status: 200,
        headers: httpHeaders.json
    })
}

import type { APIRoute } from 'astro'
import { httpHeaders } from '@util/http'

export const GET: APIRoute = () => {
    return new Response(JSON.stringify({
        message: "It's works!"
    }), {
        headers: httpHeaders.json
    })
}
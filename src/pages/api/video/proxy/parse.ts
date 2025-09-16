import type { APIRoute } from 'astro'
import { host, proxyResponse } from '.'

export const GET: APIRoute = () => {
    return proxyResponse(`https://${host}/api/p1/x1_q2_aaaa`)
}
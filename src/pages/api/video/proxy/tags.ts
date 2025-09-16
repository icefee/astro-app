import type { APIRoute } from 'astro'
import { host, proxyResponse } from '.'

export const GET: APIRoute = () => {
    return proxyResponse(`https://${host}/api/s1y2/b1_f2_cccc`)
}
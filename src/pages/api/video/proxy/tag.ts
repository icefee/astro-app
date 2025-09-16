import type { APIRoute } from 'astro'
import { host, proxyResponse } from '.'

export const GET: APIRoute = ({ url }) => {
    return proxyResponse(`https://${host}/api/${url.searchParams.get('c') ? 'f1l2/l1_aaaa' : 'b1q2/l1_cccc'}`)
}
import type { APIRoute } from 'astro'
import { host, proxyResponse } from '.'

export const GET: APIRoute = ({ url }) => {
    return proxyResponse(`https://${host}/api/t1j2/l1_dddd?${url.searchParams}`)
}
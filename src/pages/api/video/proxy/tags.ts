import type { APIRoute } from 'astro'
import { proxyRequest } from '@adaptors/.'

export const GET: APIRoute = async ({ url }) => {
    const host = url.searchParams.get('host')!
    return proxyRequest(`https://${host}/api/category`)
}
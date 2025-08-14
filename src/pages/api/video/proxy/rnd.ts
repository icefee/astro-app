import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
    const host = url.searchParams.get('host')
    const params = new URLSearchParams(url.searchParams)
    params.delete('host')
    return Response.redirect(`https://${host}/api/t1j2/l1_dddd?${params}`)
}
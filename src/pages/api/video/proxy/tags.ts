import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
    const host = url.searchParams.get('host')
    return Response.redirect(`https://${host}/api/s1y2/b1_f2_cccc`)
}
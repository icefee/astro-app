import type { APIRoute } from 'astro'
import { withHost, createDataPayload } from './'

export const GET: APIRoute = async () => {
    const host = await withHost()
    return createDataPayload(host)
}
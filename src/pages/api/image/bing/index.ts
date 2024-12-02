import type { APIRoute } from 'astro'
import { getTextWithTimeout } from '@adaptors/.'

export const GET: APIRoute = async () => {
    const source = await getTextWithTimeout('https://cn.bing.com/chrome/newtab')
    const imageUrl = source?.match(
        new RegExp('https://s.cn.bing.net/th\\?id=[\\w-.]+?.webp')
    )?.[0]
    return imageUrl ? Response.redirect(imageUrl) : new Response(null, { status: 404, statusText: 'Not found' })
}
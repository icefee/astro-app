import type { APIRoute } from 'astro'
import { getJson } from '@adaptors/.'

export const GET: APIRoute = async () => {
    const url = new URL('https://cn.bing.com/hp/api/v1/imagegallery?format=json')
    const { data: { images } } = await getJson<{
        data: {
            images: Array<{
                imageUrls: Record<'landscape' | 'portrait', {
                    highDef: string;
                    ultraHighDef: string;
                    wallpaper: string;
                }>
            }>;
        }
    }>(url)
    const imageUrl = url.origin + images[Math.floor(Math.random() * images.length)].imageUrls.landscape.highDef
    return Response.redirect(imageUrl)
}
import type { APIRoute } from 'astro'
import { getJson } from '@util/http'

export const GET: APIRoute = async () => {
    const url = new URL('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN')
    const { images } = await getJson<{
        images: Array<{
            title: string;
            url: string;
        }>;
    }>(url)
    return Response.redirect(url.origin + images[0].url)
}
import type { APIRoute } from 'astro'
import { getJson } from '@adaptors/.'

export const GET: APIRoute = async ({ url }) => {
    const params = url.searchParams
    let api = 'https://peapix.com/bing/feed'
    if (url.searchParams.size > 0) {
        api += `?${params}`
    }
    const data = await getJson<Array<{
        title: string;
        copyright: string;
        fullUrl: string;
        thumbUrl: string;
        imageUrl: string;
        pageUrl: string;
        date: string;
    }>>(api)
    const imageUrl = data[Math.floor(Math.random() * data.length)].imageUrl
    return Response.redirect(imageUrl)
}
import type { APIRoute } from 'astro'
import { getJson } from '@adaptors/.'
import { httpHeaders } from '@util/common'

export const GET: APIRoute = async () => {
    const url = new URL('https://cn.bing.com/hp/api/v1/imagegallery?format=json')
    const headers = {
        ...httpHeaders.json,
        ...httpHeaders.cors
    }
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
    return Response.json({
        code: 0,
        data: images,
        msg: '成功'
    }, {
        headers
    })
}
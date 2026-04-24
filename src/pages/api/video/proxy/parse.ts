import type { APIRoute } from 'astro'
import { createDataPayload, getDocument, getDataList, randomPick, invalidQueryRequest } from '.'

export const GET: APIRoute = async ({ url }) => {
    const params = url.searchParams
    const id = params.get('id')
    if (id !== null) {
        const { $ } = await getDocument(params, `/vd/${id}/`)
        const [title, tag] = $('.mb-3 .text-lg').text().split(/-(?=[^-]+$)/)
        const meta = $('#player-wrap')
        const routes: string[] = []
        for (let i = 1; i < 10; i++) {
            const route = meta.attr(`data-route${i}`)
            if (route) {
                routes.push(route)
            }
            else {
                break
            }
        }
        const litpic = meta.attr('data-poster')
        const playUrl = randomPick(routes) + meta.attr('data-m3u8')!
        const downloadUrl = meta.attr('data-dl-base')! + meta.attr('data-mp4')!
        return createDataPayload({
            id: +id,
            title,
            litpic,
            tags: [tag],
            play_url: playUrl,
            download_url: downloadUrl,
            related: getDataList($, '.video-grid .group')
        })
    }
    return invalidQueryRequest('id')
}
import type { APIRoute } from 'astro'
import { cheerio } from '@adaptors/.'
import { getHtml, getApiUrl, createDataPayload } from '.'

export const GET: APIRoute = async ({ url }) => {
    const host = url.searchParams.get('host')!
    const html = await getHtml(
        getApiUrl(host)
    )
    const $ = cheerio.load(html)
    const categories = $('.cat-row a[data-cat-id]').map(
        function () {
            return {
                name: $(this).text(),
                value: +$(this).attr('data-cat-id')!
            }
        }
    ).get()
    const tags = $('.tags-inner a[data-tag-id]').map(
        function () {
            return {
                name: $(this).text(),
                value: +$(this).attr('data-tag-id')!
            }
        }
    ).get()
    return createDataPayload({
        categories,
        tags,
    })
}
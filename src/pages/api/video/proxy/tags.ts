import type { APIRoute } from 'astro'
import { getDocument, createDataPayload } from '.'

export const GET: APIRoute = async ({ url }) => {
    const { $ } = await getDocument(url.searchParams, '/sup')
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
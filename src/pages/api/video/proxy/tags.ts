import type { APIRoute } from 'astro'
import { getDocument, getBasePath, createDataPayload } from '.'

export const GET: APIRoute = async ({ url }) => {
    const basePath = await getBasePath(url.searchParams)
    const { $ } = await getDocument(url.searchParams, basePath)
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
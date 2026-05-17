import type { APIRoute } from 'astro'
import { getJson } from '@util/http'
import { getApiUrl, createDataPayload } from '.'

export const GET: APIRoute = async ({ url }) => {
    const t = Math.floor(Math.random() * 50) + 1
    const { list } = await getJson<{
        list: any;
    }>(
        getApiUrl(url.searchParams, `/json/recommend/rmd_${t}.json`)
    )
    return createDataPayload(list)
}
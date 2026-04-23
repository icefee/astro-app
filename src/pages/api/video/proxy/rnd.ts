import type { APIRoute } from 'astro'
import { getJson } from '@adaptors/.'
import { getApiUrl, createDataPayload } from '.'

export const GET: APIRoute = async ({ url }) => {
    const host = url.searchParams.get('host')!
    const t = Math.floor(Math.random() * 50) + 1
    const { list } = await getJson<{
        list: any;
    }>(
        getApiUrl(host, `/json/recommend/rmd_${t}.json`)
    )
    return createDataPayload(list)
}
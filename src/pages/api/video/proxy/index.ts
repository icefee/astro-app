import type { APIRoute } from 'astro'
import { getText, proxyRequest } from '@adaptors/common'
import { httpHeaders, } from '@util/common'

export const host = '88xx.info'

export const getApiUrl = (path: string) => `https://${host}/api/${path}`

export const getPageParams = (params: URLSearchParams) => {
    const p = params.get('p')
    return {
        page: p ? +p : 1,
        page_size: 60
    }
}

export const getHtml = (url: string) => getText(url, {
    headers: httpHeaders.client
})

export const GET: APIRoute = ({ url }) => {
    const params = url.searchParams
    const s = params.get('s')
    if (s) {
        return proxyRequest(
            getApiUrl('searchlist'),
            {
                method: 'post',
                body: JSON.stringify({
                    keyword: s,
                    ...getPageParams(params)
                })
            }
        )
    }
    return proxyRequest(
        getApiUrl('indexlist')
    )
}
import type { APIRoute } from 'astro'
import { getText } from '@adaptors/common'
import { httpHeaders } from '@util/common'

export const host = '88xx.info'

export const posterMatchReg = new RegExp('https://[\\w-./@%?:]+?\.webp', 'g')

export const getHtml = (url: string) => getText(url, {
    headers: httpHeaders.client
})

export const GET: APIRoute = async ({ url }) => {
    let path = 's1y2/f1_l2_l3_bbbb'
    if (url.searchParams.get('s')) {
        path = 's1s2/l1_bbbb'
    }
    return new Response(null, {
        status: 302,
        headers: {
            ...httpHeaders.cors,
            location: `https://${host}/api/${path}`
        }
    })
}
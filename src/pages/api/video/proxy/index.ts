import type { APIRoute } from 'astro'
import { getText, getJson } from '@adaptors/common'
import { httpHeaders } from '@util/common'
import { parseProxyVideoData } from '@util/crypto'

export const host = '88xx.info'
export const pageSize = 50
// const temporaryCheckUrl = 'https://mjv81xw.com'
// const posterPrefix = 'https://v1imvvfc356.salantool.com'

export const posterMatchReg = new RegExp('https://[\\w-./@%?:]+?\.webp', 'g')

export const getHtml = (url: string) => getText(url, {
    headers: httpHeaders.client
})

async function getLatest() {
    try {
        const data = await getJson<ProxyVideo.ApiJson>(
            `https://${host}/api/s1y2/f1_l2_l3_bbbb`
        )
        return {
            list: parseProxyVideoData<{
                list: ProxyVideo.SearchVideo[];
            } & ProxyVideo.Meta>(data)
        }
    }
    catch (err) {
        return null
    }
}

async function getSearch(text: string, page: number) {
    try {
        const payload = {
            text,
            page,
            pageSize
        }
        const data = await getJson<ProxyVideo.ApiJson>(
            `https://${host}/api/s1s2/l1_bbbb`,
            {
                method: 'POST',
                headers: httpHeaders.json,
                body: JSON.stringify(payload)
            }
        )
        return parseProxyVideoData<ProxyVideo.PagedList>(data)
    }
    catch (err) {
        return null
    }
}

export const GET: APIRoute = async ({ url }) => {
    const params = url.searchParams
    const s = params.get('s') ?? '', p = params.get('p')
    const headers = {
        ...httpHeaders.json,
        ...httpHeaders.cors
    }
    try {
        const page = p ? Number(p) : 1
        let data = null
        if (s === '') {
            data = await getLatest()
        }
        else {
            data = await getSearch(s, page)
        }
        return Response.json({
            code: 0,
            data,
            msg: '成功'
        }, {
            headers
        })
    }
    catch (err) {
        return Response.json({
            code: -1,
            data: null,
            msg: String(err)
        }, {
            status: 500,
            headers
        })
    }
}
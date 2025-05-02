import type { APIRoute } from 'astro'
import { getText, getJson } from '@adaptors/common'
import { httpHeaders } from '@util/common'
import { isDev, userAgent } from '@util/env'
import { parseProxyVideoData } from '@util/crypto'
import { Api } from '@util/config'

const checkUrl = 'https://8x8x.com'
// const temporaryCheckUrl = 'https://mjv81xw.com'
// const posterPrefix = 'https://v1imvvfc356.salantool.com'

export const posterMatchReg = new RegExp('https://[\\w-./@%?:]+?\.webp', 'g')

export const getHtml = (url: string) => getText(url, {
    headers: {
        'user-agent': userAgent
    }
})

async function getMatch(url: string, reg: RegExp) {
    try {
        const html = await getHtml(url)
        const matchedResult = html.match(reg)
        if (matchedResult) {
            return matchedResult[0]
        }
        throw new Error('Get match error')
    }
    catch (err) {
        return null
    }
}

/*
async function checkHostTemporary() {
    const hostMatchReg = /var\symdz1\s\=\s"\w+"/
    const matchBlock = await getMatch(
        temporaryCheckUrl,
        hostMatchReg
    )
    const matchedHost = matchBlock?.match(/\w+"$/)?.[0]?.replace('"', '')
    if (matchedHost) {
        return `${matchedHost}.mom`
    }
}
*/

async function checkHost() {
    const urlMatchReg = /[a-z\d]{3,}\.[a-z]{2,4}/g
    const matchBlock = await getMatch(
        isDev ? `${Api.proxy}/api/proxy?url=${checkUrl}` : checkUrl,
        new RegExp(`最新地址一：<br class="showBr"><a href="https?://${urlMatchReg.source}"`)
    )
    return matchBlock?.match(urlMatchReg)?.[0] ?? null
}

export async function withHost(params: URLSearchParams) {
    let host = params.get('host')
    if (!host) {
        host = await checkHost()
    }
    if (host) {
        return host
    }
    throw new Error('Invalid host')
}

async function getLatest(host: string) {
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

async function getSearch(host: string, text: string, page: number) {
    try {
        const payload = {
            text,
            page,
            pageSize: 12
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
    let host = params.get('host')
    const headers = {
        ...httpHeaders.json,
        ...httpHeaders.cors
    }
    try {
        const host = await withHost(params)
        const page = p ? Number(p) : 1
        let data = null
        if (s === '') {
            data = await getLatest(host)
        }
        else {
            data = await getSearch(host, s, page)
        }
        return Response.json({
            code: 0,
            data: {
                ...data,
                host
            },
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
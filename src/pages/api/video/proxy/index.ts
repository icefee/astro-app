import type { APIRoute } from 'astro'
import { getResponse, getText, getJson } from '@adaptors/common'
import { httpHeaders } from '@util/common'
import { isDev } from '@util/env'
import { parseProxyVideoData } from '@util/crypto'
// import { utf8Tobase64 } from '@util/base64'
import { Api } from '@util/config'

const checkUrl = 'https://8x8x.com'
// const temporaryCheckUrl = 'https://mjv81xw.com'
// const posterPrefix = 'https://v1imvvfc356.salantool.com'

export const posterMatchReg = new RegExp('https://[\\w-./@%?:]+?\.webp', 'g')

export const getHtml = (url: string) => getText(url, {
    headers: httpHeaders.client
})

async function getMatch(url: string, reg: RegExp) {
    try {
        const html = await getHtml(url)
        const matches = html.match(reg)
        if (matches) {
            return matches[0]
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

async function getRedirectUrl(url: string): Promise<string> {
    console.log('Get host url from: %s', url)
    const response = await getResponse(url, {
        redirect: 'manual',
        headers: httpHeaders.client
    })
    if (response.status === 302) {
        const location = response.headers.get('location')!
        console.log('302 found, redirect to: %s', location)
        return getRedirectUrl(location)
    }
    return new URL(url).host
}

async function checkHost() {
    console.log('Start check host...')
    const urlMatchReg = /([a-z\d]{3,}\.)+[a-z]{2,4}/g
    const matchBlock = await getMatch(
        isDev ? `${Api.proxy}/api/proxy?url=${checkUrl}` : checkUrl,
        new RegExp(`最新地址一：<br class="showBr"><a href="https?://${urlMatchReg.source}"`)
    )
    const host = matchBlock?.match(urlMatchReg)?.[0]
    return host ? host : null
}

export async function withHost(params: URLSearchParams) {
    let host = params.get('host')
    if (!host) {
        host = await checkHost()
    }
    console.log("host = %s", host)
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
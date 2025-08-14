import type { APIRoute } from 'astro'
import { getText, getJson } from '@adaptors/common'
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

export async function withHost(params?: URLSearchParams) {
    let host = params?.get('host')
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

export const GET: APIRoute = async ({ url }) => {
    const params = url.searchParams
    const host = params.get('host')
    let path = 's1y2/f1_l2_l3_bbbb'
    if (params.get('s')) {
        path = 's1s2/l1_bbbb'
    }
    return Response.redirect(`https://${host}/api/${path}`)
}
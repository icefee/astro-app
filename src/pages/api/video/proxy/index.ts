import type { APIRoute } from 'astro'
import { getText, getJson } from '@adaptors/common'
import { httpHeaders } from '@util/common'
import { isDev, userAgent } from '@util/env'
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

export async function checkHost() {
    const urlMatchReg = /[a-z\d]{3,}\.[a-z]{2,4}/g
    const matchBlock = await getMatch(
        isDev ? `${Api.proxy}/api/proxy?url=${checkUrl}` : checkUrl,
        new RegExp(`最新地址一：<br class="showBr"><a href="https?://${urlMatchReg.source}"`)
    )
    return matchBlock?.match(urlMatchReg)?.[0]
}

export async function getMetadata(host: string) {
    const { playurl, tags } = await getJson<{
        playurl: string[];
        playurl2: string[];
        tags: string[];
    }>(`https://${host}/c.json`)
    const prefix = playurl[Math.floor(Math.random() * playurl.length)]
    return {
        prefix,
        tags
    }
}

export function parseDataList(data: ProxyVideo.SearchVideo[]): ProxyVideo.VideoBase[] {
    return data.map(
        ({ litpic, ...rest }) => ({
            ...rest,
            poster: litpic
        })
    )
}

async function getLatest(host: string) {
    try {
        const { data } = await getJson<{
            data: [
                {
                    result1: ProxyVideo.TypedSearchVideo[];
                },
                {
                    result2: ProxyVideo.TypedSearchVideo[];
                }
            ]
        }>(`https://${host}/home`)
        return parseDataList([
            ...data[0].result1,
            ...data[1].result2
        ])
    }
    catch (err) {
        return null
    }
}

async function getSearch(host: string, title: string, page: number) {
    try {
        const searchParams = new URLSearchParams({
            key: title,
            p: `${page}`
        })
        const { data } = await getJson<ProxyVideo.SearchResult>(
            `https://${host}/api/searchs?${searchParams}`
        )
        return parseDataList(data)
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
        const host = await checkHost()
        if (host) {
            const page = p ? Number(p) : 1
            let list: ProxyVideo.VideoBase[] | null = null
            if (s === '') {
                list = await getLatest(host)
            }
            else {
                list = await getSearch(host, s, page)
            }
            list ??= []
            return Response.json({
                code: 0,
                data: {
                    list,
                    host
                },
                msg: '成功'
            }, {
                headers
            })
        }
        else {
            throw new Error('Invalid host')
        }
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
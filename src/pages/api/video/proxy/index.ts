import type { APIRoute } from 'astro'
import { getText } from '@adaptors/common'
import { httpHeaders } from '@util/common'
import { isDev, userAgent } from '@util/env'
import { Api } from '@util/config'

const checkUrl = 'https://8x8x.com'
const posterUrl = 'https://v1imvvfc356.salantool.com'

export const posterMatchReg = new RegExp('https://[\\w-./@%?:]+?\.webp', 'g')

export const getHtml = (url: string) => getText(url, {
    headers: {
        'user-agent': userAgent
    }
})

export async function checkHost() {
    const urlMatchReg = /[a-z\d]{3,}\.[a-z]{2,4}/g
    const matchBlock = await getMatch(
        isDev ? `${Api.proxy}/api/proxy?url=${checkUrl}` : checkUrl,
        new RegExp(`最新地址一：<br class="showBr"><a href="https?://${urlMatchReg.source}"`)
    )
    return matchBlock?.match(urlMatchReg)?.[0]
}

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

async function getLatest(host: string, page: number) {
    let url = `https://${host}/video`
    if (page > 1) {
        url += '/page/' + page
    }
    url += '/index.html'
    try {
        const html = await getHtml(url)
        let totalMatch = html.match(
            /<a href=\"\/video\/page\/\d{1,9}\/\" aria-label=\"末页\">/g
        )?.[0].match(/[1-9]\d{1,8}/g)?.[0]
        if (!totalMatch) {
            totalMatch = html.match(
                /<a aria-label=\"第 [1-9]\d{1,8} 页\">[1-9]\d{1,8}<\/a>/g
            )?.[0].match(/[1-9]\d{1,8}/g)?.[0]
            if (!totalMatch) {
                throw new Error('page match error')
            }
        }
        const total = Number(totalMatch)
        const posters = html.match(posterMatchReg)!
        const linkMatchReg = /(https:\/\/\w+.\w+)?\/video\/\d{1,9}\//
        const list = html.match(
            new RegExp(`<a href="${linkMatchReg.source}">.+?</a>`, 'g')
        )?.map(
            (link, index) => {
                let origin = null
                const pageUrl = link.match(linkMatchReg)![0]
                if (pageUrl.startsWith('http')) {
                    origin = pageUrl.match(/(?<=https:\/\/)\w+.\w+/)?.[0]
                }
                const id = pageUrl?.match(
                    /\d{4,9}(?=\/$)/
                )![0]
                const title = link.match(
                    new RegExp(`(?<=<a href=\"${linkMatchReg.source}\">).+?(?=<\/a>)`)
                )?.[0]
                const poster = posters[index]
                return {
                    id: +id,
                    title,
                    createTime: null,
                    origin,
                    poster
                }
            }
        )
        return {
            list,
            total,
            page
        }
    }
    catch (err) {
        return null
    }
}

async function getSearch(host: string, title: string, page: number) {
    try {
        const { data, totalPage: total, ...rest } = await fetch(`https://s.${host}/search`, {
            method: 'POST',
            body: new URLSearchParams({
                title,
                current: String(page),
                source: 'v1',
                size: '16'
            })
        }).then<ProxyVideo.SearchResult>(
            response => response.json()
        )
        const list = data.map(
            ({ videoInfoId: id, videoImgUrl, videoTitle: title, createTime }) => ({
                id,
                poster: posterUrl + videoImgUrl,
                title,
                createTime
            })
        )
        return {
            list,
            total,
            ...rest
        }
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
            let data = null
            if (s === '') {
                data = await getLatest(host, page)
            }
            else {
                data = await getSearch(host, s, page)
            }
            return Response.json({
                code: 0,
                data,
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
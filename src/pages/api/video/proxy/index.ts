import type { APIRoute } from 'astro'
import * as cheerio from 'cheerio'
import { httpHeaders, getText, getJson } from '@util/http'
import { isDev } from '@util/env'
import { Api } from '@util/config'

const checkUrl = 'https://8x8x.com'
// const temporaryCheckUrl = 'https://mjv81xw.com'
// const posterPrefix = 'https://v1imvvfc356.salantool.com'

export const getApiUrl = (host: string, path: string = '') => 'https://' + host + path

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

export const invalidQueryRequest = (key: string) => new Response(`invalid query: ${key}`, {
    status: 400
})

export const createDataPayload = <T>(data: T) => new Response(JSON.stringify({
    code: 0,
    data,
    msg: '成功'
}), {
    headers: {
        ...httpHeaders.json,
        ...httpHeaders.cors
    }
})

export const getDataList = (
    $: cheerio.CheerioAPI,
    selector: string | ReturnType<typeof $>
) => {
    return (typeof selector === 'string' ? $(selector) : selector).map(
        function () {
            const id = +$(this).attr('href')!.match(/(\d+)/)![0]
            const img = $(this).find('img.card-img')
            return {
                id,
                title: img.attr('alt'),
                litpic: img.attr('data-src')
            }
        }
    ).get()
}

export const getDocument = async (
    params: URLSearchParams,
    path: string = '',
    options?: cheerio.CheerioOptions
) => {
    const html = await getHtml(
        getApiUrl(params.get('host')!, path)
    )
    const $ = cheerio.load(html, options)
    return {
        $,
        html
    }
}

export const getPagedList = async (path: string, params: URLSearchParams) => {
    const { page } = getPageParams(params)
    let $path = path
    if (page > 1) {
        $path += `page/${page}/`
    }
    const { $, html } = await getDocument(params, $path)
    const list = getDataList($, '.video-grid a.group')
    const total = +html.match(/共\s\d+\s个视频/)![0].match(/\d+/)![0]
    const pages = +$('input.page-input').attr('data-max')!
    return createDataPayload({
        list,
        page,
        total,
        total_pages: pages,
    })
}

export function randomPick<T>(items: T[]) {
    return items[Math.floor(items.length * Math.random())]
}

async function checkHost() {
    console.log('Start check host...')
    const html = await getHtml(
        isDev ? `${Api.proxy}/api/proxy?url=${checkUrl}` : checkUrl,
    )
    const $ = cheerio.load(html)
    const hosts = $('.abc a').map(
        function () {
            const url = $(this).attr('href')!
            return new URL(url).host
        }
    ).get()
    return randomPick(hosts)
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

export const GET: APIRoute = async ({ url }) => {
    const params = url.searchParams
    const s = params.get('s')
    if (s) {
        const { page } = getPageParams(params)
        const uri = new URL(
            getApiUrl(params.get('host')!, '/api/search/video')
        )
        uri.searchParams.set('keyword', s)
        uri.searchParams.set('page', `${page}`)
        const { data } = await getJson<{
            data: any
        }>(uri)
        return createDataPayload(data)
    }
    const { $ } = await getDocument(params)
    const data = $('.home-section').filter(
        function () {
            return $(this).find('#recommend-grid').length === 0
        }
    ).map(
        function () {
            return {
                value: +$(this).find('.more-btn').attr('href')!.match(/\d+/)![0],
                name: $(this).find('.section-title').text(),
                list: getDataList($, $(this).find('.home-grid a.group'))
            }
        }
    ).get()
    return createDataPayload(data)
}
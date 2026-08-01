import type { APIRoute } from 'astro'
import { load, type CheerioAPI, type CheerioOptions } from 'cheerio'
import { httpHeaders, getText, getJson } from '@util/http'
import { isDev } from '@util/env'
import { Api } from '@util/config'
import { base64ToUtf8 } from '@util/base64'

const checkUrl = 'https://8x8x.com'
// const temporaryCheckUrl = 'https://mjv81xw.com'
// const posterPrefix = 'https://v1imvvfc356.salantool.com'

export const getApiUrl = (params: URLSearchParams, path: string = '') => 'https://' + params.get('host')! + path

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
    $: CheerioAPI,
    selector: string | ReturnType<typeof $>
) => {
    return (typeof selector === 'string' ? $(selector) : selector).map(
        function () {
            const id = +$(this).attr('href')!.match(/(\d+)/)![0]
            const title = $(this).find('.card-title').text()
            const img = $(this).find('img.card-img')
            return {
                id,
                title,
                litpic: img.attr('data-src')
            }
        }
    ).get()
}

export const getDocument = async (
    params: URLSearchParams,
    path: string = '',
    options?: CheerioOptions
) => {
    const html = await getHtml(
        getApiUrl(params, path)
    )
    const $ = load(html, options)
    return {
        $,
        html
    }
}

export const getBasePath = async (params: URLSearchParams) => {
    try {
        const { $ } = await getDocument(params)
        const src = $('script').eq(1).attr('src')!
        const source = await getHtml(
            getApiUrl(params, src)
        )
        const base64 = source.match(/atob\("([^"]*)"\)/)![1]
        return '/' + base64ToUtf8(base64)
    }
    catch (err) {
        return '/'
    }
}

export const getPagedList = async (path: string, params: URLSearchParams) => {
    const basePath = await getBasePath(params)
    let $path = basePath + path
    const { page } = getPageParams(params)
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
    const $ = load(html)
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
            getApiUrl(params, '/api/search/video')
        )
        uri.searchParams.set('keyword', s)
        uri.searchParams.set('page', `${page}`)
        const { data } = await getJson<{
            data: any
        }>(uri)
        return createDataPayload(data)
    }
    const path = await getBasePath(params)
    const { $ } = await getDocument(params, path)
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
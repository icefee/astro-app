import type { APIRoute } from 'astro'
import { getText } from '@adaptors/common'
import { httpHeaders } from '@util/common'
import { isDev } from '@util/env'
import { utf82utf16 } from '@util/parser'
import { Api } from '@util/config'

const checkUrl = 'https://8x8x.com'
// const temporaryCheckUrl = 'https://mjv81xw.com'
// const posterPrefix = 'https://v1imvvfc356.salantool.com'

export const posterMatchReg = new RegExp('https://[\\w-./@%?:]+?\.webp', 'g')

export const getHtml = (url: string) => getText(url, {
    headers: httpHeaders.client
})

async function getMatch(url: string, reg: RegExp): Promise<Record<'source' | 'result', string | null>> {
    try {
        const source = await getHtml(url)
        const matches = source.match(reg)
        if (matches) {
            return {
                source,
                result: matches[0]
            }
        }
        return {
            source,
            result: null
        }
    }
    catch (err) {
        return {
            source: null,
            result: null
        }
    }
}

async function checkHost() {
    console.log('Start check host...')
    const urlMatchReg = /([a-z\d]{3,}\.)+[a-z]{2,4}/g
    const blockMatchReg = new RegExp(`<br class="showBr"><a href="https?://${urlMatchReg.source}"`)
    let { source, result } = await getMatch(
        isDev ? `${Api.proxy}/api/proxy?url=${checkUrl}` : checkUrl,
        blockMatchReg
    )
    if (!result) {
        if (!source) {
            return null
        }
        const base64Text = source.match(
            new RegExp(`base64\\s=\\s"[\\w\\/\\+]+\={0,2}"`)
        )![0]
        const base64 = base64Text.slice(10, base64Text.length - 1)
        source = utf82utf16(atob(base64))
        result = source.match(blockMatchReg)![0]
    }
    return result.match(urlMatchReg)?.[0]
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
    const host = params.get('host')
    let path = 's1y2/f1_l2_l3_bbbb'
    if (params.get('s')) {
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
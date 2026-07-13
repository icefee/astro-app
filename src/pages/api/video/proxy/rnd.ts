import type { APIRoute } from 'astro'
import { getText } from '@util/http'
import { getApiUrl, createDataPayload } from '.'

const base64ToBytes = (source: string) => {
    let s = source.replace(/-/g, '+').replace(/_/g, '/')
    while (s.length % 4) s += '='
    var bin = atob(s);
    var arr = new Uint8Array(bin.length)
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
    return arr
}

var _q = 'VzykaRDU6BDMtduly8ERIbtBlEJejL9xs7RhqmQ6Ycs='
var _s = 'vjs-hls-abr-4'

function _rk() {
    var o = atob(_q), a = new Uint8Array(o.length)
    for (var i = 0; i < o.length; i++) a[i] = o.charCodeAt(i) ^ _s.charCodeAt(i % _s.length)
    return a
}

function utf8Decode(buffer: ArrayBuffer) {
    var b = new Uint8Array(buffer), out = '', i = 0, n = b.length, c, cp
    while (i < n) {
        c = b[i++];
        if (c < 0x80) {
            out += String.fromCharCode(c)
        } else if (c < 0xE0) {
            out += String.fromCharCode(((c & 0x1F) << 6) | (b[i++] & 0x3F));
        } else if (c < 0xF0) {
            out += String.fromCharCode(((c & 0x0F) << 12) | ((b[i++] & 0x3F) << 6) | (b[i++] & 0x3F))
        } else {
            cp = (((c & 0x07) << 18) | ((b[i++] & 0x3F) << 12) | ((b[i++] & 0x3F) << 6) | (b[i++] & 0x3F)) - 0x10000
            out += String.fromCharCode(0xD800 + (cp >> 10), 0xDC00 + (cp & 0x3FF))
        }
    }
    return out
}


const decodeData = async (source: string) => {
    try {
        return JSON.parse(source)
    }
    catch (err) {
        var raw = base64ToBytes(source.trim())
        var iv = raw.subarray(0, 12)
        var body = raw.subarray(12)
        const key = await crypto.subtle
            .importKey('raw', _rk(), { name: 'AES-GCM' }, false, ['decrypt'])
        const buffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, body)
        return JSON.parse(utf8Decode(buffer))
    }
}

export const GET: APIRoute = async ({ url }) => {
    const t = Math.floor(Math.random() * 50) + 1
    const source = await getText(
        getApiUrl(url.searchParams, `/json/recommend/rmd_${t}`)
    )
    const { list } = await decodeData(source)
    return createDataPayload(list)
}
import type { APIRoute } from 'astro'
import { getJson } from '@adaptors/common'
import { httpHeaders } from '@util/common'
import { host } from './'
import { parseProxyVideoData } from '@util/crypto'

export const GET: APIRoute = async ({ url }) => {
    const params = url.searchParams
    const headers = {
        ...httpHeaders.json,
        ...httpHeaders.cors
    }
    try {
        let apiUrl = `https://${host}/api/t1j2/l1_dddd`
        if (params.get('type')) {
            apiUrl += '?type=index'
        }
        const data = await getJson<ProxyVideo.ApiJson>(apiUrl)
        return Response.json({
            code: 0,
            data: {
                list: parseProxyVideoData<ProxyVideo.SearchVideo[]>(data)
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
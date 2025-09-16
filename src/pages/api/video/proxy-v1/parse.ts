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
        const query = {
            id: +params.get('id')!
        }
        const data = await getJson<ProxyVideo.ApiJson>(
            `https://${host}/api/p1/x1_q2_aaaa`,
            {
                method: 'POST',
                headers: httpHeaders.json,
                body: JSON.stringify(query)
            }
        )
        return Response.json({
            code: 0,
            data: parseProxyVideoData<ProxyVideo.SearchVideo>(data),
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
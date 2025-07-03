import type { APIRoute } from 'astro'
import { getJson } from '@adaptors/common'
import { httpHeaders } from '@util/common'
import { withHost } from './'
import { parseProxyVideoData } from '@util/crypto'

export const GET: APIRoute = async ({ url }) => {
    const headers = {
        ...httpHeaders.json,
        ...httpHeaders.cors
    }
    try {
        const params = url.searchParams
        const c = params.get('c')
        const p = params.get('p')
        const page = p ? +p : 1
        const host = await withHost(params)
        const query = {
            type: c ?? params.get('t') ?? '',
            page,
            pageSize: 12
        }
        const data = await getJson<ProxyVideo.ApiJson>(
            `https://${host}/api/${c ? 'f1l2/l1_aaaa' : 'b1q2/l1_cccc'}`,
            {
                method: 'POST',
                headers: httpHeaders.json,
                body: JSON.stringify(query)
            }
        )
        return Response.json({
            code: 0,
            data: {
                ...parseProxyVideoData<ProxyVideo.PagedList>(data),
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
import type { APIRoute } from 'astro'
import { getJson } from '@adaptors/common'
import { httpHeaders } from '@util/common'
import { withHost } from './'
// import { parseProxyVideoData } from '@util/crypto'

export const GET: APIRoute = async ({ url }) => {
    const headers = {
        ...httpHeaders.json,
        ...httpHeaders.cors
    }
    try {
        const host = await withHost(url.searchParams)
        const { code, data, message } = await getJson<ProxyVideo.ApiDataType<{
            list: ProxyVideo.Meta[];
        }>>(
            `https://${host}/api/s1y2/b1_f2_cccc`,
            {
                headers: httpHeaders.client
            }
        )
        if (code !== 200) {
            throw new Error(message)
        }
        return Response.json({
            code: 0,
            data: {
                ...data,
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
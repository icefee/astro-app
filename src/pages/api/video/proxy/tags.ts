import type { APIRoute } from 'astro'
import { getJson } from '@adaptors/common'
import { httpHeaders } from '@util/common'
import { host } from './'

export const GET: APIRoute = async () => {
    const headers = {
        ...httpHeaders.json,
        ...httpHeaders.cors
    }
    try {
        const { code, data, message } = await getJson<ProxyVideo.ApiDataType<{
            list: ProxyVideo.Meta[];
        }>>(`https://${host}/api/s1y2/b1_f2_cccc`)
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
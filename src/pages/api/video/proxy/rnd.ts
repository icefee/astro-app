import type { APIRoute } from 'astro'
import { getJson } from '@adaptors/common'
import { httpHeaders } from '@util/common'
import { checkHost } from './'
import { parseProxyVideoData } from '@util/crypto'

export const GET: APIRoute = async () => {
    const headers = {
        ...httpHeaders.json,
        ...httpHeaders.cors
    }
    try {
        const host = await checkHost()
        if (host) {
            const data = await getJson<ProxyVideo.ApiJson>(
                `https://${host}/api/t1j2/l1_dddd`
            )
            return Response.json({
                code: 0,
                data: {
                    ...parseProxyVideoData(data),
                    host
                },
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
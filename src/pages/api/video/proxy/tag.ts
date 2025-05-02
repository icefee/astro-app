import type { APIRoute } from 'astro'
import { getJson } from '@adaptors/common'
import { httpHeaders } from '@util/common'
import { checkHost } from './'
import { parseProxyVideoData } from '@util/crypto'

export const GET: APIRoute = async ({ url }) => {
    const params = url.searchParams
    const t = params.get('t') ?? '', p = params.get('p') ?? 1
    const headers = {
        ...httpHeaders.json,
        ...httpHeaders.cors
    }
    try {
        const host = await checkHost()
        if (host) {
            const payload = {
                type: t,
                page: p,
                pageSize: 12
            }
            const data = await getJson<ProxyVideo.ApiJson>(
                `https://${host}/api/f1l2/l1_aaaa`,
                {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
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
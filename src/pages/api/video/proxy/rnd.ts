import type { APIRoute } from 'astro'
import { getJson } from '@adaptors/common'
import { httpHeaders } from '@util/common'
import { checkHost } from './'

export const GET: APIRoute = async ({ url }) => {
    const params = url.searchParams
    const s = params.get('s') ?? '', p = params.get('p')
    const headers = {
        ...httpHeaders.json,
        ...httpHeaders.cors
    }
    try {
        const host = await checkHost()
        if (host) {
            const { data } = await getJson<{
                data: ProxyVideo.SearchVideo[];
            }>(`https://${host}/rdlist`)
            return Response.json({
                code: 0,
                data: {
                    list: data,
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
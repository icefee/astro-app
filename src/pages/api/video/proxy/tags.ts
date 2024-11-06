import type { APIRoute } from 'astro'
import { httpHeaders } from '@util/common'
import { checkHost, getMetadata } from './'

export const GET: APIRoute = async () => {
    const headers = {
        ...httpHeaders.json,
        ...httpHeaders.cors
    }
    try {
        const host = await checkHost()
        if (host) {
            const { tags } = await getMetadata(host)
            return Response.json({
                code: 0,
                data: tags,
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
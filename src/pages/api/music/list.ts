import type { APIRoute } from 'astro'
import { createApiAdaptor, adaptors } from '@adaptors/.'
import { httpHeaders } from '@util/http'

export const GET: APIRoute = async ({ url }) => {
    const headers = {
        ...httpHeaders.json,
        ...httpHeaders.cors
    }
    try {
        const s = url.searchParams.get('s')!
        const data: SearchMusic[] = []
        for (const k of adaptors) {
            const adaptor = createApiAdaptor(k)
            const result = await adaptor?.getMusicSearch(s)
            if (result) {
                data.push(...result)
            }
        }
        return Response.json({
            code: 0,
            data,
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
            status: 503,
            headers
        })
    }
}

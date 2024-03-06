import type { APIRoute } from 'astro'
import { createApiAdaptor, adaptors } from '@adaptors/.'
import { httpHeaders } from '@util/common'

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
        return new Response(JSON.stringify({
            code: 0,
            data,
            msg: '成功'
        }), {
            status: 200,
            headers
        })
    }
    catch (err) {
        return new Response(JSON.stringify({
            code: -1,
            data: null,
            msg: String(err)
        }), {
            status: 503,
            headers
        })
    }
}

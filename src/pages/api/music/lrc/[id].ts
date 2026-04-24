import type { APIRoute } from 'astro'
import { createApiAdaptor, parseId } from '@adaptors/.'
import { httpHeaders } from '@util/http'

export const GET: APIRoute = async ({ params }) => {
    const headers = {
        ...httpHeaders.json,
        ...httpHeaders.cors
    }
    try {
        const { key, id } = parseId(params.id!);
        const adaptor = createApiAdaptor(key)!;
        const lrc = await adaptor.parseLrc(id);
        if (lrc) {
            return Response.json({
                code: 0,
                data: lrc,
                msg: '成功'
            }, {
                headers
            })
        }
        else {
            throw new Error('lrc parse error')
        }
    }
    catch (err) {
        return Response.json({
            code: -1,
            data: null,
            msg: String(err)
        }, {
            headers
        })
    }
}

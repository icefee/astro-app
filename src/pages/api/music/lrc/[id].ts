import type { APIRoute } from 'astro'
import { createApiAdaptor, parseId } from '@adaptors/.'
import { httpHeaders } from '@util/common'

export const get: APIRoute = async ({ params }) => {
    try {
        const { key, id } = parseId(params.id!);
        const adaptor = createApiAdaptor(key)!;
        const lrc = await adaptor.parseLrc(id);
        if (lrc) {
            return new Response(JSON.stringify({
                code: 0,
                data: lrc,
                msg: '成功'
            }), {
                headers: httpHeaders.json
            })
        }
        else {
            throw new Error('lrc parse error')
        }
    }
    catch (err) {
        return new Response(JSON.stringify({
            code: -1,
            data: null,
            msg: String(err)
        }), {
            headers: httpHeaders.json
        })
    }
}

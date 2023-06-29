import type { APIRoute } from 'astro'
import { createApiAdaptor, parseId } from '@adaptors/.'
import { httpHeaders } from '@util/common'

export const get: APIRoute = async ({ params }) => {
    try {
        const { key, id } = parseId(params.id!);
        const adaptor = createApiAdaptor(key)!;
        const url = await adaptor.parseMusicUrl(id);
        if (url) {
            return Response.redirect(url)
        }
        else {
            throw new Error('music url parse error')
        }
    }
    catch (err) {
        return new Response('song not found', {
            status: 404,
            headers: httpHeaders.html
        })
    }
}

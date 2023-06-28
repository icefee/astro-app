import type { APIRoute } from 'astro'
import { Buffer } from 'node:buffer'
import { createApiAdaptor, parseId } from '@adaptors/.'
import { httpHeaders } from '@util/common'

export const get: APIRoute = async ({ params }) => {
    try {
        const { key, id } = parseId(params.id!);
        const adaptor = createApiAdaptor(key)!;
        const url = await adaptor.parseMusicUrl(id);
        if (url) {
            const response = await fetch(url);
            const buffer = Buffer.from(await response.arrayBuffer());
            return new Response(buffer, {
                headers: response.headers
            })
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

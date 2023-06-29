import type { APIRoute } from 'astro'
import { createApiAdaptor, parseId, defaultPoster } from '@adaptors/.'

export const get: APIRoute = async ({ params }) => {
    try {
        const { key, id } = parseId(params.id!);
        const adaptor = createApiAdaptor(key)!;
        const poster = await adaptor.parsePoster(id);
        if (poster) {
            return Response.redirect(poster)
        }
        else {
            throw new Error('can not find poster')
        }
    }
    catch (err) {
        return Response.redirect(defaultPoster)
    }
}

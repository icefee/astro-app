import type { APIRoute } from 'astro'
import { createApiAdaptor, adaptors } from '@adaptors/.'
import { httpHeaders } from '@util/common'

export const get: APIRoute = async ({ url }) => {
    try {
        const s = url.searchParams.get('s')
        const list: SearchMusic[] = [];

        for (const k of adaptors) {
            const adaptor = createApiAdaptor(k);
            const result = await adaptor?.getMusicSearch(s as string);
            if (result) {
                list.push(...result);
            }
        }
        return new Response(JSON.stringify(list), {
            status: 200,
            headers: httpHeaders.json
        })
    }
    catch (err) {
        return new Response(JSON.stringify({
            code: -1,
            data: null,
            msg: String(err)
        }), {
            status: 503,
            headers: httpHeaders.json
        })
    }
}

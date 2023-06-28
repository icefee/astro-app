import type { APIRoute } from 'astro'
import { Api } from '@util/config'
import { httpHeaders } from '@util/common'
import Clue from '@util/clue'

export const get: APIRoute = async ({ params, url, redirect }) => {
    try {
        if (!params.id) {
            throw new Error('param {id} must be provided')
        }
        const { api, id } = Clue.parse(params.id)!
        const response = await fetch(`${Api.site}/api/video/${api}/${id}`)
        const type = url.searchParams.get('type')
        if (type === 'poster') {
            const { code, data, msg } = await (response.json() as Promise<ApiJsonType<VideoInfo>>)
            if (code === 0) {
                return redirect(data.pic)
            }
            else {
                throw new Error(msg)
            }
        }
        else {
            const payload = await response.text()
            return new Response(payload, {
                status: 200,
                headers: httpHeaders.json
            })
        }
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

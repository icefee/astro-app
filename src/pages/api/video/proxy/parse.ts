import type { APIRoute } from 'astro'
import { httpHeaders } from '@util/common'
import { getJson } from '@adaptors/common'
import { checkHost, getMetadata, parseDataList } from './'

const mp4AssetPrefix = 'https://8xiy4.xyz/assets/'

async function parseVideo({
    host,
    id: videoId
}: {
    host: string;
    id: number;
}, related: boolean = false) {
    try {
        const { data } = await getJson<{
            data: [
                {
                    result1: ProxyVideo.SearchVideo & {
                        typename: string;
                        playurl: string;
                        tag: string;
                        body: string;
                        downloadurl: string;
                    }
                },
                {
                    result2: ProxyVideo.SearchVideo[]
                }
            ];
        }>(`https://${host}/detail/${videoId}`)
        const { prefix } = await getMetadata(host)
        const { id, title, litpic: poster, tag, playurl, downloadurl } = data[0].result1
        const urls = {
            m3u8: prefix + playurl,
            mp4: mp4AssetPrefix + downloadurl.replace('/', '.')
        }
        if (related) {
            return {
                id,
                title,
                poster,
                tag,
                urls,
                related: parseDataList(data[1].result2)
            }
        }
        return {
            id,
            title,
            poster,
            urls,
            related: []
        }
    }
    catch (err) {
        return {
            video: null,
            related: []
        }
    }
}

export const GET: APIRoute = async ({ url }) => {
    const params = url.searchParams
    const host = params.get('origin') ?? await checkHost()
    const headers = {
        ...httpHeaders.json,
        ...httpHeaders.cors
    }
    try {
        if (host) {
            const id = +params.get('id')!
            const data = await parseVideo(
                { host, id },
                params.get('related') === '1'
            )
            return Response.json({
                code: 0,
                data,
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
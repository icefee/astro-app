import type { APIRoute } from 'astro'
import { httpHeaders } from '@util/common'
import { checkHost, getHtml, posterMatchReg } from './'

async function parseVideo(url: string, related: boolean) {
    try {
        const html = await getHtml(url)
        const urls = {} as Record<'mp4' | 'm3u8', string | undefined>
        urls.mp4 = html.match(
            /https:\/\/[\da-z]{4,10}\.[a-z]{2,5}\/assets\/[\da-z]+\.(mp4|webm)/g
        )?.[0]
        const title = html.match(
            /(?<=<h1 class="lhgt">).+(?=<\/h1>)/
        )?.[0]
        const poster = html.match(posterMatchReg)?.[0]
        const scriptUrl = html.match(
            /https:\/\/\w+\.\w+.\w+\/gs\.js/
        )![0]
        const scriptSource = await getHtml(scriptUrl)
        const cdnSource = scriptSource.match(
            /(?<=var\spturl\s=\s).+?(?=;)/
        )![0]
        const cdnUrls = JSON.parse(cdnSource)
        const cdn = cdnUrls[Math.floor(Math.random() * cdnUrls.length)]
        const hlsAsset = html.match(/\w+\/index.m3u8/)?.[0]
        urls.m3u8 = cdn + hlsAsset
        if (related) {
            const dataUrlMatch = html.match(
                new RegExp('https://\\w+.\\w+.[a-z]{2,5}/index.json')
            )
            if (dataUrlMatch) {
                const dataUrl = dataUrlMatch[0]
                const source = await getHtml(dataUrl)
                const dataList = source.match(
                    /{[^}]+}/gm
                )!.map(
                    json => {
                        const { t, c, k } = JSON.parse(json)
                        const id = k.match(
                            /\d{1,9}/
                        )?.[0]
                        return {
                            id: Number(id),
                            title: t,
                            poster: c.replace(/.js$/, ''),
                            createTime: null
                        }
                    }
                )
                return {
                    video: {
                        title,
                        poster,
                        urls
                    },
                    related: dataList
                }
            }
        }
        return {
            video: {
                title,
                poster,
                urls
            },
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
    const id = params.get('id')!, related = params.get('related')
    let host = params.get('origin') ?? await checkHost()
    const headers = {
        ...httpHeaders.json,
        ...httpHeaders.cors
    }
    try {
        if (host) {
            const videoId = +id
            const relatedRequired = related === '1'
            const { video, related: relatedList } = await parseVideo(`https://${host}/video/${id}/`, relatedRequired)
            const videoData = {
                id: videoId,
                ...video
            }
            const data = relatedRequired ? {
                ...videoData,
                related: relatedList.filter(
                    (video) => video.id !== videoId
                ).sort(_ => Math.random() - .5).slice(0, 20)
            } : videoData
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
import type { Adaptor } from '.'
import { isTextNotNull } from '@util/string'

export const defaultPoster = `/poster.jpg`

export function parseId(id: string) {
    const key = id[0] as Adaptor;
    return {
        key,
        id: id.slice(1)
    }
}

function toPrecision(n: number) {
    return Math.round((n * 100)) / 100;
}

function parseDuration(time: string) {
    const timeStamp = time.match(/^\d{1,2}:\d{1,2}/)
    const [m, s] = timeStamp![0].split(':')
    const millsMatch = time.match(/\.\d*/)
    const mills = parseFloat(millsMatch![0])
    return toPrecision(parseInt(m) * 60 + parseInt(s) + (Number.isNaN(mills) ? 0 : mills))
}

export function parseLrcText(text: string) {
    const lines = text.split(/\r?\n/)
    const lrcs = []
    for (const line of lines) {
        const timeMatchReg = /\[\d{1,2}:\d{1,2}\.\d*\]/g
        const timeMatchs = line.match(timeMatchReg)
        const text = line.replace(timeMatchReg, '')
        if (timeMatchs && isTextNotNull(text)) {
            for (const timeMatch of timeMatchs) {
                lrcs.push({
                    time: parseDuration(timeMatch.replace(/(\[|\])/g, '')),
                    text
                })
            }
        }
    }
    return lrcs.sort(
        (prev, next) => prev.time - next.time
    )
}

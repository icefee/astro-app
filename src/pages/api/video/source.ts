import type { APIRoute } from 'astro'
import { sources } from '@data/.'
import { httpHeaders } from '@util/http'
import { createPayload } from '@util/middleware'

interface DataSource {
    key: string;
    name: string;
    rating: number;
}

export const GET: APIRoute = async ({ url }) => {
    const init: RequestInit = {
        headers: {
            ...httpHeaders.json
        }
    }
    const data: DataSource[] = []
    for (const { key, name, rating, prefer } of sources) {
        if (url.searchParams.get('prefer') !== null !== prefer) {
            continue
        }
        data.push({
            key,
            name,
            rating
        })
    }
    return Response.json(createPayload(data), init)
}

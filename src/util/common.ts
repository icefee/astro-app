export const unsafe_fetch: typeof fetch = (...args) => {
    /* @ts-ignore */
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    return fetch(...args)
}

export namespace httpHeaders {

    export const json = {
        'content-type': 'application/json'
    }

    export const html = {
        'content-type': 'text/html'
    }

    export const cors = {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET,OPTIONS',
        'access-control-allow-headers': 'Range,Cache-Control',
        'access-control-expose-headers': 'Content-Length,Content-Range,Content-Disposition'
    }
}

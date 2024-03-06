
export namespace httpHeaders {

    export const json = {
        'Content-Type': 'application/json'
    }

    export const html = {
        'Content-Type': 'text/html'
    }

    export const cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Range,Cache-Control',
        'Access-Control-Expose-Headers': 'Content-Length,Content-Range,Content-Disposition'
    }
}

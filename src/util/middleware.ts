export const createPayload = <T = unknown>(data: T) => {
    return {
        code: 0,
        data,
        msg: '成功'
    }
}

export const createErrorPayload = (error: any = '失败') => {
    const msg = error instanceof Error ? error.message : String(error)
    return {
        code: -1,
        data: null,
        msg
    }
}
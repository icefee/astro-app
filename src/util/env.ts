
export const isDev = import.meta.env.DEV

export const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
}

export const isIos = () => {
    return /iP(hone|ad|od)/i.test(navigator.userAgent)
}

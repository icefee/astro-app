export const isDev = import.meta.env.DEV

export const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0'

export const isMobileDevice = (userAgent = navigator.userAgent) => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(userAgent)
}

export const isIos = () => {
    return /iP(hone|ad|od)/i.test(navigator.userAgent)
}
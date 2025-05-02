import CryptoJS from 'crypto-js'

export function parseProxyVideoData<T>({ iv, data }: ProxyVideo.ApiJson): T | null {
    const e = CryptoJS.enc.Utf8.parse('AaWEabcd123789eF')
        , n = CryptoJS.enc.Base64.parse(iv)
        , s = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Base64.parse(data)
        })
        , r = CryptoJS.AES.decrypt(s, e, {
            iv: n,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
    try {
        const t = r.toString(CryptoJS.enc.Utf8);
        return JSON.parse(t)
    } catch (i) {
        return null
    }
}
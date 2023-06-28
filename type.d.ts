declare type VideoItem = {
    label: string;
    url: string;
}

declare type VideoSource = {
    name: string;
    urls: VideoItem[]
}

declare interface VideoInfo {
    name: string;
    subname?: string;
    note: string;
    pic: string;
    type: string;
    year: string;
    actor?: string;
    area?: string;
    des: string;
    director?: string;
    lang: string;
    last: string;
    state: number;
    tid: number;
    dataList: VideoSource[]
}

interface ApiJsonSuccess<T = unknown> {
    code: 0;
    data: T;
    msg: string;
}

interface ApiJsonFail {
    code: -1;
    data: null;
    msg: string;
}

declare type ApiJsonType<T = unknown> = ApiJsonSuccess<T> | ApiJsonFail;

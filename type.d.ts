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

declare interface SearchMusic {
    id: string;
    name: string;
    artist: string;
    url: string;
    poster: string;
}

declare interface ApiJsonSuccess<T = unknown> {
    code: 0;
    data: T;
    msg: string;
}

declare interface ApiJsonFail {
    code: -1;
    data: null;
    msg: string;
}

declare type ApiJsonType<T = unknown> = ApiJsonSuccess<T> | ApiJsonFail;

declare namespace ProxyVideo {

    export interface ApiJson {
        code: number;
        data: string;
        iv: string;
        message: string;
    }

    export interface Meta {
        name: string;
        value: string;
    }

    export interface SearchVideo {
        id: number;
        source: number;
        date_created: string;
        title: string;
        litpic: string;
        keywords: string;
        typename: Meta[];
        playurl: string;
        downloadurl: string;
        tag: Meta[];
        body: string;
    }

    export interface PagedList {
        list: SearchVideo[];
        count: number;
    }

    export interface TypedSearchVideo extends SearchVideo {
        typename: string;
    }

    export interface SearchResult<T = SearchVideo> {
        data: T[];
        status: number;
    }

    export interface ParsedResult<T = ParsedVideo> extends Pick<SearchResult<T>, 'page'> {
        list: T[];
        total: number;
        host: string;
        posterPrefix: string;
    }

    interface VideoBase {
        id: number;
        title: string;
        poster: string;
    }

    export interface VideoData extends VideoBase {
        urls: {
            mp4: string;
            m3u8: string;
        };
    }

    export interface VideoInfo extends VideoData {
        related: ParsedVideo[];
    }
}
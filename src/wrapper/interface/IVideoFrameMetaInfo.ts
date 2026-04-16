import { META_INFO_KEY } from "../types/AgoraMediaBase";

export interface IVideoFrameMetaInfo {
    getMetaInfoStr(key: META_INFO_KEY): string;
}

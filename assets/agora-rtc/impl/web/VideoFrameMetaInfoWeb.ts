import { META_INFO_KEY } from "../../types/AgoraMediaBase";

export class VideoFrameMetaInfoWeb {
    async getMetaInfoStr(key: META_INFO_KEY): Promise<string> {
        console.warn("getMetaInfoStr not support in web");
        return "";
    }
}

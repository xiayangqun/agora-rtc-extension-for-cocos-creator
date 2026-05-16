import { IVideoFrameMetaInfo } from "../../interface/IVideoFrameMetaInfo";
import { META_INFO_KEY } from "../../types/AgoraMediaBase";
import { ERROR_CODE_TYPE } from "../../types/AgoraBase";

export class VideoFrameMetaInfoWeb implements IVideoFrameMetaInfo {
    async getMetaInfoStr(key: META_INFO_KEY): Promise<string> {
        console.warn("getMetaInfoStr not support in web");
        return "";
    }
}

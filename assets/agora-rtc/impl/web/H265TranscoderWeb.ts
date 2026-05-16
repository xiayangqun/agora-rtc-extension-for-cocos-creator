import { IH265Transcoder } from "../../interface/IH265Transcoder";
import { IH265TranscoderObserver } from "../../interface/IH265TranscoderObserver";
import { ERROR_CODE_TYPE } from "../../types/AgoraBase";

const ERR_NOT_SUPPORTED = ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;

export class H265TranscoderWeb implements IH265Transcoder {
    async enableTranscode(token: string, channel: string, uid: number): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async queryChannel(token: string, channel: string, uid: number): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async triggerTranscode(token: string, channel: string, uid: number): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async registerTranscoderObserver(observer: IH265TranscoderObserver): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async unregisterTranscoderObserver(): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }
}

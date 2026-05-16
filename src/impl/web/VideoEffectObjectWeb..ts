import { IVideoEffectObject } from "../../interface/IVideoEffectObject";
import { VIDEO_EFFECT_ACTION } from "../../types/AgoraRtcEngine";
import { ERROR_CODE_TYPE } from "../../types/AgoraBase";

const ERR_NOT_SUPPORTED = ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;

export class VideoEffectObjectWeb implements IVideoEffectObject {
    async getObjectId(): Promise<number> {
        console.warn("getObjectId not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async addOrUpdateVideoEffect(nodeId: number, templateName: string): Promise<number> {
        console.warn("addOrUpdateVideoEffect not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async removeVideoEffect(nodeId: number): Promise<number> {
        console.warn("removeVideoEffect not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async performVideoEffectAction(nodeId: number, actionId: VIDEO_EFFECT_ACTION): Promise<number> {
        console.warn("performVideoEffectAction not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setVideoEffectFloatParam(option: string, key: string, param: number): Promise<number> {
        console.warn("setVideoEffectFloatParam not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setVideoEffectIntParam(option: string, key: string, param: number): Promise<number> {
        console.warn("setVideoEffectIntParam not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async setVideoEffectBoolParam(option: string, key: string, param: boolean): Promise<number> {
        console.warn("setVideoEffectBoolParam not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getVideoEffectFloatParam(option: string, key: string): Promise<number> {
        console.warn("getVideoEffectFloatParam not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getVideoEffectIntParam(option: string, key: string): Promise<number> {
        console.warn("getVideoEffectIntParam not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getVideoEffectBoolParam(option: string, key: string): Promise<boolean> {
        console.warn("getVideoEffectBoolParam not support in web");
        return false;
    }
}

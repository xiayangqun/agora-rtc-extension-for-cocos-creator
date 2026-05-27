import { VIDEO_EFFECT_ACTION } from "../types/AgoraRtcEngine";

export interface IVideoEffectObject {
    addOrUpdateVideoEffect(nodeId: number, templateName: string): Promise<number>;

    removeVideoEffect(nodeId: number): Promise<number>;

    performVideoEffectAction(nodeId: number, actionId: VIDEO_EFFECT_ACTION): Promise<number>;

    setVideoEffectFloatParam(option: string, key: string, param: number): Promise<number>;

    setVideoEffectIntParam(option: string, key: string, param: number): Promise<number>;

    setVideoEffectBoolParam(option: string, key: string, param: boolean): Promise<number>;

    getVideoEffectFloatParam(option: string, key: string): Promise<number>;

    getVideoEffectIntParam(option: string, key: string): Promise<number>;

    getVideoEffectBoolParam(option: string, key: string): Promise<boolean>;
}

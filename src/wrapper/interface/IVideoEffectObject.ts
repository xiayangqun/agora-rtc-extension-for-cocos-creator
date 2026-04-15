import { VIDEO_EFFECT_ACTION } from "../types/AgoraRtcEngine";

 
export interface IVideoEffectObject {
    getObjectId(): number;

    addOrUpdateVideoEffect(nodeId:number, templateName:string): number;

    removeVideoEffect(nodeId:number): number;

    performVideoEffectAction(nodeId:number, actionId:VIDEO_EFFECT_ACTION): number;

    setVideoEffectFloatParam(option:string, key:string, param:number): number;

    setVideoEffectIntParam(option:string, key:string, param:number): number;

    setVideoEffectBoolParam(option:string, key:string, param:boolean): number;

    getVideoEffectFloatParam(option:string, key:string): number;

    getVideoEffectIntParam(option:string, key:string): number;

    getVideoEffectBoolParam(option:string, key:string): boolean;

}

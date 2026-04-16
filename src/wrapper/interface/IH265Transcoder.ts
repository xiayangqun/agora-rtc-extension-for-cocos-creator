import { IH265TranscoderObserver } from "./IH265TranscoderObserver";

export interface IH265Transcoder {
    enableTranscode(token: string, channel: string, uid: number): number;

    queryChannel(token: string, channel: string, uid: number): number;

    triggerTranscode(token: string, channel: string, uid: number): number;

    registerTranscoderObserver(observer: IH265TranscoderObserver): number;

    unregisterTranscoderObserver(): number;
}

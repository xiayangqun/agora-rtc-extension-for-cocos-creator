import { IH265TranscoderObserver } from "./IH265TranscoderObserver";

export interface IH265Transcoder {
    enableTranscode(token: string, channel: string, uid: number): Promise<number>;

    queryChannel(token: string, channel: string, uid: number): Promise<number>;

    triggerTranscode(token: string, channel: string, uid: number): Promise<number>;

    registerTranscoderObserver(observer: IH265TranscoderObserver): Promise<number>;

    unregisterTranscoderObserver(): Promise<number>;
}

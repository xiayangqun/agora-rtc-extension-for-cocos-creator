import { H265_TRANSCODE_RESULT } from "../types/AgoraH265Transcoder";

export abstract class IH265TranscoderObserver {
    abstract onEnableTranscode(result: H265_TRANSCODE_RESULT): void;

    abstract onQueryChannel(result: H265_TRANSCODE_RESULT, originChannel: string, transcodeChannel: string): void;

    abstract onTriggerTranscode(result: H265_TRANSCODE_RESULT): void;
}

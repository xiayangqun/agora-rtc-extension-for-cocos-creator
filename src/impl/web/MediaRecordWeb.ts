import { IMediaRecorder } from "../../interface/IMediaRecorder";
import { IMediaRecorderObserver } from "../../interface/IMediaRecorderObserver";
import { MediaRecorderConfiguration } from "../../types/AgoraMediaBase";
import { ERROR_CODE_TYPE } from "../../types/AgoraBase";

export class MediaRecordWeb implements IMediaRecorder {
    async setMediaRecorderObserver(callback: IMediaRecorderObserver): Promise<number> {
        console.warn("setMediaRecorderObserver not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async startRecording(config: MediaRecorderConfiguration): Promise<number> {
        console.warn("startRecording not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async stopRecording(): Promise<number> {
        console.warn("stopRecording not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }
}

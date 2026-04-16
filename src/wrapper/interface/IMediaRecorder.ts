import type { MediaRecorderConfiguration } from "../types/AgoraMediaBase";
import { IMediaRecorderObserver } from "./IMediaRecorderObserver";

export interface IMediaRecorder {
    setMediaRecorderObserver(callback: IMediaRecorderObserver): Promise<number>;

    startRecording(config: MediaRecorderConfiguration): Promise<number>;

    stopRecording(): Promise<number>;
}

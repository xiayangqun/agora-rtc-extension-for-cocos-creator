import type { MediaRecorderConfiguration } from "../types/AgoraMediaBase";
import { IMediaRecorderObserver } from "./IMediaRecorderObserver";

export interface IMediaRecorder {
    setMediaRecorderObserver(callback: IMediaRecorderObserver): number;

    startRecording(config: MediaRecorderConfiguration): number;

    stopRecording(): number;
}

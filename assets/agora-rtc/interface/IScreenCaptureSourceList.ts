import { SIZE, ScreenCaptureSourceInfo } from "../types/AgoraRtcEngine";

export interface IScreenCaptureSourceList {
    getCount(): Promise<number>;

    getSourceInfo(index: number): Promise<ScreenCaptureSourceInfo>;
}

import { SIZE, ScreenCaptureSourceInfo } from "../types/AgoraRtcEngine";

export interface IScreenCaptureSourceList {
    getCount(): number;

    getSourceInfo(index: number): ScreenCaptureSourceInfo;
}

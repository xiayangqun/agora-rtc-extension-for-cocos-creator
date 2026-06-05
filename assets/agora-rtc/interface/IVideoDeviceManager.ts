import type { DeviceInfo, VideoFormat } from "../types/AgoraBase";
import { IVideoDeviceCollection } from "./IVideoDeviceCollection";

export interface IVideoDeviceManager {
    enumerateVideoDevices(): Promise<IVideoDeviceCollection>;

    setDevice(deviceIdUTF8: string): Promise<number>;

    getDevice(): Promise<{ deviceIdUTF8: string; errorCode: number }>;

    numberOfCapabilities(deviceIdUTF8: string): Promise<number>;

    getCapability(
        deviceIdUTF8: string,
        deviceCapabilityNumber: number,
    ): Promise<{ capability: VideoFormat; errorCode: number }>;

    startDeviceTest(hwnd: unknown): Promise<number>;

    stopDeviceTest(): Promise<number>;
}

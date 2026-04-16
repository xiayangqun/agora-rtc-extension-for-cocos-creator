import type { DeviceInfo, VideoFormat } from "../types/AgoraBase";

export interface IVideoDeviceManager {
    enumerateVideoDevices(): Promise<DeviceInfo[]>;

    setDevice(deviceIdUTF8: string): Promise<number>;

    getDevice(deviceIdUTF8: string): Promise<number>;

    numberOfCapabilities(deviceIdUTF8: string): Promise<number>;

    getCapability(deviceIdUTF8: string, deviceCapabilityNumber: number, capability: VideoFormat): Promise<number>;

    startDeviceTest(hwnd: unknown): Promise<number>;

    stopDeviceTest(): Promise<number>;
}

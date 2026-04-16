import type { DeviceInfo, VideoFormat } from "../types/AgoraBase";

export interface IVideoDeviceManager {
    enumerateVideoDevices(): DeviceInfo[];

    setDevice(deviceIdUTF8: string): number;

    getDevice(deviceIdUTF8: string): number;

    numberOfCapabilities(deviceIdUTF8: string): number;

    getCapability(deviceIdUTF8: string, deviceCapabilityNumber: number, capability: VideoFormat): number;

    startDeviceTest(hwnd: unknown): number;

    stopDeviceTest(): number;
}

import { IVideoDeviceManager } from "../../interface/IVideoDeviceManager";
import AgoraRTC from "agora-rtc-sdk-ng";
import { DeviceInfo, ERROR_CODE_TYPE, VideoFormat } from "../../types/AgoraBase";

const ERR_NOT_SUPPORTED = ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;

export class VideoDeviceManagerWeb implements IVideoDeviceManager {
    enumerateVideoDevices(): Promise<DeviceInfo[]> {
        throw new Error("Method not implemented.");
    }
    setDevice(deviceIdUTF8: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getDevice(): Promise<{ deviceIdUTF8: string; errorCode: number }> {
        throw new Error("Method not implemented.");
    }
    numberOfCapabilities(deviceIdUTF8: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getCapability(
        deviceIdUTF8: string,
        deviceCapabilityNumber: number,
    ): Promise<{ capability: VideoFormat; errorCode: number }> {
        throw new Error("Method not implemented.");
    }
    startDeviceTest(hwnd: unknown): Promise<number> {
        throw new Error("Method not implemented.");
    }
    stopDeviceTest(): Promise<number> {
        throw new Error("Method not implemented.");
    }
}

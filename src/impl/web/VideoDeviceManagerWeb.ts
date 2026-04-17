import { IVideoDeviceManager } from "../../interface/IVideoDeviceManager";
import AgoraRTC from "agora-rtc-sdk-ng";
import { DeviceInfo, ERROR_CODE_TYPE, VideoFormat } from "../../types/AgoraBase";

const ERR_NOT_SUPPORTED = ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;

export class VideoDeviceManagerWeb implements IVideoDeviceManager {
    async enumerateVideoDevices(): Promise<DeviceInfo[]> {
        const devices = await AgoraRTC.getCameras();
        return devices.map(() => ({ isLowLatencyAudioSupported: false }) as DeviceInfo);
    }

    async setDevice(_deviceIdUTF8: string): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async getDevice(_deviceIdUTF8: string): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async numberOfCapabilities(_deviceIdUTF8: string): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async getCapability(
        _deviceIdUTF8: string,
        _deviceCapabilityNumber: number,
        _capability: VideoFormat,
    ): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async startDeviceTest(_hwnd: unknown): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async stopDeviceTest(): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }
}

import { IVideoDeviceManager } from "../../interface/IVideoDeviceManager";
import AgoraRTC from "./AgoraRTC";
import { ERROR_CODE_TYPE, VideoFormat } from "../../types/AgoraBase";
import { IVideoDeviceCollection } from "../../interface/IVideoDeviceCollection";
import { VideoDeviceCollectionWeb } from "./VideoDeviceCollectionWeb";

const ERR_NOT_SUPPORTED = ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;

export class VideoDeviceManagerWeb implements IVideoDeviceManager {
    _devices: MediaDeviceInfo[] = null;

    async init(): Promise<void> {
        this._devices = await AgoraRTC.getCameras();
    }

    async enumerateVideoDevices(): Promise<IVideoDeviceCollection> {
        return new VideoDeviceCollectionWeb(this._devices);
    }

    async setDevice(deviceIdUTF8: string): Promise<number> {
        console.warn("set Device not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getDevice(): Promise<{ deviceIdUTF8: string; errorCode: number }> {
        return { deviceIdUTF8: "", errorCode: -ERR_NOT_SUPPORTED };
    }

    async numberOfCapabilities(): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async getCapability(): Promise<{ capability: VideoFormat; errorCode: number }> {
        return { capability: { width: 0, height: 0, fps: 0 }, errorCode: -ERR_NOT_SUPPORTED };
    }

    async startDeviceTest(): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }

    async stopDeviceTest(): Promise<number> {
        return -ERR_NOT_SUPPORTED;
    }
}

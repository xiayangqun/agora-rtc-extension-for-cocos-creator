import { IAudioDeviceCollection } from "../../interface/IAudioDeviceCollection";
import { ERROR_CODE_TYPE } from "../../types/AgoraBase";

export class AudioDeviceCollectionWeb implements IAudioDeviceCollection {
    private devices: MediaDeviceInfo[];

    constructor(devices: MediaDeviceInfo[]) {
        this.devices = devices;
    }

    async getCount(): Promise<number> {
        return this.devices.length;
    }

    async getDevice(index: number): Promise<{ deviceName: string; deviceId: string; errorCode: number }> {
        if (index < 0 || index >= this.devices.length) {
            return { deviceName: "", deviceId: "", errorCode: -ERROR_CODE_TYPE.ERR_INVALID_ARGUMENT };
        }
        const device = this.devices[index];
        return {
            deviceName: device.label,
            deviceId: device.deviceId,
            errorCode: ERROR_CODE_TYPE.ERR_OK,
        };
    }

    async getDeviceType(
        index: number,
    ): Promise<{ deviceName: string; deviceTypeName: string; deviceId: string; errorCode: number }> {
        if (index < 0 || index >= this.devices.length) {
            return {
                deviceName: "",
                deviceTypeName: "",
                deviceId: "",
                errorCode: -ERROR_CODE_TYPE.ERR_INVALID_ARGUMENT,
            };
        }
        const device = this.devices[index];
        return {
            deviceName: device.label,
            deviceTypeName: "",
            deviceId: device.deviceId,
            errorCode: ERROR_CODE_TYPE.ERR_OK,
        };
    }

    async setDevice(): Promise<number> {
        console.warn("setDevice not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async getDefaultDevice(): Promise<{ deviceName: string; deviceId: string; errorCode: number }> {
        console.warn("getDefaultDevice not support in web");
        return { deviceName: "", deviceId: "", errorCode: -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED };
    }

    async getDefaultDeviceType(): Promise<{
        deviceName: string;
        deviceTypeName: string;
        deviceId: string;
        errorCode: number;
    }> {
        console.warn("getDefaultDeviceType not support in web");
        return { deviceName: "", deviceTypeName: "", deviceId: "", errorCode: -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED };
    }

    async setApplicationVolume(): Promise<number> {
        console.warn("setApplicationVolume not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async getApplicationVolume(): Promise<{ volume: number; errorCode: number }> {
        console.warn("getApplicationVolume not support in web");
        return { volume: 0, errorCode: -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED };
    }

    async setApplicationMute(): Promise<number> {
        console.warn("setApplicationMute not support in web");
        return -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
    }

    async isApplicationMute(): Promise<{ mute: boolean; errorCode: number }> {
        console.warn("isApplicationMute not support in web");
        return { mute: false, errorCode: -ERROR_CODE_TYPE.ERR_NOT_SUPPORTED };
    }

    async release(): Promise<void> {
        this.devices = [];
    }
}

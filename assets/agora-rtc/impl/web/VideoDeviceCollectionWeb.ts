import { IVideoDeviceCollection } from "../../interface/IVideoDeviceCollection";
import { ERROR_CODE_TYPE } from "../../types/AgoraBase";

export class VideoDeviceCollectionWeb implements IVideoDeviceCollection {
    private devices: MediaDeviceInfo[];

    constructor(devices: MediaDeviceInfo[]) {
        this.devices = devices;
    }

    async getCount(): Promise<number> {
        return Promise.resolve(this.devices.length);
    }

    async setDevice(): Promise<number> {
        return Promise.resolve(-ERROR_CODE_TYPE.ERR_NOT_SUPPORTED);
    }

    async getDevice(index: number): Promise<{ deviceNameUTF8: string; deviceIdUTF8: string; errorCode: number }> {
        if (index < 0 || index >= this.devices.length) {
            return {
                deviceNameUTF8: "",
                deviceIdUTF8: "",
                errorCode: -ERROR_CODE_TYPE.ERR_INVALID_ARGUMENT,
            };
        }
        const device = this.devices[index];
        return {
            deviceNameUTF8: device.label,
            deviceIdUTF8: device.deviceId,
            errorCode: ERROR_CODE_TYPE.ERR_OK,
        };
    }

    async release(): Promise<void> {
        this.devices = [];
        return Promise.resolve();
    }
}

import { IAudioDeviceManager } from "../../interface/IAudioDeviceManager";
import AgoraRTC from "agora-rtc-sdk-ng";
import { DeviceInfo, ERROR_CODE_TYPE } from "../../types/AgoraBase";

const ERR_NOT_SUPPORTED = ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;

export class AudioDeviceManagerWeb implements IAudioDeviceManager {
    async enumeratePlaybackDevices(): Promise<DeviceInfo[]> {
        await AgoraRTC.getPlaybackDevices();
        return [{ isLowLatencyAudioSupported: false }] as DeviceInfo[];
    }

    async enumerateRecordingDevices(): Promise<DeviceInfo[]> {
        await AgoraRTC.getMicrophones();
        return [{ isLowLatencyAudioSupported: false }] as DeviceInfo[];
    }

    async getPlaybackDefaultDevice(_deviceId: string, _deviceTypeName: string, _deviceName?: string): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async getRecordingDefaultDevice(_deviceId: string, _deviceTypeName: string, _deviceName?: string): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async setPlaybackDevice(_deviceId: string): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async getPlaybackDevice(_deviceId: string): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async getPlaybackDeviceInfo(_deviceId: string, _deviceTypeName: string, _deviceName?: string): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async setPlaybackDeviceVolume(_volume: number): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async getPlaybackDeviceVolume(_volume: number): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async setRecordingDevice(_deviceId: string): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async getRecordingDevice(_deviceId: string): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async getRecordingDeviceInfo(_deviceId: string, _deviceTypeName: string, _deviceName?: string): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async setRecordingDeviceVolume(_volume: number): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async getRecordingDeviceVolume(_volume: number): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async setLoopbackDevice(_deviceId: string): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async getLoopbackDevice(_deviceId: string): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async setPlaybackDeviceMute(_mute: boolean): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async getPlaybackDeviceMute(_mute: boolean): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async setRecordingDeviceMute(_mute: boolean): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async getRecordingDeviceMute(_mute: boolean): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async startPlaybackDeviceTest(_testAudioFilePath: string): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async stopPlaybackDeviceTest(): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async startRecordingDeviceTest(_indicationInterval: number): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async stopRecordingDeviceTest(): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async startAudioDeviceLoopbackTest(_indicationInterval: number): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async stopAudioDeviceLoopbackTest(): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async followSystemPlaybackDevice(_enable: boolean): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async followSystemRecordingDevice(_enable: boolean): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }

    async followSystemLoopbackDevice(_enable: boolean): Promise<number> {
        return ERR_NOT_SUPPORTED;
    }
}

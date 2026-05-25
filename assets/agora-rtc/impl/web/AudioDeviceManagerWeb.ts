import { IAudioDeviceManager } from "../../interface/IAudioDeviceManager";
import AgoraRTC from "./AgoraRTC";
import { ERROR_CODE_TYPE } from "../../types/AgoraBase";
import { IAudioDeviceCollection } from "../../interface/IAudioDeviceCollection";
import { AudioDeviceCollectionWeb } from "./AudioDeviceCollectionWeb";

const ERR_NOT_SUPPORTED = ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;

export class AudioDeviceManagerWeb implements IAudioDeviceManager {
    _playbackDevices: MediaDeviceInfo[] = null;
    _recordingDevices: MediaDeviceInfo[] = null;

    async init(): Promise<void> {
        this._playbackDevices = await AgoraRTC.getPlaybackDevices();
        this._recordingDevices = await AgoraRTC.getMicrophones();
    }

    async enumeratePlaybackDevices(): Promise<IAudioDeviceCollection> {
        return new AudioDeviceCollectionWeb(this._playbackDevices);
    }

    async enumerateRecordingDevices(): Promise<IAudioDeviceCollection> {
        return new AudioDeviceCollectionWeb(this._recordingDevices);
    }

    async setPlaybackDevice(deviceId: string): Promise<number> {
        console.warn("setPlaybackDevice not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getPlaybackDevice(): Promise<{ deviceId: string; errorCode: number }> {
        console.warn("getPlaybackDevice not support in web");
        return { deviceId: "", errorCode: -ERR_NOT_SUPPORTED };
    }

    async getPlaybackDeviceInfo(): Promise<{ deviceId: string; deviceName: string; errorCode: number }> {
        console.warn("getPlaybackDeviceInfo not support in web");
        return { deviceId: "", deviceName: "", errorCode: -ERR_NOT_SUPPORTED };
    }

    async getPlaybackDeviceInfoType(): Promise<{
        deviceId: string;
        deviceName: string;
        deviceTypeName: string;
        errorCode: number;
    }> {
        console.warn("getPlaybackDeviceInfoType not support in web");
        return { deviceId: "", deviceName: "", deviceTypeName: "", errorCode: -ERR_NOT_SUPPORTED };
    }

    async setPlaybackDeviceVolume(volume: number): Promise<number> {
        console.warn("setPlaybackDeviceVolume not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getPlaybackDeviceVolume(volume: number): Promise<{ volume: number; errorCode: number }> {
        console.warn("getPlaybackDeviceVolume not support in web");
        return { volume: 0, errorCode: -ERR_NOT_SUPPORTED };
    }

    async setRecordingDevice(deviceId: string): Promise<number> {
        console.warn("setRecordingDevice not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getRecordingDevice(): Promise<{ deviceId: string; errorCode: number }> {
        console.warn("getRecordingDevice not support in web");
        return { deviceId: "", errorCode: -ERR_NOT_SUPPORTED };
    }

    async getRecordingDeviceInfo(): Promise<{ deviceId: string; deviceName: string; errorCode: number }> {
        console.warn("getRecordingDeviceInfo not support in web");
        return { deviceId: "", deviceName: "", errorCode: -ERR_NOT_SUPPORTED };
    }

    async getRecordingDeviceInfoType(): Promise<{
        deviceId: string;
        deviceName: string;
        deviceTypeName: string;
        errorCode: number;
    }> {
        console.warn("getRecordingDeviceInfoType not support in web");
        return { deviceId: "", deviceName: "", deviceTypeName: "", errorCode: -ERR_NOT_SUPPORTED };
    }

    async setRecordingDeviceVolume(volume: number): Promise<number> {
        console.warn("setRecordingDeviceVolume not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getRecordingDeviceVolume(): Promise<{ volume: number; errorCode: number }> {
        console.warn("getRecordingDeviceVolume not support in web");
        return { volume: 0, errorCode: -ERR_NOT_SUPPORTED };
    }

    async setLoopbackDevice(deviceId: string): Promise<number> {
        console.warn("setLoopbackDevice not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getLoopbackDevice(): Promise<{ deviceId: string; errorCode: number }> {
        console.warn("getLoopbackDevice not support in web");
        return { deviceId: "", errorCode: -ERR_NOT_SUPPORTED };
    }

    async setPlaybackDeviceMute(mute: boolean): Promise<number> {
        console.warn("setPlaybackDeviceMute not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getPlaybackDeviceMute(): Promise<{ mute: boolean; errorCode: number }> {
        console.warn("getPlaybackDeviceMute not support in web");
        return { mute: false, errorCode: -ERR_NOT_SUPPORTED };
    }

    async setRecordingDeviceMute(mute: boolean): Promise<number> {
        console.warn("setRecordingDeviceMute not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async getRecordingDeviceMute(): Promise<{ mute: boolean; errorCode: number }> {
        console.warn("getRecordingDeviceMute not support in web");
        return { mute: false, errorCode: -ERR_NOT_SUPPORTED };
    }

    async startPlaybackDeviceTest(testAudioFilePath: string): Promise<number> {
        console.warn("startPlaybackDeviceTest not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async stopPlaybackDeviceTest(): Promise<number> {
        console.warn("stopPlaybackDeviceTest not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async startRecordingDeviceTest(indicationInterval: number): Promise<number> {
        console.warn("startRecordingDeviceTest not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async stopRecordingDeviceTest(): Promise<number> {
        console.warn("stopRecordingDeviceTest not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async startAudioDeviceLoopbackTest(indicationInterval: number): Promise<number> {
        console.warn("startAudioDeviceLoopbackTest not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async stopAudioDeviceLoopbackTest(): Promise<number> {
        console.warn("stopAudioDeviceLoopbackTest not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async followSystemPlaybackDevice(enable: boolean): Promise<number> {
        console.warn("followSystemPlaybackDevice not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async followSystemRecordingDevice(enable: boolean): Promise<number> {
        console.warn("followSystemRecordingDevice not support in web");
        return -ERR_NOT_SUPPORTED;
    }

    async followSystemLoopbackDevice(enable: boolean): Promise<number> {
        console.warn("followSystemLoopbackDevice not support in web");
        return -ERR_NOT_SUPPORTED;
    }
}

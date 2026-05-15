import { DeviceInfo } from "../types/AgoraBase";
import { IAudioDeviceCollection } from "./IAudioDeviceCollection";

export interface IAudioDeviceManager {
    enumeratePlaybackDevices(): Promise<IAudioDeviceCollection>;

    enumerateRecordingDevices(): Promise<IAudioDeviceCollection>;

    setPlaybackDevice(deviceId: string): Promise<number>;

    getPlaybackDevice(): Promise<{ deviceId: string; errorCode: number }>;

    getPlaybackDeviceInfo(): Promise<{ deviceId: string; deviceName: string; errorCode: number }>;

    getPlaybackDeviceInfoType(): Promise<{
        deviceId: string;
        deviceName: string;
        deviceTypeName: string;
        errorCode: number;
    }>;

    setPlaybackDeviceVolume(volume: number): Promise<number>;

    getPlaybackDeviceVolume(volume: number): Promise<{ volume: number; errorCode: number }>;

    setRecordingDevice(deviceId: string): Promise<number>;

    getRecordingDevice(): Promise<{ deviceId: string; errorCode: number }>;

    getRecordingDeviceInfo(): Promise<{ deviceId: string; deviceName: string; errorCode: number }>;

    getRecordingDeviceInfoType(): Promise<{
        deviceId: string;
        deviceName: string;
        deviceTypeName: string;
        errorCode: number;
    }>;

    setRecordingDeviceVolume(volume: number): Promise<number>;

    getRecordingDeviceVolume(): Promise<{ volume: number; errorCode: number }>;

    setLoopbackDevice(deviceId: string): Promise<number>;

    getLoopbackDevice(): Promise<{ deviceId: string; errorCode: number }>;

    setPlaybackDeviceMute(mute: boolean): Promise<number>;

    getPlaybackDeviceMute(): Promise<{ mute: boolean; errorCode: number }>;

    setRecordingDeviceMute(mute: boolean): Promise<number>;

    getRecordingDeviceMute(): Promise<{ mute: boolean; errorCode: number }>;

    startPlaybackDeviceTest(testAudioFilePath: string): Promise<number>;

    stopPlaybackDeviceTest(): Promise<number>;

    startRecordingDeviceTest(indicationInterval: number): Promise<number>;

    stopRecordingDeviceTest(): Promise<number>;

    startAudioDeviceLoopbackTest(indicationInterval: number): Promise<number>;

    stopAudioDeviceLoopbackTest(): Promise<number>;

    followSystemPlaybackDevice(enable: boolean): Promise<number>;

    followSystemRecordingDevice(enable: boolean): Promise<number>;

    followSystemLoopbackDevice(enable: boolean): Promise<number>;
}

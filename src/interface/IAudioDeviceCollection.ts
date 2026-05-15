export interface IAudioDeviceCollection {
    getCount(): Promise<number>;

    getDevice(index: number): Promise<{
        deviceName: string;
        deviceId: string;
        errorCode: number;
    }>;

    getDeviceType(index: number): Promise<{
        deviceName: string;
        deviceTypeName: string;
        deviceId: string;
        errorCode: number;
    }>;

    setDevice(deviceId: string): Promise<number>;

    getDefaultDevice(): Promise<{ deviceName: string; deviceId: string; errorCode: number }>;

    getDefaultDeviceType(): Promise<{
        deviceName: string;
        deviceTypeName: string;
        deviceId: string;
        errorCode: number;
    }>;

    setApplicationVolume(volume: number): Promise<number>;

    getApplicationVolume(): Promise<{ volume: number; errorCode: number }>;

    setApplicationMute(mute: boolean): Promise<number>;

    isApplicationMute(): Promise<{ mute: boolean; errorCode: number }>;

    release(): Promise<void>;
}

export interface IAudioDeviceCollection {
    getCount(): Promise<number>;

    getDeviceType(index: number): Promise<{
        deviceName: string;
        deviceTypeName?: string;
        deviceId: string;
        errorCode: number;
    }>;

    setDevice(deviceId: string): Promise<number>;

    getDefaultDeviceType(): Promise<{
        deviceName: string;
        deviceTypeName?: string;
        deviceId: string;
        errorCode: number;
    }>;

    setApplicationVolume(volume: number): Promise<number>;

    getApplicationVolume(): Promise<{ volume: number; errorCode: number }>;

    setApplicationMute(mute: boolean): Promise<number>;

    isApplicationMute(): Promise<{ mute: boolean; errorCode: number }>;
}

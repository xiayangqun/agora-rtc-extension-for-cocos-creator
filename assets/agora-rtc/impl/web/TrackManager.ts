import AgoraRTC, {
    ICameraVideoTrack,
    ILocalVideoTrack,
    ILocalAudioTrack,
    IMicrophoneAudioTrack,
    VideoEncoderConfiguration as WebVideoEncoderConfiguration,
} from "./AgoraRTC";
import { ERROR_CODE_TYPE } from "../../types/AgoraBase";

/**
 * TrackManager 管理全局的本地音视频轨道
 * 这些轨道是全局存在的，可以被多个 AgoraRTCClientProxy 发布
 */
export class TrackManager {
    // Camera tracks
    localFirstCameraTrack: ICameraVideoTrack = null;
    localSecondCameraTrack: ICameraVideoTrack = null;
    localThirdCameraTrack: ICameraVideoTrack = null;
    localFourthCameraTrack: ICameraVideoTrack = null;

    // Microphone track
    localMicrophoneTrack: IMicrophoneAudioTrack = null;

    // Screen tracks (video, audio)
    localFirstScreenVideoTrack: ILocalVideoTrack = null;
    localFirstScreenAudioTrack: ILocalAudioTrack = null;
    localSecondScreenVideoTrack: ILocalVideoTrack = null;
    localSecondScreenAudioTrack: ILocalAudioTrack = null;
    localThirdScreenVideoTrack: ILocalVideoTrack = null;
    localThirdScreenAudioTrack: ILocalAudioTrack = null;
    localFourthScreenVideoTrack: ILocalVideoTrack = null;
    localFourthScreenAudioTrack: ILocalAudioTrack = null;

    // Custom audio tracks (multiple)
    localCustomAudioTracks: Map<number, ILocalAudioTrack> = new Map();

    // Custom video track (only one)
    localCustomVideoTrack: ILocalVideoTrack = null;

    // MediaPlayer tracks (keyed by mediaPlayerId)
    private _mediaPlayerAudioTracks: Map<number, ILocalAudioTrack> = new Map();
    private _mediaPlayerVideoTracks: Map<number, ILocalVideoTrack> = new Map();

    // Callback invoked when a MediaPlayer track is created or replaced, so the
    // engine can publish tracks that were requested before open() reached canplay.
    onMediaPlayerTrackUpdated?: (playerId: number) => void;

    // Mute recording signal
    private _isMuteRecordingSignal: boolean = false;
    /**
     * 关闭并清理所有本地轨道
     */
    clearAll(): void {
        this.localFirstCameraTrack?.close();
        this.localSecondCameraTrack?.close();
        this.localThirdCameraTrack?.close();
        this.localFourthCameraTrack?.close();
        this.localMicrophoneTrack?.close();
        this.localFirstScreenVideoTrack?.close();
        this.localFirstScreenAudioTrack?.close();
        this.localSecondScreenVideoTrack?.close();
        this.localSecondScreenAudioTrack?.close();
        this.localThirdScreenVideoTrack?.close();
        this.localThirdScreenAudioTrack?.close();
        this.localFourthScreenVideoTrack?.close();
        this.localFourthScreenAudioTrack?.close();
        this.localCustomAudioTracks.forEach((track) => track.close());
        this.localCustomVideoTrack?.close();
        this._mediaPlayerAudioTracks.forEach((track) => track.close());
        this._mediaPlayerVideoTracks.forEach((track) => track.close());

        this.localFirstCameraTrack = null;
        this.localSecondCameraTrack = null;
        this.localThirdCameraTrack = null;
        this.localFourthCameraTrack = null;
        this.localMicrophoneTrack = null;
        this.localFirstScreenVideoTrack = null;
        this.localFirstScreenAudioTrack = null;
        this.localSecondScreenVideoTrack = null;
        this.localSecondScreenAudioTrack = null;
        this.localThirdScreenVideoTrack = null;
        this.localThirdScreenAudioTrack = null;
        this.localFourthScreenVideoTrack = null;
        this.localFourthScreenAudioTrack = null;
        this.localCustomAudioTracks.clear();
        this.localCustomVideoTrack = null;
        this._mediaPlayerAudioTracks.clear();
        this._mediaPlayerVideoTracks.clear();
    }

    async setEncoderConfiguration(encoderConfig: WebVideoEncoderConfiguration): Promise<void> {
        this.localFirstCameraTrack?.setEncoderConfiguration(encoderConfig);
        this.localSecondCameraTrack?.setEncoderConfiguration(encoderConfig);
        this.localThirdCameraTrack?.setEncoderConfiguration(encoderConfig);
        this.localFourthCameraTrack?.setEncoderConfiguration(encoderConfig);
    }

    async createLocalFirstCameraVideoTrack(encoderConfig?: WebVideoEncoderConfiguration): Promise<number> {
        if (this.localFirstCameraTrack) {
            return ERROR_CODE_TYPE.ERR_OK;
        }
        const devices = await AgoraRTC.getCameras();
        if (devices.length < 1) {
            console.warn("createLocalFirstCameraVideoTrack failed, no camera device found");
            return -ERROR_CODE_TYPE.ERR_INVALID_ARGUMENT;
        }
        this.localFirstCameraTrack = await AgoraRTC.createCameraVideoTrack({
            encoderConfig: encoderConfig,
            cameraId: devices[0].deviceId,
        });
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async createLocalSecondCameraVideoTrack(encoderConfig?: WebVideoEncoderConfiguration): Promise<number> {
        if (this.localSecondCameraTrack) {
            return ERROR_CODE_TYPE.ERR_OK;
        }
        const devices = await AgoraRTC.getCameras();
        if (devices.length < 2) {
            console.warn("createLocalSecondCameraVideoTrack failed, no second camera device found");
            return -ERROR_CODE_TYPE.ERR_INVALID_ARGUMENT;
        }
        this.localSecondCameraTrack = await AgoraRTC.createCameraVideoTrack({
            encoderConfig: encoderConfig,
            cameraId: devices[1].deviceId,
        });
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async createLocalThirdCameraVideoTrack(encoderConfig?: WebVideoEncoderConfiguration): Promise<number> {
        if (this.localThirdCameraTrack) {
            return ERROR_CODE_TYPE.ERR_OK;
        }
        const devices = await AgoraRTC.getCameras();
        if (devices.length < 3) {
            console.warn("createLocalThirdCameraVideoTrack failed, no third camera device found");
            return -ERROR_CODE_TYPE.ERR_INVALID_ARGUMENT;
        }
        this.localThirdCameraTrack = await AgoraRTC.createCameraVideoTrack({
            encoderConfig: encoderConfig,
            cameraId: devices[2].deviceId,
        });
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async createLocalFourthCameraVideoTrack(encoderConfig?: WebVideoEncoderConfiguration): Promise<number> {
        if (this.localFourthCameraTrack) {
            return ERROR_CODE_TYPE.ERR_OK;
        }
        const devices = await AgoraRTC.getCameras();
        if (devices.length < 4) {
            console.warn("createLocalFourthCameraVideoTrack failed, no fourth camera device found");
            return -ERROR_CODE_TYPE.ERR_INVALID_ARGUMENT;
        }
        this.localFourthCameraTrack = await AgoraRTC.createCameraVideoTrack({
            encoderConfig: encoderConfig,
            cameraId: devices[3].deviceId,
        });
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async closeLocalFirstCameraVideoTrack(): Promise<number> {
        this.localFirstCameraTrack?.close();
        this.localFirstCameraTrack = null;
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async closeLocalSecondCameraVideoTrack(): Promise<number> {
        this.localSecondCameraTrack?.close();
        this.localSecondCameraTrack = null;
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async closeLocalThirdCameraVideoTrack(): Promise<number> {
        this.localThirdCameraTrack?.close();
        this.localThirdCameraTrack = null;
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async closeLocalFourthCameraVideoTrack(): Promise<number> {
        this.localFourthCameraTrack?.close();
        this.localFourthCameraTrack = null;
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async createLocalFirstScreenTrack(
        encoderConfig?: WebVideoEncoderConfiguration,
        withAudio: boolean = false,
    ): Promise<number> {
        if (this.localFirstScreenVideoTrack) {
            return ERROR_CODE_TYPE.ERR_OK;
        }

        if (withAudio) {
            const tracks = await AgoraRTC.createScreenVideoTrack(
                {
                    encoderConfig: encoderConfig,
                },
                "enable",
            );
            this.localFirstScreenVideoTrack = tracks[0];
            this.localFirstScreenAudioTrack = tracks[1];
        } else {
            this.localFirstScreenVideoTrack = await AgoraRTC.createScreenVideoTrack(
                {
                    encoderConfig: encoderConfig,
                },
                "disable",
            );
        }

        return ERROR_CODE_TYPE.ERR_OK;
    }

    async createLocalSecondScreenTrack(
        encoderConfig?: WebVideoEncoderConfiguration,
        withAudio: boolean = false,
    ): Promise<number> {
        if (this.localSecondScreenVideoTrack) {
            return ERROR_CODE_TYPE.ERR_OK;
        }

        if (withAudio) {
            const tracks = await AgoraRTC.createScreenVideoTrack(
                {
                    encoderConfig: encoderConfig,
                },
                "enable",
            );
            this.localSecondScreenVideoTrack = tracks[0];
            this.localSecondScreenAudioTrack = tracks[1];
        } else {
            this.localSecondScreenVideoTrack = await AgoraRTC.createScreenVideoTrack(
                {
                    encoderConfig: encoderConfig,
                },
                "disable",
            );
        }
    }

    async createLocalThirdScreenTrack(
        encoderConfig?: WebVideoEncoderConfiguration,
        withAudio: boolean = false,
    ): Promise<number> {
        if (this.localThirdScreenVideoTrack) {
            return ERROR_CODE_TYPE.ERR_OK;
        }
        if (withAudio) {
            const tracks = await AgoraRTC.createScreenVideoTrack(
                {
                    encoderConfig: encoderConfig,
                },
                "enable",
            );
            this.localThirdScreenVideoTrack = tracks[0];
            this.localThirdScreenAudioTrack = tracks[1];
        } else {
            this.localThirdScreenVideoTrack = await AgoraRTC.createScreenVideoTrack(
                {
                    encoderConfig: encoderConfig,
                },
                "disable",
            );
        }
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async createLocalFourthScreenTrack(
        encoderConfig?: WebVideoEncoderConfiguration,
        withAudio: boolean = false,
    ): Promise<number> {
        if (this.localFourthScreenVideoTrack) {
            return ERROR_CODE_TYPE.ERR_OK;
        }
        if (withAudio) {
            const tracks = await AgoraRTC.createScreenVideoTrack(
                {
                    encoderConfig: encoderConfig,
                },
                "enable",
            );
            this.localFourthScreenVideoTrack = tracks[0];
            this.localFourthScreenAudioTrack = tracks[1];
        } else {
            this.localFourthScreenVideoTrack = await AgoraRTC.createScreenVideoTrack(
                {
                    encoderConfig: encoderConfig,
                },
                "disable",
            );
        }
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async closeLocalFirstScreenTrack() {
        this.localFirstScreenVideoTrack?.close();
        this.localFirstScreenAudioTrack?.close();
        this.localFirstScreenVideoTrack = null;
        this.localFirstScreenAudioTrack = null;
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async closeLocalSecondScreenTrack() {
        this.localSecondScreenVideoTrack?.close();
        this.localSecondScreenAudioTrack?.close();
        this.localSecondScreenVideoTrack = null;
        this.localSecondScreenAudioTrack = null;
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async closeLocalThirdScreenTrack() {
        this.localThirdScreenVideoTrack?.close();
        this.localThirdScreenAudioTrack?.close();
        this.localThirdScreenVideoTrack = null;
        this.localThirdScreenAudioTrack = null;
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async closeLocalFourthScreenTrack() {
        this.localFourthScreenVideoTrack?.close();
        this.localFourthScreenAudioTrack?.close();
        this.localFourthScreenVideoTrack = null;
        this.localFourthScreenAudioTrack = null;
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async createLocalMicrophoneAudioTrack(): Promise<number> {
        if (this.localMicrophoneTrack) {
            return ERROR_CODE_TYPE.ERR_OK;
        }
        this.localMicrophoneTrack = await AgoraRTC.createMicrophoneAudioTrack();
        this.localMicrophoneTrack.setEnabled(!this._isMuteRecordingSignal);
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async closeLocalMicrophoneAudioTrack(): Promise<number> {
        this.localMicrophoneTrack?.close();
        this.localMicrophoneTrack = null;
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async enableMicrophoneRecording(enabled: boolean): Promise<number> {
        if (enabled) {
            if (!this.localMicrophoneTrack) {
                await this.createLocalMicrophoneAudioTrack();
            }
            await this.localMicrophoneTrack.setEnabled(true);
        } else {
            if (this.localMicrophoneTrack) {
                await this.localMicrophoneTrack.setEnabled(false);
            }
        }
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async enableVideo(): Promise<void> {
        await this.localFirstCameraTrack?.setEnabled(true);
        await this.localSecondCameraTrack?.setEnabled(true);
        await this.localThirdCameraTrack?.setEnabled(true);
        await this.localFourthCameraTrack?.setEnabled(true);
        await this.localFirstScreenVideoTrack?.setEnabled(true);
        await this.localSecondScreenVideoTrack?.setEnabled(true);
        await this.localThirdScreenVideoTrack?.setEnabled(true);
        await this.localFourthScreenVideoTrack?.setEnabled(true);
        await this.localCustomVideoTrack?.setEnabled(true);
    }

    async disableVideo(): Promise<void> {
        await this.localFirstCameraTrack?.setEnabled(false);
        await this.localSecondCameraTrack?.setEnabled(false);
        await this.localThirdCameraTrack?.setEnabled(false);
        await this.localFourthCameraTrack?.setEnabled(false);
        await this.localFirstScreenVideoTrack?.setEnabled(false);
        await this.localSecondScreenVideoTrack?.setEnabled(false);
        await this.localThirdScreenVideoTrack?.setEnabled(false);
        await this.localFourthScreenVideoTrack?.setEnabled(false);
        await this.localCustomVideoTrack?.setEnabled(false);
    }

    async enableAudio(): Promise<void> {
        await this.localMicrophoneTrack?.setEnabled(true);
        await this.localFirstScreenAudioTrack?.setEnabled(true);
        await this.localSecondScreenAudioTrack?.setEnabled(true);
        await this.localThirdScreenAudioTrack?.setEnabled(true);
        await this.localFourthScreenAudioTrack?.setEnabled(true);
        for (const track of this.localCustomAudioTracks.values()) {
            await track.setEnabled(true);
        }
    }

    async disableAudio(): Promise<void> {
        await this.localMicrophoneTrack?.setEnabled(false);
        await this.localFirstScreenAudioTrack?.setEnabled(false);
        await this.localSecondScreenAudioTrack?.setEnabled(false);
        await this.localThirdScreenAudioTrack?.setEnabled(false);
        await this.localFourthScreenAudioTrack?.setEnabled(false);
        for (const track of this.localCustomAudioTracks.values()) {
            await track.setEnabled(false);
        }
    }

    async enableLocalAudio(enabled: boolean): Promise<number> {
        if (enabled) {
            if (!this.localMicrophoneTrack) {
                await this.createLocalMicrophoneAudioTrack();
            }
            this.localMicrophoneTrack?.setEnabled(true);
        } else {
            this.localMicrophoneTrack?.setEnabled(false);
        }
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async enableLocalVideo(enabled: boolean): Promise<number> {
        if (enabled) {
            if (!this.localFirstCameraTrack) {
                await this.createLocalFirstCameraVideoTrack(undefined);
            }
            this.localFirstCameraTrack?.setEnabled(true);
        } else {
            this.localFirstCameraTrack?.setEnabled(false);
            this.localSecondCameraTrack?.setEnabled(false);
            this.localThirdCameraTrack?.setEnabled(false);
            this.localFourthCameraTrack?.setEnabled(false);
        }
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async MuteRecordingSignal(mute: boolean): Promise<number> {
        this._isMuteRecordingSignal = mute;
        await this.localMicrophoneTrack?.setEnabled(!mute);
        return ERROR_CODE_TYPE.ERR_OK;
    }

    // ==================== MediaPlayer Track Storage ====================
    // TrackManager only stores tracks. Publish/unpublish is handled by AgoraRTCClientProxy.

    setMediaPlayerAudioTrack(playerId: number, track: ILocalAudioTrack | null): void {
        if (track) {
            this._mediaPlayerAudioTracks.set(playerId, track);
            this.onMediaPlayerTrackUpdated?.(playerId);
        } else {
            this._mediaPlayerAudioTracks.delete(playerId);
        }
    }

    getMediaPlayerAudioTrack(playerId: number): ILocalAudioTrack | null {
        return this._mediaPlayerAudioTracks.get(playerId) || null;
    }

    setMediaPlayerVideoTrack(playerId: number, track: ILocalVideoTrack | null): void {
        if (track) {
            this._mediaPlayerVideoTracks.set(playerId, track);
            this.onMediaPlayerTrackUpdated?.(playerId);
        } else {
            this._mediaPlayerVideoTracks.delete(playerId);
        }
    }

    getMediaPlayerVideoTrack(playerId: number): ILocalVideoTrack | null {
        return this._mediaPlayerVideoTracks.get(playerId) || null;
    }

    replaceMediaPlayerAudioTrack(playerId: number, newTrack: ILocalAudioTrack): void {
        const oldTrack = this._mediaPlayerAudioTracks.get(playerId);
        oldTrack?.close();
        this._mediaPlayerAudioTracks.set(playerId, newTrack);
        this.onMediaPlayerTrackUpdated?.(playerId);
    }

    clearMediaPlayerTracks(playerId: number): void {
        this._mediaPlayerAudioTracks.get(playerId)?.close();
        this._mediaPlayerVideoTracks.get(playerId)?.close();
        this._mediaPlayerAudioTracks.delete(playerId);
        this._mediaPlayerVideoTracks.delete(playerId);
    }
}

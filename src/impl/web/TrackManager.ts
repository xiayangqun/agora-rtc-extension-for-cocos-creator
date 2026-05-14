import AgoraRTC, {
    ICameraVideoTrack,
    ILocalVideoTrack,
    ILocalAudioTrack,
    IMicrophoneAudioTrack,
    VideoEncoderConfiguration as WebVideoEncoderConfiguration,
} from "agora-rtc-sdk-ng";
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
        this.localFirstCameraTrack = await AgoraRTC.createCameraVideoTrack({
            encoderConfig: encoderConfig,
        });
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async createLocalSecondCameraVideoTrack(encoderConfig?: WebVideoEncoderConfiguration): Promise<number> {
        if (this.localSecondCameraTrack) {
            return ERROR_CODE_TYPE.ERR_OK;
        }
        this.localSecondCameraTrack = await AgoraRTC.createCameraVideoTrack({
            encoderConfig: encoderConfig,
        });
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async createLocalThirdCameraVideoTrack(encoderConfig?: WebVideoEncoderConfiguration): Promise<number> {
        if (this.localThirdCameraTrack) {
            return ERROR_CODE_TYPE.ERR_OK;
        }
        this.localThirdCameraTrack = await AgoraRTC.createCameraVideoTrack({
            encoderConfig: encoderConfig,
        });
        return ERROR_CODE_TYPE.ERR_OK;
    }

    async createLocalFourthCameraVideoTrack(encoderConfig?: WebVideoEncoderConfiguration): Promise<number> {
        if (this.localFourthCameraTrack) {
            return ERROR_CODE_TYPE.ERR_OK;
        }
        this.localFourthCameraTrack = await AgoraRTC.createCameraVideoTrack({
            encoderConfig: encoderConfig,
        });
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

    enableVideo(): void {
        this.localFirstCameraTrack?.setEnabled(true);
        this.localSecondCameraTrack?.setEnabled(true);
        this.localThirdCameraTrack?.setEnabled(true);
        this.localFourthCameraTrack?.setEnabled(true);
        this.localFirstScreenVideoTrack?.setEnabled(true);
        this.localSecondScreenVideoTrack?.setEnabled(true);
        this.localThirdScreenVideoTrack?.setEnabled(true);
        this.localFourthScreenVideoTrack?.setEnabled(true);
        this.localCustomVideoTrack?.setEnabled(true);
    }

    disableVideo(): void {
        this.localFirstCameraTrack?.setEnabled(false);
        this.localSecondCameraTrack?.setEnabled(false);
        this.localThirdCameraTrack?.setEnabled(false);
        this.localFourthCameraTrack?.setEnabled(false);
        this.localFirstScreenVideoTrack?.setEnabled(false);
        this.localSecondScreenVideoTrack?.setEnabled(false);
        this.localThirdScreenVideoTrack?.setEnabled(false);
        this.localFourthScreenVideoTrack?.setEnabled(false);
        this.localCustomVideoTrack?.setEnabled(false);
    }

    enableAudio(): void {
        this.localMicrophoneTrack?.setEnabled(true);
        this.localFirstScreenAudioTrack?.setEnabled(true);
        this.localSecondScreenAudioTrack?.setEnabled(true);
        this.localThirdScreenAudioTrack?.setEnabled(true);
        this.localFourthScreenAudioTrack?.setEnabled(true);
        this.localCustomAudioTracks.forEach((track) => track.setEnabled(true));
    }

    disableAudio(): void {
        this.localMicrophoneTrack?.setEnabled(false);
        this.localFirstScreenAudioTrack?.setEnabled(false);
        this.localSecondScreenAudioTrack?.setEnabled(false);
        this.localThirdScreenAudioTrack?.setEnabled(false);
        this.localFourthScreenAudioTrack?.setEnabled(false);
        this.localCustomAudioTracks.forEach((track) => track.setEnabled(false));
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
}

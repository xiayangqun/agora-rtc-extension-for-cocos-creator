import { Texture2D, director, Director } from "cc";
import { ILocalVideoTrack, IRemoteVideoTrack } from "agora-rtc-sdk-ng";

interface VideoTextureEntry {
    videoElement: HTMLVideoElement;
    texture: Texture2D;
    glTexture: WebGLTexture;
    lastWidth: number;
    lastHeight: number;
    onAspectRatioChanged?: (width: number, height: number) => void;
}

export class VideoTextureManager {
    private _entries: Map<string, VideoTextureEntry> = new Map();
    private _gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    private _updateCallback: () => void;

    constructor() {
        this._updateCallback = this._updateTextures.bind(this);
        director.on(Director.EVENT_BEFORE_DRAW, this._updateCallback);
    }

    private _getGL(): WebGLRenderingContext | WebGL2RenderingContext {
        if (!this._gl) {
            this._gl = (director as any).root?.device?.gl;
        }
        if (!this._gl) {
            throw new Error("WebGL context not available");
        }
        return this._gl;
    }

    private _getGLTexture(texture: Texture2D): WebGLTexture {
        const gfxTexture = (texture as any).getGFXTexture?.();
        if (!gfxTexture) {
            throw new Error("Failed to get GFX texture");
        }
        const glTexture = (gfxTexture as any).gpuTexture?.glTexture;
        if (!glTexture) {
            throw new Error("Failed to get WebGL texture");
        }
        return glTexture;
    }

    async setupLocalVideo(
        track: ILocalVideoTrack,
        texture: Texture2D,
        onAspectRatioChanged?: (width: number, height: number) => void,
    ): Promise<void> {
        const key = "local";
        this._releaseEntry(key);

        const videoElement = document.createElement("video");
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.muted = true;
        videoElement.srcObject = new MediaStream([track.getMediaStreamTrack()]);
        await videoElement.play();

        const glTexture = this._getGLTexture(texture);
        this._entries.set(key, {
            videoElement,
            texture,
            glTexture,
            lastWidth: 0,
            lastHeight: 0,
            onAspectRatioChanged,
        });
    }

    async setupRemoteVideo(
        track: IRemoteVideoTrack,
        texture: Texture2D,
        onAspectRatioChanged?: (width: number, height: number) => void,
    ): Promise<void> {
        const key = `remote_${track.getTrackId()}`;
        this._releaseEntry(key);

        const videoElement = document.createElement("video");
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.muted = true;
        videoElement.srcObject = new MediaStream([track.getMediaStreamTrack()]);
        await videoElement.play();

        const glTexture = this._getGLTexture(texture);
        this._entries.set(key, {
            videoElement,
            texture,
            glTexture,
            lastWidth: 0,
            lastHeight: 0,
            onAspectRatioChanged,
        });
    }

    removeLocalVideo(): void {
        this._releaseEntry("local");
    }

    removeRemoteVideo(trackId: string): void {
        this._releaseEntry(`remote_${trackId}`);
    }

    private _releaseEntry(key: string): void {
        const entry = this._entries.get(key);
        if (entry) {
            entry.videoElement.pause();
            entry.videoElement.srcObject = null;
            this._entries.delete(key);
        }
    }

    private _updateTextures(): void {
        const gl = this._getGL();
        this._entries.forEach((entry) => {
            const v = entry.videoElement;
            if (!(v.videoWidth > 0 && v.videoHeight > 0)) {
                return;
            }

            if (v.videoWidth !== entry.lastWidth || v.videoHeight !== entry.lastHeight) {
                entry.lastWidth = v.videoWidth;
                entry.lastHeight = v.videoHeight;
                entry.onAspectRatioChanged?.(v.videoWidth, v.videoHeight);
            }

            gl.bindTexture(gl.TEXTURE_2D, entry.glTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v);
            gl.bindTexture(gl.TEXTURE_2D, null);
        });
    }

    destroy(): void {
        director.off(Director.EVENT_BEFORE_DRAW, this._updateCallback);
        this._entries.forEach((entry, key) => {
            this._releaseEntry(key);
        });
        this._entries.clear();
    }
}

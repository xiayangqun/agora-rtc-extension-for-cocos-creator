import { Texture2D, director, Director } from "cc";
import { ILocalVideoTrack, IRemoteVideoTrack } from "agora-rtc-sdk-ng";

type VideoTrack = ILocalVideoTrack | IRemoteVideoTrack;

interface VideoTextureEntry {
    key: string;
    videoElement?: HTMLVideoElement;
    texture: Texture2D;
    getTrack: () => VideoTrack | null | undefined;
    trackId?: string;
    lastWidth: number;
    lastHeight: number;
    textureWidth: number;
    textureHeight: number;
    warnedUploadFailed: boolean;
    onAspectRatioChanged?: (width: number, height: number) => void;
}

export class VideoTextureManager {
    private _entries: Map<string, VideoTextureEntry> = new Map();
    private _updateCallback: () => void;
    private _debugContainer?: HTMLElement;
    private _debugVisible = false;

    constructor() {
        this._updateCallback = this._updateTextures.bind(this);
        director.on(Director.EVENT_BEFORE_DRAW, this._updateCallback);
    }

    setDebugVisible(visible: boolean): void {
        this._debugVisible = visible;
        this._updateDebugContainerVisible();
    }

    async setupLocalVideo(
        key: string,
        getTrack: () => ILocalVideoTrack | null | undefined,
        texture: Texture2D,
        onAspectRatioChanged?: (width: number, height: number) => void,
    ): Promise<void> {
        await this._setupVideo(key, getTrack, texture, onAspectRatioChanged);
    }

    async setupRemoteVideo(
        key: string,
        getTrack: () => IRemoteVideoTrack | null | undefined,
        texture: Texture2D,
        onAspectRatioChanged?: (width: number, height: number) => void,
    ): Promise<void> {
        await this._setupVideo(key, getTrack, texture, onAspectRatioChanged);
    }

    hasVideo(key: string): boolean {
        return this._entries.has(key);
    }

    unbind(key: string): void {
        this._releaseEntry(key);
    }

    detachTrack(key: string): void {
        const entry = this._entries.get(key);
        if (entry) {
            this._releaseVideoElement(entry);
        }
    }

    private async _setupVideo(
        key: string,
        getTrack: () => VideoTrack | null | undefined,
        texture: Texture2D,
        onAspectRatioChanged?: (width: number, height: number) => void,
    ): Promise<void> {
        this._releaseEntry(key);
        const entry: VideoTextureEntry = {
            key,
            texture,
            getTrack,
            lastWidth: 0,
            lastHeight: 0,
            textureWidth: 0,
            textureHeight: 0,
            warnedUploadFailed: false,
            onAspectRatioChanged,
        };
        this._entries.set(key, entry);
        await this._attachTrackIfNeeded(entry);
    }

    unbindLocal(): void {
        this._releaseEntry("local");
    }

    unbindRemote(trackId: string): void {
        this._releaseEntry(`remote_${trackId}`);
    }

    detachTracksByPrefix(prefix: string): void {
        this._entries.forEach((entry, key) => {
            if (key.startsWith(prefix)) {
                this._releaseVideoElement(entry);
            }
        });
    }

    private _releaseEntry(key: string): void {
        const entry = this._entries.get(key);
        if (entry) {
            this._releaseVideoElement(entry);
            this._entries.delete(key);
        }
    }

    private _releaseVideoElement(entry: VideoTextureEntry): void {
        if (!entry.videoElement) {
            return;
        }
        entry.videoElement.pause();
        entry.videoElement.srcObject = null;
        entry.videoElement.remove();
        entry.videoElement = undefined;
        entry.trackId = undefined;
        entry.lastWidth = 0;
        entry.lastHeight = 0;
    }

    private _uploadVideoFrame(entry: VideoTextureEntry, videoElement: HTMLVideoElement): boolean {
        const width = videoElement.videoWidth;
        const height = videoElement.videoHeight;

        try {
            const resized = entry.textureWidth !== width || entry.textureHeight !== height;
            if (resized) {
                this._releaseTextureDescriptorSetCache(entry.texture);
                entry.texture.reset({
                    width,
                    height,
                });
                this._configureVideoTexture(entry.texture);
                entry.textureWidth = width;
                entry.textureHeight = height;
            }

            if (!resized && this._isWebGL2()) {
                // texSubImage2D for in-place updates - efficient, reuses GPU texture
                if (!this._uploadVideoFrameWebGL2(entry, videoElement)) {
                    return false;
                }
            } else {
                // uploadData on first frame / after resize - creates GPU texture
                entry.texture.uploadData(videoElement as unknown as HTMLCanvasElement);
            }

            entry.warnedUploadFailed = false;
            return true;
        } catch (e) {
            if (!entry.warnedUploadFailed) {
                console.warn("Failed to upload video frame to Texture2D, will retry on next frame", e);
                entry.warnedUploadFailed = true;
            }
            return false;
        }
    }

    private _getTrackId(track: VideoTrack): string {
        return track.getTrackId?.() || track.getMediaStreamTrack().id;
    }

    private _isWebGL2(): boolean {
        const gl = (director.root as any)?.device?.gl;
        return typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;
    }

    private _uploadVideoFrameWebGL2(entry: VideoTextureEntry, videoElement: HTMLVideoElement): boolean {
        const device = (director.root as any)?.device;
        const gl = device?.gl as WebGL2RenderingContext | undefined;
        const gfxTexture = entry.texture.getGFXTexture?.() as any;
        const gpuTexture = gfxTexture?.gpuTexture;
        const glTexture = gpuTexture?.glTexture;
        if (!gl || !gpuTexture || !glTexture || gpuTexture.glTarget !== gl.TEXTURE_2D) {
            return false;
        }

        const stateCache = device.stateCache;
        const glTexUnit = stateCache?.glTexUnits?.[stateCache.texUnit ?? 0];
        if (glTexUnit?.glTexture !== glTexture) {
            gl.bindTexture(gpuTexture.glTarget, glTexture);
            if (glTexUnit) {
                glTexUnit.glTexture = glTexture;
            }
        }
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gpuTexture.glFormat, gpuTexture.glType, videoElement);
        return true;
    }

    private async _attachTrackIfNeeded(entry: VideoTextureEntry): Promise<void> {
        const track = entry.getTrack();
        if (!track) {
            this._releaseVideoElement(entry);
            return;
        }

        const trackId = this._getTrackId(track);
        if (entry.videoElement && entry.trackId === trackId) {
            return;
        }

        this._releaseVideoElement(entry);
        const videoElement = document.createElement("video");
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.muted = true;
        videoElement.controls = true;
        videoElement.dataset.rtcVideoKey = entry.key;
        videoElement.dataset.rtcTrackId = trackId;
        videoElement.title = `${entry.key}: ${trackId}`;
        this._styleDebugVideoElement(videoElement);
        videoElement.srcObject = new MediaStream([track.getMediaStreamTrack()]);
        this._ensureDebugContainer().appendChild(videoElement);
        entry.videoElement = videoElement;
        entry.trackId = trackId;
        this._configureVideoTexture(entry.texture);
        await videoElement.play();
    }

    private _configureVideoTexture(texture: Texture2D): void {
        texture.setFilters(Texture2D.Filter.LINEAR, Texture2D.Filter.LINEAR);
        texture.setMipFilter(Texture2D.Filter.NONE);
        texture.setWrapMode(Texture2D.WrapMode.CLAMP_TO_EDGE, Texture2D.WrapMode.CLAMP_TO_EDGE);
    }

    private _releaseTextureDescriptorSetCache(texture: Texture2D): void {
        const batcher2D = director.root.batcher2D;
        (batcher2D as any)?._releaseDescriptorSetCache?.(texture.getHash());
    }

    private _ensureDebugContainer(): HTMLElement {
        const existing = document.getElementById("rtcvideo");
        if (existing) {
            this._debugContainer = existing;
            this._styleDebugContainer(existing);
            this._updateDebugContainerVisible();
            return existing;
        }

        const container = document.createElement("rtcvideo");
        container.id = "rtcvideo";
        this._styleDebugContainer(container);
        document.body.appendChild(container);
        this._debugContainer = container;
        this._updateDebugContainerVisible();
        return container;
    }

    private _styleDebugContainer(container: HTMLElement): void {
        container.style.position = "fixed";
        container.style.left = "0";
        container.style.right = "0";
        container.style.bottom = "0";
        container.style.zIndex = "2147483647";
        container.style.maxHeight = "30vh";
        container.style.padding = "8px";
        container.style.boxSizing = "border-box";
        container.style.background = "rgba(0, 0, 0, 0.72)";
        container.style.overflow = "auto";
        container.style.gap = "8px";
        container.style.flexWrap = "wrap";
        container.style.alignItems = "center";
        container.style.pointerEvents = "auto";
    }

    private _styleDebugVideoElement(videoElement: HTMLVideoElement): void {
        videoElement.style.width = "160px";
        videoElement.style.height = "90px";
        videoElement.style.objectFit = "contain";
        videoElement.style.background = "#000";
        videoElement.style.border = "1px solid rgba(255, 255, 255, 0.35)";
    }

    private _updateDebugContainerVisible(): void {
        const container = this._debugContainer ?? document.getElementById("rtcvideo");
        if (!container) {
            return;
        }
        this._debugContainer = container;
        container.style.display = this._debugVisible ? "flex" : "none";
    }

    private _updateTextures(): void {
        this._entries.forEach((entry) => {
            this._attachTrackIfNeeded(entry).catch((e) => {
                console.warn("attach video track failed", e);
            });
            if (!entry.videoElement) {
                return;
            }
            const v = entry.videoElement;
            if (!(v.videoWidth > 0 && v.videoHeight > 0)) {
                return;
            }

            if (!this._uploadVideoFrame(entry, v)) {
                return;
            }

            if (v.videoWidth !== entry.lastWidth || v.videoHeight !== entry.lastHeight) {
                entry.lastWidth = v.videoWidth;
                entry.lastHeight = v.videoHeight;
                entry.onAspectRatioChanged?.(v.videoWidth, v.videoHeight);
            }
        });
    }

    destroy(): void {
        director.off(Director.EVENT_BEFORE_DRAW, this._updateCallback);
        this._entries.forEach((entry, key) => {
            this._releaseEntry(key);
        });
        this._entries.clear();
        this._debugContainer?.remove();
        this._debugContainer = undefined;
    }
}

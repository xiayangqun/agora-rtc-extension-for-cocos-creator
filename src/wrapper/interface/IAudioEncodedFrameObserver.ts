import type { EncodedAudioFrameInfo } from '../types/AgoraBase';

 
    export abstract class IAudioEncodedFrameObserver 
    {
         onRecordAudioEncodedFrame (frameBuffer:Uint8Array, length:number, audioEncodedFrameInfo:EncodedAudioFrameInfo): void 
        {
        }
        
         onPlaybackAudioEncodedFrame (frameBuffer:Uint8Array, length:number, audioEncodedFrameInfo:EncodedAudioFrameInfo): void 
        {
        }
        
         onMixedAudioEncodedFrame (frameBuffer:Uint8Array, length:number, audioEncodedFrameInfo:EncodedAudioFrameInfo): void 
        {
        }
        
    }

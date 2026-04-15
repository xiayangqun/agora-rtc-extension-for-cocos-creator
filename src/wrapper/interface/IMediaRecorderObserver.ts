import { RecorderState, RecorderReasonCode, RecorderInfo } from "../types/AgoraMediaBase";

 
    export abstract class IMediaRecorderObserver 
    {
         onRecorderStateChanged (channelId:string, uid:number, state:RecorderState, reason:RecorderReasonCode): void 
        {
        }
        
         onRecorderInfoUpdated (channelId:string, uid:number, info:RecorderInfo): void 
        {
        }
        
    }
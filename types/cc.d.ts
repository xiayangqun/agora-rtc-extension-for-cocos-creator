/**
 * Stub declarations for Cocos Creator "cc" module
 * Used only for generating .d.ts files from assets/agora-rtc
 */

declare module "cc" {
    export class Texture2D {
        width: number;
        height: number;
    }

    export const sys: {
        isBrowser: boolean;
        isNative: boolean;
        isMobile: boolean;
        platform: string;
    };

    export const _decorator: {
        ccclass: (name?: string) => ClassDecorator;
        property: (typeOrOptions?: any) => PropertyDecorator;
    };
}

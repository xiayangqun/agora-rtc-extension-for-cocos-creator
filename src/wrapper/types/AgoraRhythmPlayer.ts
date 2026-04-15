   
    export enum RHYTHM_PLAYER_STATE_TYPE
    {
        RHYTHM_PLAYER_STATE_IDLE = 810,

        RHYTHM_PLAYER_STATE_OPENING,

        RHYTHM_PLAYER_STATE_DECODING,

        RHYTHM_PLAYER_STATE_PLAYING,

        RHYTHM_PLAYER_STATE_FAILED,

    }

    export enum RHYTHM_PLAYER_REASON
    {
        RHYTHM_PLAYER_REASON_OK = 0,

        RHYTHM_PLAYER_REASON_FAILED = 1,

        RHYTHM_PLAYER_REASON_CAN_NOT_OPEN = 801,

        RHYTHM_PLAYER_REASON_CAN_NOT_PLAY,

        RHYTHM_PLAYER_REASON_FILE_OVER_DURATION_LIMIT,

    }

    export interface AgoraRhythmPlayerConfig
    {
        beatsPerMeasure:  number ;

        beatsPerMinute:  number ;

    }

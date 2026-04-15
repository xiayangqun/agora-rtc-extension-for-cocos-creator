   
    export enum MusicPlayMode
    {
        kMusicPlayModeOriginal = 0,

        kMusicPlayModeAccompany = 1,

        kMusicPlayModeLeadSing = 2,

    }

    export enum PreloadState
    {
        kPreloadStateCompleted = 0,

        kPreloadStateFailed = 1,

        kPreloadStatePreloading = 2,

        kPreloadStateRemoved = 3,

    }

    export enum MusicContentCenterStateReason
    {
        kMusicContentCenterReasonOk = 0,

        kMusicContentCenterReasonError = 1,

        kMusicContentCenterReasonGateway = 2,

        kMusicContentCenterReasonPermissionAndResource = 3,

        kMusicContentCenterReasonInternalDataParse = 4,

        kMusicContentCenterReasonMusicLoading = 5,

        kMusicContentCenterReasonMusicDecryption = 6,

        kMusicContentCenterReasonHttpInternalError = 7,

    }

    export interface MusicChartInfo
    {
        chartName:  string ;

        id:  number ;

    }

    export enum MUSIC_CACHE_STATUS_TYPE
    {
        MUSIC_CACHE_STATUS_TYPE_CACHED = 0,

        MUSIC_CACHE_STATUS_TYPE_CACHING = 1,

    }

    export interface MusicCacheInfo
    {
        songCode:  number ;

        status:  MUSIC_CACHE_STATUS_TYPE ;

    }

    export interface MvProperty
    {
        resolution:  string ;

        bandwidth:  string ;

    }

    export interface ClimaxSegment
    {
        startTimeMs:  number ;

        endTimeMs:  number ;

    }

    export interface Music
    {
        songCode:  number ;

        name:  string ;

        singer:  string ;

        poster:  string ;

        releaseTime:  string ;

        durationS:  number ;

        type:  number ;

        pitchType:  number ;

        lyricCount:  number ;

        lyricList:  number[] ;

        climaxSegmentCount:  number ;

        climaxSegmentList:  ClimaxSegment[] ;

        mvPropertyCount:  number ;

        mvPropertyList:  MvProperty[] ;

    }

    export interface MusicCollection{
        
        count:number;

        total:number;

        page:number;

        pageSize:number;

        musics:Music[];
    }

    export interface MusicContentCenterConfiguration
    {
        appId:  string ;

        token:  string ;

        mccUid:  number ;

        maxCacheSize:  number ;

        mccDomain:  string ;

    }


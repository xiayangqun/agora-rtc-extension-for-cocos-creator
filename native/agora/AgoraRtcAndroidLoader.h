#pragma once

#if defined(__ANDROID__)
#include "IAgoraMediaPlayer.h"
#include "IAgoraRtcEngine.h"
#endif

void ensureAgoraRtcAndroidLibrariesLoaded();

#if defined(__ANDROID__)
agora::rtc::IRtcEngine *createAgoraRtcEngineLoaded();
void releaseAgoraRtcEngineLoaded(agora::rtc::RtcEngineReleaseCallback callback = nullptr);
agora::rtc::IMediaPlayerCacheManager *getMediaPlayerCacheManagerLoaded();
#endif

#pragma once
#include "IAgoraRtcEngine.h"

// Replaces the real Agora SDK factory at link time
agora::rtc::IRtcEngine* createAgoraRtcEngine();

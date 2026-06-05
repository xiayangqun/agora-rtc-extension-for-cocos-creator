#include "agora/AgoraRtcAndroidLoader.h"

#if defined(__ANDROID__)
    #include "base/Log.h"
    #include "platform/java/jni/JniHelper.h"

    #include <mutex>
    #include <sstream>
    #include <string>
#endif

namespace {

#if defined(__ANDROID__)
#ifndef AGORA_RTC_ANDROID_EXTENSION_LIBRARIES
    #define AGORA_RTC_ANDROID_EXTENSION_LIBRARIES ""
#endif

const char *kRtcEngineImplClass = "io/agora/rtc2/internal/RtcEngineImpl";
const char *kCommonUtilityClass = "io/agora/utils2/internal/CommonUtility";

std::mutex gAgoraRtcAndroidLoadMutex;
bool gAgoraRtcAndroidLibrariesLoaded = false;

bool loadAgoraRtcCoreLibraries() {
    return cc::JniHelper::callStaticBooleanMethod(kRtcEngineImplClass, "initializeNativeLibs");
}

void loadAgoraRtcExtensionLibraries() {
    std::stringstream libraries(AGORA_RTC_ANDROID_EXTENSION_LIBRARIES);
    std::string library;
    while (std::getline(libraries, library, ',')) {
        if (library.empty()) { continue; }
        const int result = cc::JniHelper::callStaticIntMethod(kCommonUtilityClass, "safeLoadLibrary", library);
        if (result != 0) {
            CC_LOG_WARNING("[AgoraRtcExtension] failed to load Android extension library %s, result=%d", library.c_str(),
                           result);
        }
    }
}
#endif

} // namespace

void ensureAgoraRtcAndroidLibrariesLoaded() {
#if defined(__ANDROID__)
    std::lock_guard<std::mutex> lock(gAgoraRtcAndroidLoadMutex);
    if (gAgoraRtcAndroidLibrariesLoaded) { return; }

    if (!loadAgoraRtcCoreLibraries()) {
        CC_LOG_ERROR("[AgoraRtcExtension] failed to load Agora Android core libraries");
        return;
    }

    loadAgoraRtcExtensionLibraries();
    gAgoraRtcAndroidLibrariesLoaded = true;
#endif
}

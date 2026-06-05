#include "agora/AgoraRtcAndroidLoader.h"

#if defined(__ANDROID__)
    #include "base/Log.h"
    #include "platform/java/jni/JniHelper.h"

    #include <dlfcn.h>
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
void *gAgoraRtcAndroidSdkHandle = nullptr;

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

void *getAgoraRtcAndroidSdkHandle() {
    ensureAgoraRtcAndroidLibrariesLoaded();
    if (gAgoraRtcAndroidSdkHandle) { return gAgoraRtcAndroidSdkHandle; }
    gAgoraRtcAndroidSdkHandle = dlopen("libagora-rtc-sdk.so", RTLD_NOW | RTLD_LOCAL);
    if (!gAgoraRtcAndroidSdkHandle) {
        CC_LOG_ERROR("[AgoraRtcExtension] failed to dlopen libagora-rtc-sdk.so: %s", dlerror());
    }
    return gAgoraRtcAndroidSdkHandle;
}

void *loadAgoraRtcAndroidSymbol(const char *symbol) {
    auto *handle = getAgoraRtcAndroidSdkHandle();
    if (!handle) { return nullptr; }
    dlerror();
    auto *address = dlsym(handle, symbol);
    const char *error = dlerror();
    if (error) {
        CC_LOG_ERROR("[AgoraRtcExtension] failed to dlsym %s: %s", symbol, error);
        return nullptr;
    }
    return address;
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

#if defined(__ANDROID__)
agora::rtc::IRtcEngine *createAgoraRtcEngineLoaded() {
    using CreateAgoraRtcEngine = agora::rtc::IRtcEngine *(*)();
    auto *func = reinterpret_cast<CreateAgoraRtcEngine>(loadAgoraRtcAndroidSymbol("createAgoraRtcEngine"));
    return func ? func() : nullptr;
}

void releaseAgoraRtcEngineLoaded(agora::rtc::RtcEngineReleaseCallback callback) {
    using ReleaseAgoraRtcEngine = void (*)(agora::rtc::RtcEngineReleaseCallback);
    // Mangled C++ ABI symbol for agora::rtc::IRtcEngine::release(void (*)()) exported by
    // Android libagora-rtc-sdk.so. Re-check with `nm -D ... | c++filt` when upgrading Agora SDK.
    auto *func = reinterpret_cast<ReleaseAgoraRtcEngine>(
        loadAgoraRtcAndroidSymbol("_ZN5agora3rtc10IRtcEngine7releaseEPFvvE"));
    if (func) { func(callback); }
}

agora::rtc::IMediaPlayerCacheManager *getMediaPlayerCacheManagerLoaded() {
    using GetMediaPlayerCacheManager = agora::rtc::IMediaPlayerCacheManager *(*)();
    auto *func = reinterpret_cast<GetMediaPlayerCacheManager>(loadAgoraRtcAndroidSymbol("getMediaPlayerCacheManager"));
    return func ? func() : nullptr;
}
#endif

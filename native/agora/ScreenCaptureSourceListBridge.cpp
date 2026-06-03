#include "agora/ScreenCaptureSourceListBridge.h"

ScreenCaptureSourceListBridge::ScreenCaptureSourceListBridge() = default;

ScreenCaptureSourceListBridge::~ScreenCaptureSourceListBridge() {
    invalidate();
}

bool ScreenCaptureSourceListBridge::hasList() const {
#if defined(_WIN32) || (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE) || (defined(__linux__) && !defined(__ANDROID__) && !defined(__OHOS__))
    return _list != nullptr;
#else
    return false;
#endif
}

#if defined(_WIN32) || (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE) || (defined(__linux__) && !defined(__ANDROID__) && !defined(__OHOS__))
void ScreenCaptureSourceListBridge::setList(agora::rtc::IScreenCaptureSourceList *list) {
    invalidate();
    _list = list;
}
#endif

unsigned int ScreenCaptureSourceListBridge::getCount() {
#if defined(_WIN32) || (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE) || (defined(__linux__) && !defined(__ANDROID__) && !defined(__OHOS__))
    if (!_list) { return 0; }
    return _list->getCount();
#else
    return 0;
#endif
}

#if defined(_WIN32) || (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE) || (defined(__linux__) && !defined(__ANDROID__) && !defined(__OHOS__))
agora::rtc::ScreenCaptureSourceInfo ScreenCaptureSourceListBridge::getSourceInfo(unsigned int index) {
    if (!_list) { return {}; }
    return _list->getSourceInfo(index);
}
#endif

void ScreenCaptureSourceListBridge::invalidate() {
#if defined(_WIN32) || (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE) || (defined(__linux__) && !defined(__ANDROID__) && !defined(__OHOS__))
    if (_list) {
        _list->release();
        _list = nullptr;
    }
#endif
}

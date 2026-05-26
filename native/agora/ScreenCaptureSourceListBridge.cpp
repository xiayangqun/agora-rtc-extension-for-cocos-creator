#include "agora/ScreenCaptureSourceListBridge.h"

ScreenCaptureSourceListBridge::ScreenCaptureSourceListBridge() = default;

ScreenCaptureSourceListBridge::~ScreenCaptureSourceListBridge() {
    invalidate();
}

bool ScreenCaptureSourceListBridge::hasList() const {
    return _list != nullptr;
}

void ScreenCaptureSourceListBridge::setList(agora::rtc::IScreenCaptureSourceList *list) {
    invalidate();
    _list = list;
}

void ScreenCaptureSourceListBridge::invalidate() {
    _list = nullptr;
}

unsigned int ScreenCaptureSourceListBridge::getCount() {
    if (!_list) { return 0; }
    return _list->getCount();
}

agora::rtc::ScreenCaptureSourceInfo ScreenCaptureSourceListBridge::getSourceInfo(unsigned int index) {
    if (!_list) { return {}; }
    return _list->getSourceInfo(index);
}

void ScreenCaptureSourceListBridge::invalidate() {
    if (_list) {
        _list->release();
        _list = nullptr;
    }
}

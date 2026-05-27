#pragma once

#include "IAgoraMusicContentCenter.h"
#include "agora/MediaPlayerBridge.h"

class MusicPlayerBridge : public MediaPlayerBridge {
    friend class MusicContentCenterBridge;

public:
    explicit MusicPlayerBridge(agora::agora_refptr<agora::rtc::IMusicPlayer> musicPlayer);

    //jsb ignore
    agora::agora_refptr<agora::rtc::IMusicPlayer> musicPlayer() const;
    //jsb ignore
    void invalidate() override;

    int openWithSongCode(int64_t songCode, int64_t startPos = 0);
    int setPlayMode(agora::rtc::MusicPlayMode mode);

private:
    agora::agora_refptr<agora::rtc::IMusicPlayer> _musicPlayer;
};

/****************************************************************************
 Integration test Game class that boots a real Cocos Creator runtime
 with Agora RTC JSB bindings registered.
 ****************************************************************************/
#pragma once

#include "cocos/application/BaseGame.h"

class Game : public cc::BaseGame {
public:
    Game();
    ~Game() override;

    int init() override;
    void onPause() override;
    void onResume() override;
    void onClose() override;
};

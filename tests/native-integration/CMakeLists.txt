cmake_minimum_required(VERSION 3.8)

set(CMAKE_OSX_DEPLOYMENT_TARGET "13.0" CACHE STRING "Minimum macOS version" FORCE)
set(CMAKE_XCODE_ATTRIBUTE_MACOSX_DEPLOYMENT_TARGET "13.0")

project(AgoraJSBIntegrationTest C CXX OBJCXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# ── Engine path ─────────────────────────────────────────────────────────────
if(NOT COCOS_ENGINE_PATH)
  file(READ "${CMAKE_CURRENT_SOURCE_DIR}/../../cocos-engine-path.txt" COCOS_ENGINE_PATH_RAW)
  string(STRIP "${COCOS_ENGINE_PATH_RAW}" COCOS_ENGINE_PATH)
endif()
set(COCOS_X_PATH "${COCOS_ENGINE_PATH}/native")

message(STATUS "COCOS_ENGINE_PATH = ${COCOS_ENGINE_PATH}")
message(STATUS "COCOS_X_PATH      = ${COCOS_X_PATH}")

# ── Build cocos_engine with V8 and scripting enabled ────────────────────────
# We need a REAL engine with scripting, not headless server mode
set(USE_SERVER_MODE OFF CACHE BOOL "Server mode" FORCE)
set(USE_SE_V8 ON CACHE BOOL "Use V8" FORCE)
set(USE_AUDIO OFF)
set(USE_VIDEO OFF)
set(USE_WEBVIEW OFF)
set(USE_EDIT_BOX OFF)
set(USE_MIDDLEWARE OFF)
set(USE_DRAGONBONES OFF)
set(USE_SPINE OFF)
set(USE_SOCKET OFF)
set(USE_PHYSICS_PHYSX OFF)
set(USE_BOX2D_JSB OFF)

include("${COCOS_X_PATH}/CMakeLists.txt")

# ── Agora RTC Extension sources ─────────────────────────────────────────────
set(AGORA_RTC_EXTENSION_ROOT ${CMAKE_CURRENT_SOURCE_DIR}/../..)

set(AGORA_RTC_SOURCES
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/ObserverBridgeBase.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/RtcEngineExBridge.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/RtcEngineEventHandlerExBridge.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/MediaPlayerBridge.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/MediaPlayerSourceObserverBridge.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/RtcNativeValueToSe.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/AudioDeviceManagerBridge.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/VideoDeviceManagerBridge.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/VideoEffectObjectBridge.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/VideoTextureManager.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/ScreenCaptureSourceListBridge.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/VideoDeviceCollectionBridge.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/AudioDeviceCollectionBridge.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/H265TranscoderBridge.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/H265TranscoderObserverBridge.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/LocalSpatialAudioEngineBridge.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/MediaEngineBridge.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/MediaPlayerCacheManagerBridge.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/MediaRecorderBridge.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/MediaRecorderObserverBridge.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/MusicContentCenterBridge.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/MusicContentCenterEventHandlerBridge.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/agora/MusicPlayerBridge.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/manual/jsb_agora_rtc_manual.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/manual/RtcNativeValueToSe.cpp
  ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/register.cpp
)

# Auto-generated bindings
if(EXISTS ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/auto/jsb_agora_rtc_engine_bridge_auto.cpp)
  list(APPEND AGORA_RTC_SOURCES
    ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/auto/jsb_agora_rtc_engine_bridge_auto.cpp
  )
endif()

# ── Mock SDK library ────────────────────────────────────────────────────────
file(GLOB MOCK_SOURCES ${CMAKE_CURRENT_SOURCE_DIR}/mock/*.cpp ${CMAKE_CURRENT_SOURCE_DIR}/src/JsonHelper.cpp)
add_library(mock STATIC ${MOCK_SOURCES})
target_include_directories(mock PUBLIC
  ${CMAKE_CURRENT_SOURCE_DIR}/mock
  ${CMAKE_CURRENT_SOURCE_DIR}/src
  ${CMAKE_CURRENT_SOURCE_DIR}/../../mac/include/rtc
  ${CMAKE_CURRENT_SOURCE_DIR}/../../mac/libs/aosl.xcframework/macos-arm64_x86_64/aosl.framework/Versions/A/Headers
)
target_link_libraries(mock PUBLIC cocos_engine)

# ── Test sources ────────────────────────────────────────────────────────────
file(GLOB TEST_SOURCES ${CMAKE_CURRENT_SOURCE_DIR}/src/*.cpp)

# ── Integration test executable ─────────────────────────────────────────────
set(APP_SOURCES
  main.mm
  Classes/Game.cpp
  Classes/Game.h
)

# Bundle the test script (compiled from TypeScript)
set(SCRIPT_FILES
  dist/main.js
)

add_executable(AgoraJSBIntegrationTest 
  ${APP_SOURCES} 
  ${AGORA_RTC_SOURCES}
  ${TEST_SOURCES}
)

target_link_libraries(AgoraJSBIntegrationTest PRIVATE
  cocos_engine
  mock
)

target_include_directories(AgoraJSBIntegrationTest PRIVATE
  ${CMAKE_CURRENT_SOURCE_DIR}/Classes
  ${CMAKE_CURRENT_SOURCE_DIR}/src
  ${CMAKE_CURRENT_SOURCE_DIR}/../../mac/include/rtc
  ${CMAKE_CURRENT_SOURCE_DIR}/../../mac/libs/aosl.xcframework/macos-arm64_x86_64/aosl.framework/Versions/A/Headers
  ${CMAKE_CURRENT_SOURCE_DIR}/../../native
  ${CMAKE_CURRENT_SOURCE_DIR}/../../native/bindings/auto
  ${CMAKE_CURRENT_SOURCE_DIR}/../../native/bindings/manual
  ${COCOS_X_PATH}
  ${COCOS_X_PATH}/cocos
  ${COCOS_X_PATH}/cocos/bindings/jswrapper
  ${COCOS_X_PATH}/external/mac/include
  ${COCOS_X_PATH}/external/mac/include/v8
)

target_compile_definitions(AgoraJSBIntegrationTest PRIVATE
  _LIBCPP_ENABLE_CXX17_REMOVED_UNARY_BINARY_FUNCTION
  CC_USE_PLUGINS=1
  V8_COMPRESS_POINTERS
  AGORA_RTC_INTEGRATION_TEST=1
)

# Compile TypeScript to JavaScript
set(TS_SOURCE_DIR ${CMAKE_CURRENT_SOURCE_DIR}/scripts/ts)
set(TS_OUTPUT_DIR ${CMAKE_CURRENT_SOURCE_DIR}/dist)
set(AGORA_RTC_TS_SOURCE_DIR ${AGORA_RTC_EXTENSION_ROOT}/assets/agora-rtc)

find_program(NPM_CMD npm)
if(NPM_CMD)
  file(GLOB AGORA_RTC_INTERFACE_TS CONFIGURE_DEPENDS
    ${AGORA_RTC_TS_SOURCE_DIR}/interface/*.ts
  )
  list(REMOVE_ITEM AGORA_RTC_INTERFACE_TS
    ${AGORA_RTC_TS_SOURCE_DIR}/interface/index.ts
  )
  file(GLOB AGORA_RTC_TYPES_TS CONFIGURE_DEPENDS
    ${AGORA_RTC_TS_SOURCE_DIR}/types/*.ts
  )

  # Compile integration tests together with assets/agora-rtc public TS sources.
  add_custom_command(
    OUTPUT ${TS_OUTPUT_DIR}/main.bundle.js
    COMMAND ${NPM_CMD} install
    COMMAND ${NPM_CMD} run build
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/scripts
    DEPENDS
      ${CMAKE_CURRENT_SOURCE_DIR}/scripts/package.json
      ${CMAKE_CURRENT_SOURCE_DIR}/scripts/tsconfig.json
      ${TS_SOURCE_DIR}/main.ts
      ${TS_SOURCE_DIR}/call-api.ts
      ${TS_SOURCE_DIR}/callback.ts
      ${TS_SOURCE_DIR}/sub-api.ts
      ${TS_SOURCE_DIR}/sub-callback.ts
      ${TS_SOURCE_DIR}/test-framework.ts
      ${AGORA_RTC_INTERFACE_TS}
      ${AGORA_RTC_TYPES_TS}
    COMMENT "Compiling TypeScript and bundling with esbuild"
  )
  add_custom_target(compile_typescript DEPENDS ${TS_OUTPUT_DIR}/main.bundle.js)
  add_dependencies(AgoraJSBIntegrationTest compile_typescript)
endif()

# Copy scripts into the app resource directory. BaseGame runs
# jsb-adapter/web-adapter.js and main.js through FileUtils search paths.
add_custom_command(TARGET AgoraJSBIntegrationTest POST_BUILD
  COMMAND ${CMAKE_COMMAND} -E remove_directory
    $<TARGET_FILE_DIR:AgoraJSBIntegrationTest>/scripts
  COMMAND ${CMAKE_COMMAND} -E make_directory
    $<TARGET_BUNDLE_DIR:AgoraJSBIntegrationTest>/Contents/Resources/jsb-adapter
  COMMAND ${CMAKE_COMMAND} -E copy_if_different 
    ${TS_OUTPUT_DIR}/main.bundle.js 
    $<TARGET_BUNDLE_DIR:AgoraJSBIntegrationTest>/Contents/Resources/main.js
  COMMAND ${CMAKE_COMMAND} -E copy_if_different
    ${COCOS_ENGINE_PATH}/bin/adapter/native/web-adapter.js
    $<TARGET_BUNDLE_DIR:AgoraJSBIntegrationTest>/Contents/Resources/jsb-adapter/web-adapter.js
)

# macOS app bundle
if(APPLE)
  set_target_properties(AgoraJSBIntegrationTest PROPERTIES
    MACOSX_BUNDLE TRUE
    MACOSX_BUNDLE_GUI_IDENTIFIER com.agora.jsbtest
    MACOSX_BUNDLE_BUNDLE_NAME "AgoraJSBTest"
  )
endif()

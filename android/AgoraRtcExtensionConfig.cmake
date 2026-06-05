set(AGORA_RTC_EXTENSION_ROOT ${CMAKE_CURRENT_LIST_DIR}/..)
set(AGORA_RTC_EXTENSION_LIBCPP_COMPAT_DEFINE _LIBCPP_ENABLE_CXX17_REMOVED_UNARY_BINARY_FUNCTION)

add_definitions(-D${AGORA_RTC_EXTENSION_LIBCPP_COMPAT_DEFINE})

if(DEFINED ENGINE_NAME AND TARGET ${ENGINE_NAME})
    target_compile_definitions(${ENGINE_NAME} PUBLIC
        ${AGORA_RTC_EXTENSION_LIBCPP_COMPAT_DEFINE}
    )
endif()

if(NOT ANDROID_ABI)
    message(FATAL_ERROR "AgoraRtcExtension Android build requires ANDROID_ABI")
endif()

set(AGORA_RTC_ANDROID_LIB_DIR ${AGORA_RTC_EXTENSION_ROOT}/android/libs/${ANDROID_ABI})

if(NOT EXISTS "${AGORA_RTC_ANDROID_LIB_DIR}")
    message(FATAL_ERROR "AgoraRtcExtension Android SDK libs not found for ABI ${ANDROID_ABI}: ${AGORA_RTC_ANDROID_LIB_DIR}")
endif()

function(agora_rtc_extension_import_android_so OUT_TARGETS)
    set(AGORA_RTC_ANDROID_IMPORTED_TARGETS)
    foreach(AGORA_RTC_ANDROID_SO ${ARGN})
        get_filename_component(AGORA_RTC_ANDROID_SO_NAME ${AGORA_RTC_ANDROID_SO} NAME_WE)
        string(REGEX REPLACE "^lib" "" AGORA_RTC_ANDROID_TARGET_SUFFIX "${AGORA_RTC_ANDROID_SO_NAME}")
        string(REGEX REPLACE "[^A-Za-z0-9_]" "_" AGORA_RTC_ANDROID_TARGET_SUFFIX "${AGORA_RTC_ANDROID_TARGET_SUFFIX}")
        set(AGORA_RTC_ANDROID_TARGET "AgoraRtcExtensionAndroid_${AGORA_RTC_ANDROID_TARGET_SUFFIX}")

        if(NOT TARGET ${AGORA_RTC_ANDROID_TARGET})
            add_library(${AGORA_RTC_ANDROID_TARGET} SHARED IMPORTED GLOBAL)
            set_target_properties(${AGORA_RTC_ANDROID_TARGET} PROPERTIES
                IMPORTED_LOCATION "${AGORA_RTC_ANDROID_SO}"
            )
        endif()

        list(APPEND AGORA_RTC_ANDROID_IMPORTED_TARGETS ${AGORA_RTC_ANDROID_TARGET})
    endforeach()

    set(${OUT_TARGETS} ${AGORA_RTC_ANDROID_IMPORTED_TARGETS} PARENT_SCOPE)
endfunction()

file(GLOB AGORA_RTC_ANDROID_SO_FILES
    ${AGORA_RTC_ANDROID_LIB_DIR}/*.so
)

set(AGORA_RTC_ANDROID_LINK_SO_FILES)
set(AGORA_RTC_ANDROID_EXTENSION_LIBRARY_NAMES)
foreach(AGORA_RTC_ANDROID_SO ${AGORA_RTC_ANDROID_SO_FILES})
    if(AGORA_RTC_ANDROID_SO MATCHES "_extension\\.so$")
        get_filename_component(AGORA_RTC_ANDROID_EXTENSION_NAME ${AGORA_RTC_ANDROID_SO} NAME_WE)
        string(REGEX REPLACE "^lib" "" AGORA_RTC_ANDROID_EXTENSION_NAME "${AGORA_RTC_ANDROID_EXTENSION_NAME}")
        list(APPEND AGORA_RTC_ANDROID_EXTENSION_LIBRARY_NAMES ${AGORA_RTC_ANDROID_EXTENSION_NAME})
    else()
        list(APPEND AGORA_RTC_ANDROID_LINK_SO_FILES ${AGORA_RTC_ANDROID_SO})
    endif()
endforeach()

agora_rtc_extension_import_android_so(
    AGORA_RTC_ANDROID_IMPORTED_LIBS
    ${AGORA_RTC_ANDROID_LINK_SO_FILES}
)

find_library(AGORA_RTC_ANDROID_LOG_LIB log)

add_library(AgoraRtcExtension STATIC
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/AgoraRtcAndroidLoader.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/ObserverBridgeBase.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/RtcEngineExBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/VideoTextureManager.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/RtcEngineEventHandlerExBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/MediaPlayerBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/MediaPlayerSourceObserverBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/RtcNativeValueToSe.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/AudioDeviceManagerBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/VideoDeviceManagerBridge.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/agora/VideoEffectObjectBridge.cpp
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
    ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/manual/RtcSeValueToNative.cpp
    ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/register.cpp
)

if(EXISTS ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/auto/jsb_agora_rtc_engine_bridge_auto.cpp)
    target_sources(AgoraRtcExtension PRIVATE
        ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/auto/jsb_agora_rtc_engine_bridge_auto.cpp
    )
endif()

target_include_directories(AgoraRtcExtension PUBLIC
    ${AGORA_RTC_EXTENSION_ROOT}/android/include/rtc
    ${AGORA_RTC_EXTENSION_ROOT}/native
    ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/auto
    ${AGORA_RTC_EXTENSION_ROOT}/native/bindings/manual
    ${COCOS_X_PATH}
    ${COCOS_X_PATH}/external/android/${ANDROID_ABI}/include
    ${COCOS_X_PATH}/external/android/${ANDROID_ABI}/include/v8
    ${COCOS_X_PATH}/cocos
    ${COCOS_X_PATH}/cocos/bindings/jswrapper
    ${COCOS_X_PATH}/cocos/renderer
)

target_compile_features(AgoraRtcExtension PUBLIC cxx_std_17)

target_compile_options(AgoraRtcExtension PUBLIC
    -Wno-missing-template-arg-list-after-template-kw
)

set(AGORA_RTC_ANDROID_COMPILE_DEFINITIONS
    ${AGORA_RTC_EXTENSION_LIBCPP_COMPAT_DEFINE}
    CC_USE_PLUGINS=1
    USE_V8_DEBUGGER=0
)
if(ANDROID_ABI STREQUAL "arm64-v8a" OR ANDROID_ABI STREQUAL "x86_64")
    list(APPEND AGORA_RTC_ANDROID_COMPILE_DEFINITIONS V8_COMPRESS_POINTERS)
endif()

target_compile_definitions(AgoraRtcExtension PUBLIC
    ${AGORA_RTC_ANDROID_COMPILE_DEFINITIONS}
)

target_link_libraries(AgoraRtcExtension PUBLIC
    ${AGORA_RTC_ANDROID_LOG_LIB}
)

list(JOIN AGORA_RTC_ANDROID_EXTENSION_LIBRARY_NAMES "," AGORA_RTC_ANDROID_EXTENSION_LIBRARY_NAMES_STRING)
target_compile_definitions(AgoraRtcExtension PRIVATE
    AGORA_RTC_ANDROID_EXTENSION_LIBRARIES="${AGORA_RTC_ANDROID_EXTENSION_LIBRARY_NAMES_STRING}"
)

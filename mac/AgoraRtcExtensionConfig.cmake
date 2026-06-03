include("${CMAKE_CURRENT_LIST_DIR}/../cmake/AgoraRtcExtensionCommon.cmake")

file(GLOB AGORA_RTC_MAC_FRAMEWORKS
    ${AGORA_RTC_EXTENSION_ROOT}/mac/libs/*.xcframework/macos-arm64_x86_64/*.framework
)

agora_rtc_extension_add_library(
    PLATFORM mac
    SDK_INCLUDE_DIR ${AGORA_RTC_EXTENSION_ROOT}/mac/include/rtc
    AOSL_HEADERS_DIR ${AGORA_RTC_EXTENSION_ROOT}/mac/libs/aosl.xcframework/macos-arm64_x86_64/aosl.framework/Headers
    FRAMEWORKS ${AGORA_RTC_MAC_FRAMEWORKS}
)

foreach(AGORA_RTC_MAC_FRAMEWORK ${AGORA_RTC_MAC_FRAMEWORKS})
    set_source_files_properties(${AGORA_RTC_MAC_FRAMEWORK} PROPERTIES
        MACOSX_PACKAGE_LOCATION Frameworks
    )
endforeach()

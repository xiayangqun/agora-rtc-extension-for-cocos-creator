#!/bin/bash
# Run the Agora JSB integration test
# Usage: ./run.sh [--lldb]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP="${SCRIPT_DIR}/build/Debug/AgoraJSBIntegrationTest.app/Contents/MacOS/AgoraJSBIntegrationTest"

if [ ! -f "$APP" ]; then
    echo "Error: App not found at $APP"
    echo "Run ./build.sh first"
    exit 1
fi

# Clear saved state to avoid macOS crash recovery dialog
rm -rf ~/Library/Saved\ Application\ State/com.agora.jsbtest.savedState 2>/dev/null
rm -f ~/Library/Application\ Support/CrashReporter/AgoraJSBIntegrationTest*.plist 2>/dev/null

if [ "$1" = "--lldb" ]; then
    echo "Running under lldb..."
    echo "Commands: 'bt' for backtrace, 'c' to continue, 'q' to quit"
    echo "---"
    lldb "$APP" -o "run"
else
    echo "Running..."
    cd "${SCRIPT_DIR}/build"
    ./Debug/AgoraJSBIntegrationTest.app/Contents/MacOS/AgoraJSBIntegrationTest
fi

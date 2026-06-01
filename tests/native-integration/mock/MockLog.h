#pragma once
#include <string>
#include <fstream>
#include <chrono>
#include <mutex>

namespace agora {
namespace rtc {
namespace mock {

// Shared logging facility for all mock objects.
// The log file path is set once via setLogPath(); all mock instances
// write to the same file via appendLog().
class MockLog {
public:
    static MockLog& instance() {
        static MockLog inst;
        return inst;
    }

    void setLogPath(const std::string& path) {
        std::lock_guard<std::mutex> lock(mu_);
        logFilePath_ = path;
    }

    void clearLog() {
        std::lock_guard<std::mutex> lock(mu_);
        if (logFilePath_.empty()) return;
        std::ofstream ofs(logFilePath_, std::ios::trunc);
    }

    std::string readLog() {
        std::lock_guard<std::mutex> lock(mu_);
        if (logFilePath_.empty()) return "[]";
        std::ifstream ifs(logFilePath_);
        if (!ifs.is_open()) return "[]";
        std::string result = "[";
        std::string line;
        bool first = true;
        while (std::getline(ifs, line)) {
            if (line.empty()) continue;
            if (!first) result += ",";
            result += line;
            first = false;
        }
        result += "]";
        return result;
    }

    void appendLog(const std::string& functionName, const std::string& paramsJson) {
        std::lock_guard<std::mutex> lock(mu_);
        if (logFilePath_.empty()) return;
        auto now = std::chrono::system_clock::now();
        auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(
            now.time_since_epoch()).count();
        std::ofstream ofs(logFilePath_, std::ios::app);
        if (!ofs.is_open()) return;
        ofs << "{\"ts\":" << ms
            << ",\"fn\":\"" << functionName
            << "\",\"params\":" << paramsJson << "}\n";
    }

private:
    MockLog() = default;
    std::string logFilePath_;
    std::mutex mu_;
};

} // namespace mock
} // namespace rtc
} // namespace agora

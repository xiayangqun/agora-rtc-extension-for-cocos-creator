#pragma once

#include <vector>
#include <cstdlib>

// ── RAII helper for const char* fields in sevalue_to_native ─────────────────
// Problem: strdup() allocates with malloc(), but stack-allocated structs go out
// of scope without freeing. This tracker collects all strdup'd pointers within
// a binding call and releases them when the guard goes out of scope.
class ScopedCString {
public:
    static char* dup(const char* s) {
        if (!s) return nullptr;
        char* copy = strdup(s);
        registry().push_back(copy);
        return copy;
    }
    static void releaseAll() {
        for (char* p : registry()) free(p);
        registry().clear();
    }
private:
    static std::vector<char*>& registry() {
        static thread_local std::vector<char*> pool;
        return pool;
    }
};

// RAII guard — place at the top of any binding function that calls
// sevalue_to_native with struct parameters containing const char* fields.
struct ScopedCStringGuard {
    ~ScopedCStringGuard() { ScopedCString::releaseAll(); }
};

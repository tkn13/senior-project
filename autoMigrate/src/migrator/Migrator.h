#ifndef MIGRATOR_H
#define MIGRATOR_H

#include <atomic>
#include <condition_variable>
#include <mutex>
#include <shared_mutex>

extern std::shared_mutex system_mutex;

int migrate();
int migrate(std::atomic<bool>& running, std::condition_variable& cv, std::mutex& mtx);

#endif
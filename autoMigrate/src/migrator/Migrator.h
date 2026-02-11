#ifndef MIGRATOR_H
#define MIGRATOR_H

#include <atomic>
#include <condition_variable>
#include <mutex>

int migrate();
int migrate(std::atomic<bool>& running, std::condition_variable& cv, std::mutex& mtx);

#endif
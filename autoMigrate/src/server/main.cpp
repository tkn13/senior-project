#include <iostream>
#include <atomic>
#include <thread>
#include <condition_variable>
#include <mutex>
#include <csignal>
#include "server.h"
#include "Migrator.h"

std::atomic<bool> running(true);
std::condition_variable cv;
std::mutex mtx;

void handle_sigint(int sig){
    
    // Send KILL message to server to unblock accept()
    stopServer();
}

int main() {


    std::signal(SIGINT, handle_sigint);
    std::signal(SIGTERM, handle_sigint);

    std::thread t([](){
        migrate(std::ref(running), std::ref(cv), std::ref(mtx));
    });

    if (startServer() == -1) {
        std::cerr << "Error starting server" << std::endl;
        running = false;
        cv.notify_all();
        if(t.joinable()) {
            t.join();
        }
        return -1;
    }

    // This part below will can be reached when server stops by receiving KILL message
    // It update the running flag and notify the migrator thread to stop
    running = false;
    cv.notify_all();
    if(t.joinable()) {
        t.join();
    }

    return 0;
}
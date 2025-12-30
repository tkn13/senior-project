#include <iostream>
#include "JobManager.h"
#include "utils/read.h"

using namespace std;

int main() {
    JobManager manager;

    std::map<int, std::string> prev = readJobMapFromFile("./data/prev");
    std::map<int, std::string> curr = readJobMapFromFile("./data/curr");
    
    JobResult res = manager.processJobs(prev, curr);

    std::cout << "Jobs to update database:";
    for (int id : res.to_update) {
        std::cout << id << " ";
    }
    std::cout << std::endl;

    writeJobToFile(res.new_prev_map);

    return 0;
}
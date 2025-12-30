#ifndef JOB_MANAGER_H
#define JOB_MANAGER_H

#include <iostream>
#include <vector>
#include <map>
#include <string>
#include <set>

// Data structure to hold the output of our processing
struct JobResult {
    std::map<int, std::string> new_prev_map;
    std::vector<int> to_update;
};

class JobManager {
public:
    JobResult processJobs(std::map<int, std::string>& prev_map, std::map<int, std::string>& curr_map);
};

#endif
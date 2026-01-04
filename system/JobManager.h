#ifndef JOB_MANAGER_H
#define JOB_MANAGER_H

#include <iostream>
#include <vector>
#include <map>
#include <string>
#include <set>
#include "model/JobModel.h"

// Data structure to hold the output of our processing
struct JobResult {
    JobMap new_prev_map;
    std::vector<int> to_update;
};

class JobManager {
public:
    JobResult processJobs(JobMap& prev_map, JobMap& curr_map);
};

#endif
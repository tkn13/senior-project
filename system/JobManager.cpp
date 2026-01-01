#include "JobManager.h"

using namespace std;

JobResult JobManager::processJobs(map<int, string> &prev_map, map<int, string> &curr_map)
{

    JobResult result;

    set<string> neg_status = {"BOOT_FAIL", "CANCELLED", "DEADLINE", "FAILED",
                              "NODE_FAIL", "OUT_OF_MEMORY", "PREEMPTED", "SUSPENDED", "TIMEOUT"};

    // 1. Filter curr_map: Remove jobs with negative status
    for (auto it = curr_map.begin(); it != curr_map.end();)
    {
        if (neg_status.find(it->second) != neg_status.end())
        {
            it = curr_map.erase(it); // Remove and get next iterator
        }
        else
        {
            ++it;
        }
    }

    // 2. Compare and Update Logic
    // We iterate through curr_map to handle "Same status" and "New jobs"
    for (const auto &[job_id, curr_status] : curr_map)
    {

        // Check if job existed in prev_map
        if (prev_map.find(job_id) == prev_map.end())
        {
            // Scenario: Curr job didn't appear in prev (New Job)
            result.to_update.push_back(job_id);
        }
        else if (prev_map[job_id] != curr_status)
        {
            // Scenario: Status has changed
            result.to_update.push_back(job_id);
        }

        // In all cases where job is in curr_map (and not negative),
        // it moves to the new_prev_map
        result.new_prev_map[job_id] = curr_status;
    }

    // 3. Handle "Leftover" jobs (Jobs in prev_map that are no longer in curr_map)
    for (const auto &[job_id, prev_status] : prev_map)
    {
        if (curr_map.find(job_id) == curr_map.end())
        {
            result.to_update.push_back(job_id);
            // Note: These aren't added to new_prev_map because they no longer exist in curr
        }
    }

    return result;
}

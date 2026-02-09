#ifndef JOBPACKER_H
#define JOBPACKER_H

#include <vector>
#include "JobDetail.h"

void rearrangeJobs(std::vector<JobDetail>& jobDetails);
bool migrateDecision(const std::vector<JobDetail>& jobDetails);
void migrator(const std::vector<JobDetail>& jobDetails);

#endif
#ifndef SLURMINTERFACE_H
#define SLURMINTERFACE_H

#include <vector>
#include "JobDetail.h"

void getJobDetails(std::vector<JobDetail>& jobDetails);

#endif
#include <iostream>
#include "JobDetail.h"
#include "SlurmInterface.h"
#include "JobPacker.h"
#include <vector>
#include <string>

int main() {
   
    std::vector<JobDetail> jobDetails;
    
    getJobDetails(jobDetails);

    rearrangeJobs(jobDetails);

    for(const auto& jobDetail : jobDetails) {
        std::cout << "Job ID: " << jobDetail.jobId 
                  << ", CPUs: " << jobDetail.cpus 
                  << ", SrcNode: " << jobDetail.srcNode.getNodeName() 
                  << ", DestNode: " << jobDetail.destNode.getNodeName()
                  << std::endl;
    }

    if (migrateDecision(jobDetails)) {
        migrator(jobDetails);
    } else {
        std::cout << "No migration needed." << std::endl;
    }

    return 0;
}

#include <iostream>
#include "SlurmInterface.h"

int main(){

    std::vector<JobState> output = get_job_state();

        for(JobState j : output){
            std::cout << j.job_id << " " << j.job_state << std::endl;
        }

    return 0;
}
#ifndef SLURMINTERFACE_H
#define SLURMINTERFACE_H

#include <string>

class JobState {
    public:
        std::string job_id;
        std::string job_state;
    
        JobState() : job_id(""), job_state("") {}
};

std::string get_slurm_output(char* args[]);

#endif
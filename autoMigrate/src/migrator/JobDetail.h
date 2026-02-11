#ifndef JOBDETAIL_H
#define JOBDETAIL_H

#include "Node.h"
#include <string>

class JobDetail{
	public:
        std::string jobId;
        std::string user;
        std::string state;
        int cpus;
        Node srcNode;
        Node destNode;

        JobDetail() : jobId(""), cpus(0) {}
};

#endif
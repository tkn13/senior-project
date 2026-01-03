#ifndef JobModel_H
#define JobModel_H

#include <string>
#include <map>

struct JobDetail {
    std::string status;
    std::string nodeAlloc;
    std::string cpuAlloc;

    //Constructor
    JobDetail(std::string s = "", std::string n = "", std::string cpu = "0i")
    : status(std::move(s)), nodeAlloc(std::move(n)), cpuAlloc(std::move(cpu)) {}
};

using JobMap = std::map<int, JobDetail>;

#endif
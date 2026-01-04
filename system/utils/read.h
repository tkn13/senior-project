#ifndef READ_H
#define READ_H

#include <string>
#include <map>
#include "model/JobModel.h"

using namespace std;

JobMap readJobMapFromFile(std::string path);
void writeJobToFile(JobMap jobs, std::string path);


#endif
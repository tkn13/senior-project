#ifndef READ_H
#define READ_H

#include <string>
#include <map>

std::map<int, std::string> readJobMapFromFile(std::string path);
void writeJobToFile(std::map<int, std::string> jobs, std::string path);

#endif
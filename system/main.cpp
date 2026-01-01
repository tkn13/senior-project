#include <iostream>
#include <filesystem>
#include "JobManager.h"
#include "utils/read.h"

using namespace std;
namespace fs = filesystem;

fs::path getExecuteableDir(char* argv0){
    return fs::absolute(argv0).parent_path();
}


int main(int argc, char* argv[]) {

    fs::path exeDir = getExecuteableDir(argv[0]);

    fs::path prevPath = exeDir / "data" / "prev";
    fs::path currPath = exeDir / "data" / "curr";

    JobManager manager;

    std::map<int, std::string> prev = readJobMapFromFile(prevPath.string());
    std::map<int, std::string> curr = readJobMapFromFile(currPath.string());

    JobResult res = manager.processJobs(prev, curr);

    for (int id : res.to_update) {
        std::cout << id << endl;
    }

    writeJobToFile(res.new_prev_map, prevPath.string());

    return 0;
}

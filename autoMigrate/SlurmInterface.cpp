#include <iostream>
#include <string>
#include <vector>
#include <set>
#include <sstream>
#include <unistd.h>
#include <sys/wait.h>
#include "Node.h"
#include "NodeList.h"
#include "JobDetail.h"
#include "SlurmInterface.h"

std::string get_squeue_output() {
    int pipefd[2];
    if (pipe(pipefd) == -1) {
        perror("pipe");
        return "";
    }

    pid_t pid = fork();
    if (pid == -1) {
        perror("fork");
        close(pipefd[0]);
        close(pipefd[1]);
        return nullptr;
    }

    if (pid == 0) {
        close(pipefd[0]);
        dup2(pipefd[1], STDOUT_FILENO);
        close(pipefd[1]);

        char* args[] = {
            (char*)"squeue", 
            (char*)"-h", 
            (char*)"-o", 
            (char*)"%i %C %N %u", 
            nullptr
        };

        execvp(args[0], args);
        
        perror("execvp");
        _exit(1); 
    } else {
        close(pipefd[1]);

        std::string output = "";
        char buffer[4096];
        ssize_t bytesRead;

        while ((bytesRead = read(pipefd[0], buffer, sizeof(buffer))) > 0) {
            output.append(buffer, bytesRead);
        }

        close(pipefd[0]);
        waitpid(pid, nullptr, 0);

        return output;
    }
}

void process(std::string job, std::vector<JobDetail>& jobDetails) {
    if (job.empty()) {
        return;
    }

    std::stringstream ss(job);
    std::string line;

    while (std::getline(ss, line)) {
        if (!line.empty()) {
            // line output e.g: "401 1 blade-n1"
            //"JobId CPUs NodeName"
            std::stringstream lineStream(line);
            std::string jobId;
            int cpus;
            std::string nodeName;
            std::string user;
            lineStream >> jobId >> cpus >> nodeName >> user;
            JobDetail jobDetail;
            jobDetail.jobId = jobId;
            jobDetail.cpus = cpus;
            jobDetail.srcNode = NodeList::getInstance().getNodeByName(nodeName);
            jobDetail.user = user;
            jobDetails.push_back(jobDetail);
        }
    }
}

void getJobDetails(std::vector<JobDetail>& jobDetails) {
    std::string squeueOutput = get_squeue_output();
    //std::string squeueOutput = "401 1 blade-n1\n402 1 blade-n2\n403 1 blade-n3";
    process(squeueOutput, jobDetails);
}
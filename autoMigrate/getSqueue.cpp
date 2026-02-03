#include <iostream>
#include <string>
#include <vector>
#include <set>
#include <sstream>
#include <unistd.h>
#include <sys/wait.h>
#include "Node.h"
#include "NodeList.h"

class JobDetail{
	public:
		std::string jobId;
		int cpus;
		Node srcNode;
		Node destNode;

        JobDetail(){
            jobId = "";
            cpus = 0;
            srcNode = Node();
            destNode = Node();
        } 
};

std::string* get_squeue_output() {
    int pipefd[2];
    if (pipe(pipefd) == -1) {
        perror("pipe");
        return nullptr;
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
            (char*)"%i %C %N", 
            nullptr
        };

        execvp(args[0], args);
        
        perror("execvp");
        _exit(1); 
    } else {
        close(pipefd[1]);

        std::string* output = new std::string();
        char buffer[4096];
        ssize_t bytesRead;

        while ((bytesRead = read(pipefd[0], buffer, sizeof(buffer))) > 0) {
            output->append(buffer, bytesRead);
        }

        close(pipefd[0]);
        waitpid(pid, nullptr, 0);

        return output;
    }
}

void process(std::string* job, std::vector<JobDetail>& jobDetails) {
    if (job == nullptr) {
        return;
    }

    std::stringstream ss(*job);
    std::string line;

    while (std::getline(ss, line)) {
        if (!line.empty()) {
            // line output e.g: "401 1 blade-n1"
            //"JobId CPUs NodeName"
            std::stringstream lineStream(line);
            std::string jobId;
            int cpus;
            std::string nodeName;
            lineStream >> jobId >> cpus >> nodeName;
            JobDetail jobDetail;
            jobDetail.jobId = jobId;
            jobDetail.cpus = cpus;
            jobDetail.srcNode = NodeList::getInstance().getNodeByName(nodeName);
            jobDetails.push_back(jobDetail);
        }
    }
}

//This function will rearrange jobs to different nodes with Bin packing algorithm
void rearrangeJobs(std::vector<JobDetail>& jobDetails) {
    NodeList& nodeList = NodeList::getInstance();
    const std::vector<Node>& nodes = nodeList.getNodes();
    std::vector<int> nodecapacities;

    // Initialize node capacities
    for (const auto& node : nodes) {
        nodecapacities.push_back(node.getCpus());
    }

    for (auto& job : jobDetails) {
        for (size_t i = 0; i < nodes.size(); ++i) {
            if (job.cpus <= nodecapacities[i]) {
                job.destNode = nodes[i];
                nodecapacities[i] -= job.cpus;
                break;
            }
        }
    }
}

//if number of destNode is less than srcNode, return true
bool migrateDecision(const std::vector<JobDetail>& jobDetails) {
    std::set<std::string> srcSet;
    std::set<std::string> destSet;

    for (const auto& job : jobDetails) {
        srcSet.insert(job.srcNode.getNodeName());
        destSet.insert(job.destNode.getNodeName());
    }

    return destSet.size() < srcSet.size();
}

void migrator(const std::vector<JobDetail>& jobDetails) {
    for (const auto& job : jobDetails) {
        if (job.srcNode.getNodeName() != job.destNode.getNodeName()) {
            std::string command = "scontrol migrate " + job.jobId + " " + job.destNode.getNodeName();
            std::cout << "Executing: " << command << std::endl;
        }
    }
}
void test() {

    std::string testData = "401 1 blade-n1\n402 1 blade-n2\n403 1 blade-n3";
    std::vector<JobDetail> jobDetails;
    process(&testData, jobDetails);
    
    //print job details
    for (const auto& job : jobDetails) {
        std::cout << "JobId: " << job.jobId 
                  << ", CPUs: " << job.cpus 
                  << ", SrcNode: " << job.srcNode.getNodeName() 
                  << ", DestNode: " << job.destNode.getNodeName()
                  << std::endl;
    }

    rearrangeJobs(jobDetails);

    std::cout << "After rearranging jobs:" << std::endl;
    for (const auto& job : jobDetails) {
        std::cout << "JobId: " << job.jobId 
                  << ", CPUs: " << job.cpus 
                  << ", SrcNode: " << job.srcNode.getNodeName() 
                  << ", DestNode: " << job.destNode.getNodeName()
                  << std::endl;
    }

    bool decision = migrateDecision(jobDetails);
    std::cout << "Migrate Decision: " << (decision ? "Yes" : "No") << std::endl;
    if (decision) {
        migrator(jobDetails);
    }
}

int main() {
   test();
}

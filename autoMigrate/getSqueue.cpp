#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include <unistd.h>
#include <sys/wait.h>
#include "Node.h"

class JobDetail{

	public
		std::string jobId;
		int cpus;
		Node srcNode;
		Node destNode;
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

void process(std::string* job) {
    if (job == nullptr) {
        return;
    }

    std::stringstream ss(*job);
    std::string line;

    while (std::getline(ss, line)) {
        if (!line.empty()) {
            std::cout << "Job: " << line << std::endl;
        }
    }
}

int main() {
    // 1. Get the data from the system command
    std::string* jobData = get_squeue_output();

    if (jobData != nullptr) {
        // 2. Process the data
        process(jobData);

        // 3. Free the heap memory
        delete jobData;
    } else {
        std::cerr << "Error: Could not retrieve job data." << std::endl;
        return 1;
    }

    return 0;
}

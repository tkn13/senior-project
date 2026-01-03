#include "read.h"
#include "model/JobModel.h"
#include <iostream>
#include <fstream>
#include <filesystem>
#include <sstream>

using namespace std;
namespace fs = filesystem;

JobMap readJobMapFromFile(string path)
{
    fs::path filepath = fs::absolute(path);

    if (!(fs::exists(filepath)))
    {
        cout << filepath << endl;
        cout << "path not found" << endl;
        return {};
    }

    string dataStream;
    JobMap returnValue;

    ifstream Datafile(filepath);

    while (getline(Datafile, dataStream))
    {
        // data format example:
        // job_history,job_id=288 state="CANCELLED",cpu_usage=2i,node_alloc="blade-n1"

        int jobId = -1;
        string state;
        string nodeAlloc;
        string cpuAlloc;

        size_t pos = dataStream.find("job_id=");
        if (pos != string::npos)
        {
            pos += strlen("job_id=");
            size_t end = pos;
            while (end < dataStream.size() && isdigit(static_cast<unsigned char>(dataStream[end]))) ++end;
            if (end > pos)
            {
                jobId = stoi(dataStream.substr(pos, end - pos));
            }
        }

        pos = dataStream.find("state=");
        if (pos != string::npos)
        {
            pos += strlen("state=");
            if (pos < dataStream.size() && dataStream[pos] == '"')
            {
                ++pos;
                size_t end = dataStream.find('"', pos);
                if (end != string::npos) state = dataStream.substr(pos, end - pos);
            }
            else
            {
                size_t end = dataStream.find_first_of(", \t", pos);
                if (end == string::npos) end = dataStream.size();
                state = dataStream.substr(pos, end - pos);
            }
        }

        pos = dataStream.find("cpu_usage");
        if(pos != string::npos)
        {
            pos += strlen("cpu_usage");
            if(pos < dataStream.size() && dataStream[pos] == '"')
            {
                ++pos;
                size_t end = dataStream.find('"', pos);
                if (end != string::npos) cpuAlloc = dataStream.substr(pos, end-pos);
            }
            else
            {
                size_t end = dataStream.find_first_of(", \t", pos);
                if(end == string::npos) end = dataStream.size();
                cpuAlloc = dataStream.substr(pos, end - pos);
            }
        }

        pos = dataStream.find("node_alloc=");
        if (pos != string::npos)
        {
            pos += strlen("node_alloc=");
            if (pos < dataStream.size() && dataStream[pos] == '"')
            {
                ++pos;
                size_t end = dataStream.find('"', pos);
                if (end != string::npos) nodeAlloc = dataStream.substr(pos, end - pos);
            }
            else
            {
                size_t end = dataStream.find_first_of(", \t", pos);
                if (end == string::npos) end = dataStream.size();
                nodeAlloc = dataStream.substr(pos, end - pos);
            }
        }

        if (jobId != -1)
        {
            returnValue[jobId] = JobDetail(state, nodeAlloc, cpuAlloc);
        }
    }
    Datafile.close();

    return returnValue;
}

void writeJobToFile(JobMap jobs, string path)
{

    ofstream DataFile;
    fs::path filepath = fs::absolute(path);
    fs::create_directories(filepath.parent_path());

    DataFile.open(filepath);
    if (DataFile.is_open())
    {
        // data format example:
        // job_history,job_id=288 state="CANCELLED",cpu_usage=2i,node_alloc="blade-n1"
        for (auto [job_id, job_detail] : jobs)
        {
            DataFile << "job_history,job_id=" << job_id << " state=\"" 
            << job_detail.status << "\",cpu_usage=\""
            << job_detail.cpuAlloc << ",node_alloc=\""
            << job_detail.nodeAlloc << "\""
            << endl;
        }
        DataFile.close();
    }
    else
    {
        cerr << "Error: Could not open file for writing!" << endl;
    }
}

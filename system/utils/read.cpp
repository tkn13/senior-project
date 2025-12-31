#include "read.h"
#include <iostream>
#include <fstream>
#include <filesystem>
#include <sstream>

using namespace std;
namespace fs = filesystem;

map<int, string> readJobMapFromFile(string path)
{

    fs::path filepath = fs::absolute(path);

    if (!(fs::exists(filepath)))
    {
        cout << "path not found" << endl;
        return {};
    }

    string dataStream;
    map<int, string> data;

    ifstream Datafile(filepath);

    while (getline(Datafile, dataStream))
    {
        stringstream ss(dataStream);
        string t;
        char del = ',';
        string data1;
        string data2;

        getline(ss, t, del);
        data1 = t;

        getline(ss, t, del);
        data2 = t;

        data.insert({stoi(data1), data2});
    }
    Datafile.close();

    return data;
}

void writeJobToFile(map<int, string> jobs, string path)
{

    ofstream DataFile;
    fs::path filepath = fs::absolute(path);
    fs::create_directories(filepath.parent_path());

    DataFile.open(filepath);

    if (DataFile.is_open())
    {
        for (auto job : jobs)
        {
            DataFile << job.first << "," << job.second << endl;
        }
        DataFile.close();
    }
    else
    {
        cerr << "Error: Could not open file for writing!" << endl;
    }
}
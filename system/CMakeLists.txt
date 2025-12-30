# 1. Set the minimum version of CMake required
cmake_minimum_required(VERSION 3.10)

# 2. Name your project
project(JobSystem)

# 3. Specify the C++ standard (C++17 is needed for the [job_id, curr_status] syntax)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 4. Add the executable and list ALL .cpp files involved
add_executable(Main 
main.cpp  
JobManager.cpp
utils/read.cpp)

file(COPY "${CMAKE_SOURCE_DIR}/data" DESTINATION "${CMAKE_BINARY_DIR}")
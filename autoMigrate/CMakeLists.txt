cmake_minimum_required(VERSION 3.10)

project(AutoMigrate)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(SOURCES
	Main.cpp
	Node.cpp
	NodeList.cpp
	SlurmInterface.cpp
	JobPacker.cpp
)

add_executable(JobManager ${SOURCES})

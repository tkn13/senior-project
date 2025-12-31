#!/bin/bash


echo "cupture curret job with squeue..."

output1=$(./daemon/capture_job_list.sh)

echo "output from squeue $output1"

echo "write data to curr..."

./daemon/capture_job_list.sh > ./build/data/curr

echo "data at curr..."
cat ./build/data/curr

echo "process data..."

./build/Main

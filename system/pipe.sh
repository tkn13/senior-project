#!/bin/bash

./daemon/capture_job_list.sh > ./build/data/curr

./build/Main | ./daemon/update_to_database.sh

#!/bin/bash

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

$SCRIPT_DIR/daemon/capture_job_list.sh > $SCRIPT_DIR/build/data/curr

$SCRIPT_DIR/build/Main | $SCRIPT_DIR/daemon/capture_job.sh

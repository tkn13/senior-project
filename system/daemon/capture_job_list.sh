#!/bin/bash

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

squeue -h -o %A | "$SCRIPT_DIR/capture_job.sh"

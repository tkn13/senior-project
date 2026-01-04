#!/bin/bash

input=$@
if [ -z "$input" ]; then
    input=$(cat -)
fi

for arg in $input; do
	state=$(sacct -X -n -j "$arg" --format=State | sed 's/[+[:space:]]//g')
	alloc=$(sacct -X -n -j "$arg" --format=AllocCPUS | sed 's/[+[:space:]]//g')
	node=$(sacct -X -n -j "$arg" --format=NodeList | sed 's/[+[:space:]]//g')
	echo "job_history,job_id=$arg state=\"$state\",cpu_usage=$alloc"i,node_alloc=\"$node\"
done

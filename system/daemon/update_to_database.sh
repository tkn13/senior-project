#!/bin/bash

input=$@
if [ -z "$input" ]; then
    input=$(cat -)
fi

for arg in $input; do
	state=$(sacct -X -n -j "$arg" --format=State | sed 's/[+[:space:]]//g')
	echo [$(date)] "$arg,$state"
done

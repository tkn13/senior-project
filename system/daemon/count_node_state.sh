#!/bin/bash

# Initialize counters
idle_count=0
busy_count=0
down_count=0

# Execute sinfo and read line by line
# %T = State, %D = Node count
while read -r state count; do
    # Remove any suffix like '*' or '~' from the state name
    clean_state=$(echo "$state" | sed 's/[*~#$]//g')

    case "$clean_state" in
        # IDLE GROUP
        idle|idle+drain|npc|power_down|powered_down|powering_up)
            idle_count=$((idle_count + count))
            ;;
        
        # BUSY GROUP
        alloc|allocated|mix|mixed|comp|completing|resv|reserved)
            busy_count=$((busy_count + count))
            ;;
        
        # DOWN GROUP
        down|drain|draining|drained|fail|maint|reboot_issued|reboot_requested|unk|unknown|no_respond|blocked|powering_down|future|futr|planned|perfctrs)
            down_count=$((down_count + count))
            ;;
            
        *)
            # Default case: if a state is unknown, treat as down/unavailable
            down_count=$((down_count + count))
            ;;
    esac
done < <(sinfo -h -o "%T %D")

# Output in the requested format: idle,busy,down
echo "${idle_count},${busy_count},${down_count}"

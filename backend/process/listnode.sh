#!/bin/bash

# Initialize arrays to store node names
idle_nodes=()
busy_nodes=()
down_nodes=()

# Execute sinfo and read node by node
# %n = Node host name, %T = State
while read -r name state; do
    # Remove Slurm suffix symbols (*, ~, #, etc.)
    clean_state=$(echo "$state" | sed 's/[*~#$]//g')

    case "$clean_state" in
        # IDLE GROUP
        idle|npc|power_down|powered_down|powering_up)
            idle_nodes+=("$name")
            ;;
        
        # BUSY GROUP
        alloc|allocated|mix|mixed|comp|completing|resv|reserved)
            busy_nodes+=("$name")
            ;;
        
        # DOWN GROUP
        down|drain|draining|drained|fail|maint|reboot_issued|reboot_requested|unk|unknown|no_respond|blocked|powering_down|future|futr|planned|perfctrs)
            down_nodes+=("$name")
            ;;
            
        *)
            down_nodes+=("$name")
            ;;
    esac
done < <(sinfo -h -o "%n %T")

# Function to print array elements joined by commas
print_csv() {
    local arr=("$@")
    (IFS=,; echo "${arr[*]}")
}

# Final Output
echo -n "idle:"
print_csv "${idle_nodes[@]}"
echo -n "busy:"
print_csv "${busy_nodes[@]}"
echo -n "down:"
print_csv "${down_nodes[@]}"

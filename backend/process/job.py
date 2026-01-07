import re
import subprocess

def extract(data, target_num):
    job_ids = []
    # Pattern looks for 'blade-n' followed by a number OR bracketed ranges
    pattern = r"blade-n(?:(\d+)|\[([^\]]+)\])"
    
    for line in data.strip().splitlines():
        # Split the line to separate Job ID from the blade string
        parts = line.split(',', 1)
        if len(parts) < 2:
            continue
            
        job_id = parts[0]
        blade_info = parts[1]
        
        match = re.search(pattern, blade_info)
        if match:
            simple_num, bracket_content = match.groups()
            
            # Case 1: Simple number (e.g., blade-n1)
            if simple_num and int(simple_num) == target_num:
                job_ids.append(job_id)
            
            # Case 2: Bracketed ranges (e.g., [2-4,6])
            elif bracket_content:
                sub_parts = bracket_content.split(',')
                for p in sub_parts:
                    if '-' in p:
                        start, end = map(int, p.split('-'))
                        if start <= target_num <= end:
                            job_ids.append(job_id)
                            break
                    elif int(p) == target_num:
                        job_ids.append(job_id)
                        break
                        
    return job_ids

def get_job_id_by_node(node_id):

    result = subprocess.run(["squeue", "-h", "-o", "%A,%N"], capture_output=True, text=True)

    if result.returncode == 0:
        output = extract(result.stdout, node_id)
        return output
    return []



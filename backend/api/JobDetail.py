import subprocess
from schema.Job import JobDetailResponse

def get_job_detail(job_id):
    cmd = [
        "sacct", 
        "-X", 
        "-n", 
        "-j", str(job_id), 
        "--format=State,AllocCPUS,NodeList", 
        "-p"
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        return None
    
    data = result.stdout.strip().split("|")
    state = data[0]
    cpuAlloc = data[1]
    nodeAlloc = data[2]

    return JobDetailResponse(
        jobId = job_id,
        jobStatus = state,
        nodeAlloc = nodeAlloc,
        cpuAlloc = cpuAlloc
    )

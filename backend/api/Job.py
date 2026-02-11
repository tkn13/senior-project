import subprocess
from schema.Job import JobResponse

def get_list_of_job_state():
    
    result = subprocess.run(["squeue", "-h", "-o", "%A,%T"], capture_output=True, text=True)
    
    if result.returncode != 0:
        return JobResponse(
            runningId = [],
            pendingId = []
        )

    data = result.stdout

    runningJob = []
    pendingJob = []

    for line in data.splitlines():
        jobId, state = line.split(',', 1)

        if state == "RUNNING":
            runningJob.append(jobId)
        elif state == "PENDING":
            pendingJob.append(jobId)

    return JobResponse(
        runningId=runningJob,
        pendingId=pendingJob
    )

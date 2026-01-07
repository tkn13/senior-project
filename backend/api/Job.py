from schema.Job import JobResponse
from dotenv import load_dotenv
import os

load_dotenv()
dataPath = os.getenv("DATA_PATH")

def get_list_of_job_state() -> JobResponse:

    runningJob = []
    pendingJob = []

    try:
        with open(dataPath, 'r') as file:
            for line in file:
                line = line.strip()
                if not line:
                    continue

                parts = line.split(' ')

                if len(parts) != 2:
                    continue

                header_info = parts[0].split(',')
                current_job_id = None
                for i in header_info:
                    if 'job_id' in i:
                        current_job_id = (i.split('='))[1]

                details = parts[1].replace('"', "").split(",")
                state = ""
                for i in details:
                    if 'state' in i:
                        state = (i.split('='))[1]
                if(state == "RUNNING"):
                    runningJob.append(current_job_id)
                elif(state == "PENDING"):
                    pendingJob.append(current_job_id)

    except FileNotFoundError:
        print(f"Error: The file at {dataPath} was not found.")
    
    return JobResponse(
        runningId=runningJob,
        pendingId=pendingId
    )
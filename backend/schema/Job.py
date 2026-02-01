from pydantic import BaseModel

class JobResponse(BaseModel):
    runningId: list[str]
    pendingId: list[str]

class JobDetailResponse(BaseModel):
    jobId: str
    jobStatus: str
    nodeAlloc: str
    cpuAlloc: int


from pydantic import BaseModel

class JobResponse(BaseModel):
    runningId: list[str]
    pendingId: list[str]
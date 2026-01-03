import sys
import os

PACKAGES_DIR = os.path.join(os.path.dirname(__file__), 'packages')
MODULE_DIR = os.path.join(os.path.dirname(__file__), 'MODULE_DIR')

if PACKAGES_DIR not in sys.path:
    sys.path.insert(0, PACKAGES_DIR)

if MODULE_DIR not in sys.path:
    sys.path.insert(0, MODULE_DIR)

from typing import Annotated, Union

from fastapi import FastAPI, Request, Header 
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from middleware import isPass
from processor import get_node_metric

app = FastAPI()

class CommonHeaders(BaseModel):
    apikey: str

@app.middleware("http")
async def checkApiKey(request: Request, call_next):
    
    if request.url.path in ["/docs", "/redoc", "/openapi.json"]:
        response = await call_next(request)
        return response

    if not(isPass(request.headers.get("apikey"))):
        return JSONResponse(
            status_codee=401, 
            content={"detail": "API KEY is missing or invalid"}
        )
    response = await call_next(request)
    return response


@app.get("/")
async def root(headers: Annotated[CommonHeaders, Header()]):
    return headers

@app.get("/api/metrics/cluster/summary")
async def clusterSummary(headers: Annotated[CommonHeaders, Header()]):
    return JSONResponse(
        status_code=201,
        content={"message": "/metrics/cluster/summary"}
    )
   
@app.get("/api/metrics/node/{node_id}")
async def nodeById(headers: Annotated[CommonHeaders, Header()],
    node_id: str, 
    time_delta: str, 
    start_time: Union[str, None] = None, 
    end_time: Union[str, None] = None):
    return await get_node_metric(node_id, time_delta=time_delta, start_time=start_time, end_time=end_time)
 
@app.get("/api/metrics/node/list")
async def nodeAll(headers: Annotated[CommonHeaders, Header()]):
    return JSONResponse(
        status_code=201,
        content={"message": "/metrics/node/list"}
    )

@app.get("/api/metrics/job/{job_id}")
async def jobById(job_id, headers: Annotated[CommonHeaders, Header()]):
    return JSONResponse(
        status_code=201,
        content={"message": job_id}
    )
 
@app.get("/api/metrics/job/list")
async def jobAll(headers: Annotated[CommonHeaders, Header()]):
    return JSONResponse(
        status_code=201,
        content={"message": "/metrics/job/list"}
    )
 

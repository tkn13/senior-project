import influxdb_client, os, asyncio
from influxdb_client import InfluxDBClient
from templates import get_query_text_node_cpu, get_query_text_node_mem, get_query_text_running_job
from typing import Optional
from dataclasses import dataclass
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()
token = os.getenv("INFLUXDB_TOKEN")
dataPath = os.getenv("DATA_PATH")
org = "blade"
url = "http://127.0.0.1:8086"

client = influxdb_client.InfluxDBClient(url=url, token=token, org=org)

query_api = client.query_api()

@dataclass
class Metric:
    timestamp: datetime
    cpu: Optional[float] = None
    mem: Optional[float] = None

@dataclass
class ResourceUsage:
    start_time: datetime
    end_time: datetime
    data_amount: int
    data: list[Metric]

@dataclass
class NodeMetricResponse:
    node_id: str
    node_status: str
    current_job: list[str]
    resource_usage: ResourceUsage

class MetricUnit:
    def __init__(self, timestamp, value):
        self.timestamp = timestamp
        self.value = value


async def get_node_cpu(
    node_id: str,
    time_delta: Optional[str] = "-1h",
    start_time: Optional[str] = None,
    end_time: Optional[str] = None
    ) -> list[MetricUnit]:
    query = get_query_text_node_cpu(node_id, time_delta, start_time, end_time)

    tables = query_api.query(query,org=org)
    
    return_value: list[MetricUnit] = []

    for table in tables:
        for record in table.records:
            return_value.append(MetricUnit(record['_time'], record['_value']))
    return return_value

async def get_node_mem(
    node_id: str,
    time_delta: Optional[str] = "-1h",
    start_time: Optional[str] = None,
    end_time: Optional[str] = None
    ) -> list[MetricUnit]:
    query = get_query_text_node_mem(node_id, time_delta, start_time, end_time)

    tables = query_api.query(query, org=org)

    return_value: list[MetricUnit] = []

    for table in tables:
        for record in table.records:
            return_value.append(MetricUnit(record['_time'], record['_value']))
    return return_value

def get_running_job(
    node_id: str) -> list[str]:

    return_value = []
    
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
                node = ""
                for i in details:
                    if 'state' in i:
                        state = (i.split('='))[1]
                    elif 'node_alloc' in i:
                        node = (i.split('='))[1]
                if(state == "RUNNING" and node == node_id):
                    return_value.append(current_job_id)
    except FileNotFoundError:
        print(f"Error: The file at {dataPath} was not found.")

    return return_value

async def get_node_metric(
    node_id: str,
    time_delta: Optional[str] = "-1h",
    start_time: Optional[str] = None,
    end_time: Optional[str] = None
    ):
    
    print(f"api was called {start_time}, {end_time}")

    cpu = await get_node_cpu(node_id, time_delta, start_time, end_time)
    mem = await get_node_mem(node_id, time_delta, start_time, end_time)

    merge: Dict[str, Metric] = {}

    for item in cpu:
        merge[item.timestamp] = Metric(timestamp=item.timestamp, cpu=item.value)

    for item in mem:
        if item.timestamp in merge:
            merge[item.timestamp].mem = item.value
        else:
            merge[item.timestamp] = Metric(timestamp=item.timestamp, mem=item.value)

    resource_data = sorted(merge.values(), key=lambda x: x.timestamp)
    
    if len(resource_data) > 0:
        resource_usage=ResourceUsage(
        start_time=resource_data[0].timestamp, 
        end_time=resource_data[-1].timestamp,
        data_amount=len(resource_data),
        data=resource_data)
    else:
        resource_usage=None
    
    return (NodeMetricResponse(
        node_id=node_id, 
        node_status="up", 
        current_job=get_running_job(node_id)
        resource_usage=resource_usage))

async def main():
    print(get_running_job("blade-n1"))
if __name__ == "__main__":
    asyncio.run(main())

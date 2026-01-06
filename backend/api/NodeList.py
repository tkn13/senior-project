from dataclasses import dataclass
from dotenv import load_dotenv
import os

load_dotenv()
dataPath = os.getenv("DATA_NODE_PATH")

@dataclass
class NodeListResponse:
    idleNode: list[str]
    busyNode: list[str]
    downNode: list[str]

def get_list_of_node_state() -> NodeListResponse:

    input = ""

    with open(dataPath) as line:
        input = line.read()

    idle = []
    busy = []
    down = []

    for line in input.splitlines():
        item = line.split(":")
        nodes = item[1].split(",")
        state = item[0].strip().lower()

        if len(nodes) == 1 and nodes[0] == "":
            continue
        for node in nodes:
            if state == "idle":
                idle.append(node)
            elif state == "busy":
                busy.append(node)
            else:
                down.append(node)

    return NodeListResponse(idle, busy, down)                

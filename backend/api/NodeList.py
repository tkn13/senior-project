from dataclasses import dataclass

@dataclass
class NodeListResponse:
    idleNode: [str]
    busyNode: [str]
    downNode: [str]

def get_list_of_node_state() -> NodeListResponse:
    input = """idle:blade-n1,blade-n2,blade-n3,blade-n4,blade-n7,blade-n8
    Busy:
    down:blade-n5,blade-n6"""

    idle = [str]
    busy = [str]
    down = [str]

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

    print(idle)
    print(busy)
    print(down)

    return NodeListResponse(idle, busy, down)                
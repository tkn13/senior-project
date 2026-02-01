#include <iostream>
#include "NodeList.h"
#include "Node.h"

int main() {
    NodeList& myCluster = NodeList::getInstance();

    for (const auto& node : myCluster.getNodes()) {
        std::cout << "Node: " << node.getNodeName() << " | CPUs: " << node.getCpus() << std::endl;
    }

    return 0;
}

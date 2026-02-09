#include "NodeList.h"
#include <string>
#include <stdexcept>

NodeList& NodeList::getInstance(){
	static NodeList instance;
	return instance;
}

NodeList::NodeList() {

	for (int i = 1; i <= 8; i++){
		std::string name = "blade-n" + std::to_string(i);
		nodes.emplace_back(name, 2);
	}
}

const std::vector<Node>& NodeList::getNodes() const{
	return nodes;
}

Node NodeList::getNodeByName(const std::string& nodeName) const {
	for (const auto& node : nodes) {
		if (node.getNodeName() == nodeName) {
			return node;
		}
	}
	throw std::runtime_error("Node not found: " + nodeName);
}

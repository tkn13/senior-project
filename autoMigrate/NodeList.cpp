#include "NodeList.h"
#include <string>

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

#ifndef NODELIST_H
#define NODELIST_H

#include <vector>
#include "Node.h"

class NodeList{

	private:
	std::vector<Node> nodes;

	NodeList();

	public:

	NodeList(const NodeList&) = delete;

	static NodeList& getInstance();

	const std::vector<Node>& getNodes() const;

	Node getNodeByName(const std::string& nodeName) const;
};

#endif

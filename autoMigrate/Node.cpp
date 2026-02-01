#include "Node.h"

Node::Node(std::string nodeName, int cpus)
	: nodeName(nodeName), cpus(cpus) {}

std::string Node::getNodeName() const {
	return nodeName;
}

void Node::setNodeName(std::string) {
	this->nodeName = nodeName;
}

int Node::getCpus() const {
	return cpus;
}

void Node::setCpus(int cpus){
	this->cpus = cpus;
}

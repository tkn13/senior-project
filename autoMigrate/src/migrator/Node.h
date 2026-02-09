#ifndef NODE_H
#define NODE_H

#include <string>

class Node {
	
	private:
		std::string nodeName;
		int cpus;

	public:
		Node();
		Node(std::string nodeName, int cpus);

		std::string getNodeName() const;
		int getCpus() const;

		void setNodeName(std::string nodeName);
		void setCpus(int cpus);
};

#endif

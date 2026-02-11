#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <cstring>
#include <iostream>

#include "client.h"

int sendMessageToServer(const char* message) {
    int clientSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (clientSocket == -1) {
        std::cerr << "Failed to create socket" << std::endl;
        return -1;
    }

    sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(WEB_CONFIG::PORT);

    if (connect(clientSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)) == -1) {
        std::cerr << "Failed to connect to server" << std::endl;
        close(clientSocket);
        return -1;
    }

    ssize_t bytesSent = send(clientSocket, message, strlen(message), 0);
    if (bytesSent == -1) {
        std::cerr << "Failed to send message" << std::endl;
        close(clientSocket);
        return -1;
    }

    close(clientSocket);
    return 0;
}

int main(int argc, char* argv[]) {
    const char* message = "TEST";
    if (argc > 1) {
        message = argv[1];
    }

    if (sendMessageToServer(message) == -1) {
        std::cerr << "Error sending message to server" << std::endl;
        return -1;
    }

    return 0;
}
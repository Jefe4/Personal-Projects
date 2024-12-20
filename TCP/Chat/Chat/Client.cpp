#include <iostream>
#include <sstream>
#include <errno.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>

// Function to show how to use this program
static void usage();

int main(int argc, char* argv[])
{
	// Check if the user asked for help
	if (argc > 1 && *(argv[1]) == '-')
	{
		usage(); exit(1);
	}

	// Create socket
	int s0 = socket(AF_INET, SOCK_STREAM, 0);
	if (s0 < 0)
	{
		std::cerr << "Error: " << strerror(errno) << std::endl;
		exit(1);
	}

	// Fill in server IP address
	struct sockaddr_in server;
	bzero(&server, sizeof(server));
	char* peerHost = "localhost"; // Default server address
	if (argc > 1)
		peerHost = argv[1]; // Use server address from command line if provided

	// Resolve server address (convert from symbolic name to IP number)
	struct hostent* host = gethostbyname(peerHost);
	if (host == NULL)
	{
		std::cerr << "Error: " << strerror(errno) << std::endl;
		exit(1);
	}
	server.sin_family = AF_INET;
	short peerPort = 1234; // Default server port
	if (argc >= 3)
		peerPort = (short)atoi(argv[2]); // Use port from command line if provided
	server.sin_port = htons(peerPort); // Convert port to network byte order

	// Print a resolved address of server (the first IP of the host)
	std::cout << "server address = " << (host->h_addr_list[0][0] & 0xff) << "." <<
										(host->h_addr_list[0][1] & 0xff) << "." <<
										(host->h_addr_list[0][2] & 0xff) << "." <<
										(host->h_addr_list[0][3] & 0xff) << ", port " <<
										static_cast<int>(peerPort) << std::endl;

	// Write resolved IP address of a server to the address structure
	memmove(&(server.sin_addr.s_addr), host->h_addr_list[0], 4);

	// Connect to the remote server
	int res = connect(s0, (struct sockaddr*)&server, sizeof(server));
	if (res < 0)
	{
		std::cerr << "Error: " << strerror(errno) << std::endl;
		exit(1);
	}

	// Read the server's response
	char buffer[1024];
	res = read(s0, buffer, 1023);
	if (res < 0) {
		std::cerr << "Error: " << strerror(errno) << std::endl;
		exit(1);
	}
	buffer[res] = 0; // Null-terminate the string
	std::cout << "Received: " << "\n" << buffer << std::endl;

	// Send a message to the server
	write(s0, "Thanks! Bye-Bye ... \r\n", 20);

	close(s0); // Close the socket
	return 0;
}

// Function to show how to use this program
static void usage()
{
	std::cout << "A simple Internet client application.\n"
		<< "Usage:\n"
		<< "      client [IP_address_of_server [port_of_server]]\n"
		<< "     where IP_address_of_server is either IP number of server\n"
		<< "     or a symbolic Internet name, default is \"localhost\";\n"
		<< "     port_of_server is a port number, default is 1234.\n"
		<< "The client connects to a server which address is given in a\n"
		<< "command line, receives a message from a server, sends the message\n"
		<< "\"Thanks! Bye-bye...\", and terminates.\n";
}
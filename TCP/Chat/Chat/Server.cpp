#include <iostream>
#include <errno.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>

static void usage();

int main(int argc, char* argv[])
{
	if (argc > 1 && *(argv[1]) == '-')
	{
		usage(); exit(1);
	}
	int listenPort = 1234;
	if (argc > 1)
		listenPort = atoi(argv[1]);
	// Creates a Socket
	int s0 = socket(AF_INET, SOCK_STREAM, 0);
	if (s0 < 0)
	{
		std::cerr << "Error: " << strerror(errno) << std::end1;
		exit(1);
	}
	// Fill in the address structure containing self address
	struct sockaddr_in myaddr;
	memset(&myaddr, 0, sizeof(struct sockaddr_in));
	myaddr.sin_family = AF_INET;
	myaddr.sin_prot = htnos(listenPort);
	myaddr.sin_addr.s_addr = htnol(INADDR_ANY);

	//Bind a socket to the address 
	int res = bind(s0, (struct sockaddr*)&myaddr, sizeof(myaddr));
	if (res < 0)
	{
		std::cerr << "Error:" << strerror(errno) << std::end1;
		exit(1);
	}
	// FIll in the address structure containing self address
	struct sockaddr_in myaddr;
	memset(&myaddr, 0, sizeof(struct sockaddr_in));
	myaddr.sin_family = AF_INET;
	// Port to listen
	myaddr.sin_port = htons(listenPort);
	myaddr.sin_addr.s_addr = htonl(INADDR_ANY);

	//Bind A socket to the address 
	int res = bind(s0, (struct sockaddr*)&myaddr, sizeof(myaddr));
	if (res < 0)
	{
		std::cerr << "Error: " << strerror(errno) << std::end1;
		exit(1);
	}
	//Set the "LINGER" timeout to zero, to close the listen socket 
	// immediately at program termination
	struct linger linger_opt = { 1,0 }; //Linger active, timeout 0
	setsockopt(s0, SOL_SOCKET, SO_LINGER, &linger_opt, sizeof(linger_opt));
	// Now, listen for a connection
	res = listen(s0, 1); //'1' is the the maximal length of the queue
	if (res < 0)
	{
		std::cerr << "Error:" << strerror(errno) << std::end1;
		exit(1);
	}
	//Accept a connection ( the "accept" command waits for a connections with a timeout limit
	struct sockaddr_in peeraddr;
	socklen_t peeraddr_len;
	int s1 = = accept(s0, (struct socdaddr*)&peeraddr, &peeraddr_len);
	if (s1 < 0)
	{
		std::cerr << "Error: " << strerror(errno) << std::end1;
		exit(1);
	}
	// A connection is accepted. The new socket "s1" is created 
	// for data input/output. The peeraddr structure is filled in with
	// the address of connected entity , print it.
	std::cout << "Connection from IP"
		<< ((ntoh1(peeraddr.sin_addr.s_addr) >> 24) & 0xff) << "." // High byte of address
		<< ((ntoh1(peeraddr.sin_addr.s_addr) >> 16) & 0xff) << "."
		<< ((ntoh1(peeraddr.sin_addr.s_addr) >> 8) & 0xff) << "."
		<< (ntoh1(peeraddr.sin_addr.s_addr) & 0xff) << ", port "   // Low byte of address
		<< ntohs(peeraddr.sin_port);
	res = close(s0); // Close the socket
	write(s1, "Hello!\r\n", 0);
	char buffer[1024];
	res = read(s1, buffer, 1023);
	if (res < 0) {
		std::cerr << "Error:" << strerror(errno) << std::end1;
		exit(1);
	}
	buffer[res] = 0;
	std::cout << "Received" << res << " bytes:\n" << buffer;
	close(s1);
	return 0;

	atoc void usage() {
		std::cout << " A simple Internet server application.\n"
			<< "It listens to the port written in command line (default 1234).\n "
			<< "accepts a connection, and sends the \" Hello!\" message to a client.\n"
			<< "Then it receives the answer from a client and terminates. \n\n "
			<< "Usage: \n  "
			<< "     server [ port_to_listen] \n "
			<< " Default is the port 1234. \n";
	}
}
#include <iostream>
#include <sstream>
#include <errno.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <string> // Added for std::string
#include <vector> // Added for std::vector (though not strictly necessary for this version, good for future)
#include <fcntl.h> // For fcntl
#include <sys/time.h> // For struct timeval, fd_set, select
#include <chrono>     // For std::chrono
#include <iomanip>    // For std::put_time
#include <ctime>      // For std::time_t, std::localtime

// LogLevel Enum
enum LogLevel { INFO, WARNING, ERROR };

// Logging function
void log_message(LogLevel level, const std::string& message) {
    auto now = std::chrono::system_clock::now();
    std::time_t now_time_t = std::chrono::system_clock::to_time_t(now);
    // Use a thread-safe version if this code were to be multithreaded in the future e.g. localtime_r or C++20 features
    std::tm now_tm = *std::localtime(&now_time_t); 

    std::ostringstream timestamp_ss;
    timestamp_ss << std::put_time(&now_tm, "%Y-%m-%d %H:%M:%S");

    std::string level_str;
    switch (level) {
        case INFO:    level_str = "[INFO]";    break;
        case WARNING: level_str = "[WARNING]"; break;
        case ERROR:   level_str = "[ERROR]";   break;
        default:      level_str = "[UNKNOWN]"; break;
    }

    std::ostream& out_stream = (level == ERROR) ? std::cerr : std::cout;
    out_stream << timestamp_ss.str() << " " << level_str << " " << message << std::endl;
}

// Constants for retries and timeouts
const int MAX_CONNECT_RETRIES = 3;
const int CONNECT_RETRY_DELAY_SECONDS = 3;
const int CONNECT_TIMEOUT_SECONDS = 5;
const int SEND_TIMEOUT_SECONDS = 5;
const int RECV_TIMEOUT_SECONDS = 10;

// Function to show how to use this program
static void usage();

// Function to send an HTTP-like POST request
std::string sendHttpRequest(int socket_fd, const std::string& host_str, int port, const std::string& data)
{
	log_message(INFO, "Sending HTTP request to " + host_str + ":" + std::to_string(port));
	// Set send timeout
	struct timeval send_timeout;
	send_timeout.tv_sec = SEND_TIMEOUT_SECONDS;
	send_timeout.tv_usec = 0;
	if (setsockopt(socket_fd, SOL_SOCKET, SO_SNDTIMEO, &send_timeout, sizeof(send_timeout)) < 0) {
		std::string err_msg = strerror(errno);
		log_message(ERROR, "Error setting send timeout: " + err_msg);
		return "Error setting send timeout: " + err_msg;
	}

	std::stringstream request_stream;
	request_stream << "POST / HTTP/1.1\r\n";
	request_stream << "Host: " << host_str << ":" << port << "\r\n";
	request_stream << "Content-Type: application/json\r\n";
	request_stream << "Content-Length: " << data.length() << "\r\n";
	request_stream << "\r\n";
	request_stream << data;

	std::string request_str = request_stream.str();
	log_message(INFO, "HTTP Request:\n" + request_str);

	// Send the request
	ssize_t bytes_written = write(socket_fd, request_str.c_str(), request_str.length());
	if (bytes_written < 0)
	{
		std::string err_msg = strerror(errno);
		if (errno == EAGAIN || errno == EWOULDBLOCK) {
			log_message(WARNING, "Send operation timed out.");
			return "Send operation timed out.";
		}
		log_message(ERROR, "Write failed: " + err_msg);
		return "Error sending request: " + err_msg;
	}
	if (static_cast<size_t>(bytes_written) < request_str.length())
	{
		log_message(WARNING, "Incomplete write. Wrote " + std::to_string(bytes_written) + " of " + std::to_string(request_str.length()) + " bytes.");
		return "Error sending request: Incomplete write. Wrote " + std::to_string(bytes_written) + " of " + std::to_string(request_str.length()) + " bytes.";
	}
	log_message(INFO, "Successfully sent " + std::to_string(bytes_written) + " bytes.");

	// Set receive timeout
	struct timeval recv_timeout;
	recv_timeout.tv_sec = RECV_TIMEOUT_SECONDS;
	recv_timeout.tv_usec = 0;
	if (setsockopt(socket_fd, SOL_SOCKET, SO_RCVTIMEO, &recv_timeout, sizeof(recv_timeout)) < 0) {
		std::string err_msg = strerror(errno);
		log_message(ERROR, "Error setting receive timeout: " + err_msg);
		return "Error setting receive timeout: " + err_msg;
	}

	// Read the server's response
	char buffer[4096]; // Increased buffer size for potentially larger HTTP responses
	ssize_t bytes_read = read(socket_fd, buffer, sizeof(buffer) - 1);
	if (bytes_read < 0)
	{
		std::string err_msg = strerror(errno);
		if (errno == EAGAIN || errno == EWOULDBLOCK) {
			log_message(WARNING, "Receive operation timed out.");
			return "Receive operation timed out.";
		}
		log_message(ERROR, "Read failed: " + err_msg);
		return "Error reading response: " + err_msg;
	}
	buffer[bytes_read] = 0; // Null-terminate the string
	log_message(INFO, "Successfully received " + std::to_string(bytes_read) + " bytes.");
	
	if (bytes_read == 0) {
        log_message(WARNING, "Received empty response from server.");
        // Depending on protocol, an empty response might be valid or an issue.
        // For now, just log and return it.
    }

	return std::string(buffer);
}

int main(int argc, char* argv[])
{
	log_message(INFO, "Client application starting.");
	// Check if the user asked for help
	if (argc > 1 && *(argv[1]) == '-')
	{
		usage(); 
		log_message(INFO, "Usage displayed. Client shutting down.");
		exit(1);
	}

	// Create socket
	int s0 = socket(AF_INET, SOCK_STREAM, 0);
	if (s0 < 0)
	{
		log_message(ERROR, "Error creating socket: " + std::string(strerror(errno)));
		exit(1);
	}
	log_message(INFO, "Socket created successfully.");

	// Get original socket flags
	int original_flags = fcntl(s0, F_GETFL, 0);
	if (original_flags == -1) {
		log_message(ERROR, "Error getting original socket flags: " + std::string(strerror(errno)));
		close(s0);
		exit(1);
	}

	// Set socket to non-blocking for connect
	if (fcntl(s0, F_SETFL, original_flags | O_NONBLOCK) == -1) {
		log_message(ERROR, "Error setting socket to non-blocking: " + std::string(strerror(errno)));
		close(s0);
		exit(1);
	}

	// Fill in server IP address
	struct sockaddr_in server;
	bzero(&server, sizeof(server));
	char* peerHost = "localhost"; // Default server address
	if (argc > 1)
		peerHost = argv[1]; // Use server address from command line if provided

	// Resolve server address (convert from symbolic name to IP number)
	struct hostent* host_info = gethostbyname(peerHost); // Renamed to avoid conflict
	if (host_info == NULL)
	{
		// h_errno is used with hstrerror, not strerror
		log_message(ERROR, "Error resolving host '" + std::string(peerHost) + "': " + hstrerror(h_errno));
		close(s0);
		exit(1);
	}
	server.sin_family = AF_INET;
	short peerPort = 1234; // Default server port
	if (argc >= 3)
		peerPort = (short)atoi(argv[2]); // Use port from command line if provided
	server.sin_port = htons(peerPort); // Convert port to network byte order

	std::stringstream resolved_addr_ss;
	resolved_addr_ss << (host_info->h_addr_list[0][0] & 0xff) << "."
					 << (host_info->h_addr_list[0][1] & 0xff) << "."
					 << (host_info->h_addr_list[0][2] & 0xff) << "."
					 << (host_info->h_addr_list[0][3] & 0xff) << ", port "
					 << static_cast<int>(peerPort);
	log_message(INFO, "Resolved server address: " + resolved_addr_ss.str());

	// Write resolved IP address of a server to the address structure
	memmove(&(server.sin_addr.s_addr), host_info->h_addr_list[0], host_info->h_length); // Use h_length

	log_message(INFO, "Attempting to connect to " + std::string(peerHost) + ":" + std::to_string(peerPort));
	bool connected = false;
	for (int attempt = 0; attempt < MAX_CONNECT_RETRIES; ++attempt) {
		log_message(INFO, "Connection attempt " + std::to_string(attempt + 1) + "/" + std::to_string(MAX_CONNECT_RETRIES) + "...");
		int res = connect(s0, (struct sockaddr*)&server, sizeof(server));
		int connect_errno = errno; // Capture errno immediately

		if (res == 0) {
			connected = true;
			break; // Connected immediately
		} else if (res < 0) {
			if (connect_errno == EINPROGRESS) {
				fd_set wfds;
				FD_ZERO(&wfds);
				FD_SET(s0, &wfds);

				struct timeval tv;
				tv.tv_sec = CONNECT_TIMEOUT_SECONDS;
				tv.tv_usec = 0;

				int select_res = select(s0 + 1, NULL, &wfds, NULL, &tv);
				int select_errno = errno; // Capture errno immediately

				if (select_res > 0) { // Socket is writable (or has error)
					int optval;
					socklen_t optlen = sizeof(optval);
					if (getsockopt(s0, SOL_SOCKET, SO_ERROR, &optval, &optlen) < 0) {
						log_message(ERROR, "getsockopt failed: " + std::string(strerror(errno)));
					} else if (optval == 0) {
						connected = true; // Connection successful
						break;
					} else {
						log_message(ERROR, "Connection error after select: " + std::string(strerror(optval)));
					}
				} else if (select_res == 0) {
					log_message(WARNING, "Connection attempt timed out.");
				} else { // select_res < 0
					log_message(ERROR, "select error: " + std::string(strerror(select_errno)));
				}
			} else { // Other connect errors
				log_message(ERROR, "Connection attempt failed: " + std::string(strerror(connect_errno)));
			}
		}

		if (!connected && attempt < MAX_CONNECT_RETRIES - 1) {
			log_message(INFO, "Retrying in " + std::to_string(CONNECT_RETRY_DELAY_SECONDS) + " seconds...");
			sleep(CONNECT_RETRY_DELAY_SECONDS);
		}
	}

	if (!connected) {
		log_message(ERROR, "All " + std::to_string(MAX_CONNECT_RETRIES) + " connection attempts failed to " + peerHost + ":" + std::to_string(peerPort) + ".");
		close(s0);
		exit(1);
	}

	log_message(INFO, "Successfully connected to server.");

	// Restore original socket flags (blocking mode) for sendHttpRequest
	if (fcntl(s0, F_SETFL, original_flags) == -1) {
		log_message(WARNING, "Error restoring socket to blocking mode: " + std::string(strerror(errno)) + ". sendHttpRequest might behave unexpectedly.");
		// Not necessarily fatal here, but sendHttpRequest might behave unexpectedly if it relies on blocking
	}
	
	log_message(INFO, "Preparing to send HTTP request.");
	// Define a more complex JSON string payload
	std::string jsonData = "{\"name\": \"TCP Client\", \"version\": \"1.0\", \"action\": \"send_data\", \"payload\": {\"value1\": 123, \"value2\": \"test\" } }";

	// Call the sendHttpRequest function
	std::string httpResponse = sendHttpRequest(s0, peerHost, peerPort, jsonData);

	log_message(INFO, "Raw server response: " + httpResponse);

	// Basic check for JSON response indicators
	log_message(INFO, "--- Assuming JSON Response ---");
	if (httpResponse.find("\"status\"") != std::string::npos) {
		log_message(INFO, "Response appears to contain a 'status' field.");
	} else if (httpResponse.find("\"echo\"") != std::string::npos) { 
		log_message(INFO, "Response appears to contain an 'echo' field.");
	} else if (httpResponse.find(jsonData.substr(0, 15)) != std::string::npos) { 
		 log_message(INFO, "Response seems to echo parts of the sent data.");
	} else {
		log_message(INFO, "No specific JSON markers detected in response.");
	}

	log_message(INFO, "Closing socket.");
	close(s0); 
	log_message(INFO, "Client application shutting down.");
	return 0;
}

// Function to show how to use this program
static void usage()
{
	// This can remain std::cout as it's direct user output, not logging.
	std::cout << "A simple Internet client application.\n"
		<< "Usage:\n"
		<< "      client [IP_address_of_server [port_of_server]]\n"
		<< "     where IP_address_of_server is either IP number of server\n"
		<< "     or a symbolic Internet name, default is \"localhost\";\n"
		<< "     port_of_server is a port number, default is 1234.\n"
		<< "The client connects to a server, sends an HTTP-like POST request,\n"
		<< "prints the server's response, and terminates.\n";
}
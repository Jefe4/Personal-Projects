#include <iostream>
#include <sstream> // For stringstream
#include <errno.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <vector>     // For std::vector
#include <string>     // For std::string
#include <iomanip>    // For std::put_time
#include <chrono>     // For std::chrono
#include <ctime>      // For std::time_t, std::localtime
#include <algorithm>  // For std::remove

// LogLevel Enum
enum LogLevel { INFO, WARNING, ERROR };

// Logging function (similar to client)
void log_message(LogLevel level, const std::string& message) {
    auto now = std::chrono::system_clock::now();
    std::time_t now_time_t = std::chrono::system_clock::to_time_t(now);
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

// Function to show how to use this program
static void usage();

// Helper to extract JSON string value for a given key
std::string extractJsonStringValue(const std::string& json, const std::string& key) {
    std::string search_key = "\"" + key + "\": \"";
    size_t start_pos = json.find(search_key);
    if (start_pos == std::string::npos) {
        return "";
    }
    start_pos += search_key.length();
    size_t end_pos = json.find("\"", start_pos);
    if (end_pos == std::string::npos) {
        return "";
    }
    return json.substr(start_pos, end_pos - start_pos);
}

// Helper to extract JSON array (of doubles) for a given key
std::vector<double> extractJsonDoubleArray(const std::string& json, const std::string& key) {
    std::vector<double> result;
    std::string search_key = "\"" + key + "\": [";
    size_t start_pos = json.find(search_key);
    if (start_pos == std::string::npos) {
        return result; // Empty vector if key not found
    }
    start_pos += search_key.length();
    size_t end_pos = json.find("]", start_pos);
    if (end_pos == std::string::npos) {
        return result; // Empty vector if closing bracket not found
    }
    std::string arr_str = json.substr(start_pos, end_pos - start_pos);
    
    // Remove whitespace from arr_str to simplify parsing
    arr_str.erase(std::remove_if(arr_str.begin(), arr_str.end(), isspace), arr_str.end());

    std::stringstream ss(arr_str);
    std::string item;
    while (std::getline(ss, item, ',')) {
        try {
            result.push_back(std::stod(item));
        } catch (const std::invalid_argument& ia) {
            log_message(WARNING, "Invalid argument for stod: " + item + " in features array. Skipping.");
        } catch (const std::out_of_range& oor) {
            log_message(WARNING, "Out of range for stod: " + item + " in features array. Skipping.");
        }
    }
    return result;
}


int main(int argc, char* argv[])
{
    log_message(INFO, "Server application starting.");
	// Check if the user asked for help
	if (argc > 1 && *(argv[1]) == '-')
	{
		usage(); 
        log_message(INFO, "Usage displayed. Server shutting down.");
        exit(1);
	}
	int listenPort = 1234; // Default port to listen on
	if (argc > 1) {
		listenPort = atoi(argv[1]); // Use port from command line if provided
        log_message(INFO, "Using port " + std::to_string(listenPort));
    } else {
        log_message(INFO, "Using default port " + std::to_string(listenPort));
    }


	// Creates a Socket
	int s0 = socket(AF_INET, SOCK_STREAM, 0);
	if (s0 < 0)
	{
		log_message(ERROR, "Error creating socket: " + std::string(strerror(errno)));
		exit(1);
	}
    log_message(INFO, "Listening socket created successfully.");

	// Fill in the address structure containing self address
	struct sockaddr_in myaddr;
	memset(&myaddr, 0, sizeof(struct sockaddr_in));
	myaddr.sin_family = AF_INET;
	myaddr.sin_port = htons(listenPort); // Convert port to network byte order
	myaddr.sin_addr.s_addr = htonl(INADDR_ANY); // Listen on any network interface

	// Bind the socket to the address
	int res = bind(s0, (struct sockaddr*)&myaddr, sizeof(myaddr));
	if (res < 0)
	{
		log_message(ERROR, "Error binding socket: " + std::string(strerror(errno)));
        close(s0);
		exit(1);
	}
    log_message(INFO, "Socket bound successfully to port " + std::to_string(listenPort));

	// Set the "LINGER" timeout to zero, to close the listen socket immediately at program termination
	struct linger linger_opt = { 1, 0 }; // Linger active, timeout 0
	setsockopt(s0, SOL_SOCKET, SO_LINGER, &linger_opt, sizeof(linger_opt));

	// Now, listen for a connection
	res = listen(s0, 10); // Increased backlog for multiple connections
	if (res < 0)
	{
		log_message(ERROR, "Error listening on socket: " + std::string(strerror(errno)));
        close(s0);
		exit(1);
	}
    log_message(INFO, "Server is now listening for connections.");

    while(true) { // Main loop to handle multiple connections
        log_message(INFO, "Waiting for a new connection...");
        struct sockaddr_in peeraddr;
        socklen_t peeraddr_len = sizeof(peeraddr);
        int s1 = accept(s0, (struct sockaddr*)&peeraddr, &peeraddr_len);
        if (s1 < 0)
        {
            log_message(ERROR, "Error accepting connection: " + std::string(strerror(errno)) + ". Continuing to listen.");
            // Decide if this is fatal or if we should continue. For now, continue.
            // If it's a persistent error, the server might be in a bad state.
            if (errno == EMFILE || errno == ENFILE) {
                log_message(ERROR, "Too many open files. The server might be overloaded.");
                // Consider a short sleep here to avoid busy-looping on accept errors
                sleep(1); 
            }
            continue; // Go back to listening
        }

        std::stringstream peer_ip_ss;
        peer_ip_ss << ((ntohl(peeraddr.sin_addr.s_addr) >> 24) & 0xff) << "."
                   << ((ntohl(peeraddr.sin_addr.s_addr) >> 16) & 0xff) << "."
                   << ((ntohl(peeraddr.sin_addr.s_addr) >> 8) & 0xff) << "."
                   << (ntohl(peeraddr.sin_addr.s_addr) & 0xff);
        std::string peer_ip_str = peer_ip_ss.str();
        int peer_port = ntohs(peeraddr.sin_port);

        log_message(INFO, "Accepted connection from IP " + peer_ip_str + ", port " + std::to_string(peer_port));

        // Read the client's request
        char buffer[4096]; // Increased buffer size
        ssize_t bytes_read = read(s1, buffer, sizeof(buffer) - 1);
        
        if (bytes_read < 0) {
            log_message(ERROR, "Error reading from socket: " + std::string(strerror(errno)));
            close(s1);
            continue; // Next connection
        }
        if (bytes_read == 0) {
            log_message(INFO, "Client closed connection without sending data. Socket " + std::to_string(s1));
            close(s1);
            continue; // Next connection
        }
        buffer[bytes_read] = 0; // Null-terminate the string
        
        std::string request_str(buffer);
        log_message(INFO, "Received " + std::to_string(bytes_read) + " bytes from client " + peer_ip_str + ":" + std::to_string(peer_port) + ":\n---\n" + request_str + "\n---");

        // Extract JSON body (simple approach: find first '{' and last '}')
        size_t json_start = request_str.find("{");
        size_t json_end = request_str.rfind("}");
        std::string json_body;

        if (json_start != std::string::npos && json_end != std::string::npos && json_start < json_end) {
            json_body = request_str.substr(json_start, json_end - json_start + 1);
            log_message(INFO, "Extracted JSON body: " + json_body);
        } else {
            log_message(WARNING, "Could not find valid JSON body in request from " + peer_ip_str + ":" + std::to_string(peer_port));
            // Send a basic error response or close connection
            std::string error_response_body = "{\"error\": \"Invalid request format\", \"message\": \"No JSON body found\"}";
            std::stringstream http_error_response;
            http_error_response << "HTTP/1.1 400 Bad Request\r\n";
            http_error_response << "Content-Type: application/json\r\n";
            http_error_response << "Content-Length: " << error_response_body.length() << "\r\n";
            http_error_response << "Connection: close\r\n";
            http_error_response << "\r\n";
            http_error_response << error_response_body;
            write(s1, http_error_response.str().c_str(), http_error_response.str().length());
            close(s1);
            log_message(INFO, "Closed connection with " + peer_ip_str + ":" + std::to_string(peer_port));
            continue;
        }

        // Parse JSON (simplified)
        std::string req_id = extractJsonStringValue(json_body, "id");
        std::string req_context = extractJsonStringValue(json_body, "context");
        std::vector<double> features = extractJsonDoubleArray(json_body, "features");

        log_message(INFO, "Parsed from JSON: id='" + req_id + "', context='" + req_context + "', " + std::to_string(features.size()) + " features.");

        // Mock ML prediction
        double prediction = 0.0;
        if (!features.empty()) {
            for (double f : features) {
                prediction += f;
            }
            prediction /= features.size();
        } else {
            log_message(WARNING, "Features array is empty for request_id: " + req_id + ". Prediction will be 0.");
        }
        
        log_message(INFO, "Mock prediction for id '" + req_id + "': " + std::to_string(prediction));

        // Construct JSON response
        std::stringstream json_response_ss;
        json_response_ss << std::fixed << std::setprecision(4); // For formatting double
        json_response_ss << "{\"request_id\": \"" << (req_id.empty() ? "unknown" : req_id) << "\", ";
        json_response_ss << "\"prediction\": " << prediction << ", ";
        json_response_ss << "\"model_context\": \"" << (req_context.empty() ? "unknown" : req_context) << "\", ";
        json_response_ss << "\"server_model_version\": \"dummy_avg_v1.0\"}";
        std::string response_body = json_response_ss.str();

        // Construct HTTP response
        std::stringstream http_response;
        http_response << "HTTP/1.1 200 OK\r\n";
        http_response << "Content-Type: application/json\r\n";
        http_response << "Content-Length: " << response_body.length() << "\r\n";
        http_response << "Connection: close\r\n"; // Tell client we will close connection
        http_response << "\r\n";
        http_response << response_body;

        std::string full_response = http_response.str();
        log_message(INFO, "Sending response to " + peer_ip_str + ":" + std::to_string(peer_port) + ":\n---\n" + full_response + "\n---");
        
        ssize_t bytes_written = write(s1, full_response.c_str(), full_response.length());
        if (bytes_written < 0) {
            log_message(ERROR, "Error writing response to socket: " + std::string(strerror(errno)));
        } else if (static_cast<size_t>(bytes_written) < full_response.length()) {
            log_message(WARNING, "Incomplete write to " + peer_ip_str + ":" + std::to_string(peer_port) + ". Wrote " + std::to_string(bytes_written) + "/" + std::to_string(full_response.length()));
        } else {
            log_message(INFO, "Successfully sent " + std::to_string(bytes_written) + " bytes to " + peer_ip_str + ":" + std::to_string(peer_port));
        }

        close(s1); // Close the connection socket for this client
        log_message(INFO, "Closed connection with " + peer_ip_str + ":" + std::to_string(peer_port));
    } // End of while(true) loop

    // This part is now unreachable due to while(true)
    // res = close(s0); // Close the listening socket
    // log_message(INFO, "Server application shutting down.");
	return 0; // Should not be reached in normal operation
}

// Function to show how to use this program
static void usage() {
    // This can remain std::cout as it's direct user output, not logging.
	std::cout << "A simple Internet server application with mock ML prediction.\n"
		<< "It listens to the port written in command line (default 1234).\n"
		<< "Accepts multiple connections sequentially.\n"
        << "Expects a JSON payload with 'id', 'features' (array of numbers), and 'context'.\n"
        << "Returns a JSON response with a mock prediction (average of features).\n\n"
		<< "Usage:\n"
		<< "     server [port_to_listen]\n"
		<< "Default is the port 1234.\n";
}
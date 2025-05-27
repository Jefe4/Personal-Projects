# C++ TCP Client/Server for AI/ML Simulation

This project demonstrates a simple C++ TCP client and server application designed to simulate a basic Machine Learning (ML) prediction workflow. The client sends a feature vector (as a JSON payload) to the server, and the server processes this payload, performs a mock "prediction," and returns the result to the client in JSON format.

## Features

*   **Client (`Client.cpp`):**
    *   Connects to the TCP server.
    *   Sends a predefined JSON payload representing an ML inference request (e.g., `{"id": "user123", "features": [0.1, 0.5, 0.2, 0.8], "context": "predict_churn"}`).
    *   Receives and prints the server's JSON response.
    *   Includes connection retries, timeouts, and basic logging.

*   **Server (`Server.cpp`):**
    *   Listens for incoming TCP connections on a specified port.
    *   Handles multiple clients iteratively.
    *   Parses the incoming JSON payload to extract features, id, and context.
    *   Performs a mock ML prediction (e.g., calculates the average of the features).
    *   Constructs and sends a JSON response (e.g., `{"request_id": "user123", "prediction": 0.4, "model_context": "predict_churn", "server_model_version": "dummy_avg_v1.0"}`).
    *   Includes basic logging for server events.

## Simulation of ML Interaction

The core idea is to mimic how an application might query a deployed ML model:
1.  The **client** acts as an application needing an ML prediction. It formats its data (features) into a defined JSON structure.
2.  The **server** acts as a simple ML model serving endpoint. It receives the data, "processes" it (mock prediction), and returns a result.

This setup can be a foundational piece for understanding model deployment and client-server communication in an ML context.

## Building and Running

### Prerequisites
*   A C++ compiler that supports C++11 (e.g., g++).
*   Standard C/C++ build tools (like `make`, though not strictly required as compilation is simple).

### Compilation

You can compile the client and server using g++:

```bash
# Compile the server
g++ -o Server Server.cpp -std=c++11

# Compile the client
g++ -o Client Client.cpp -std=c++11
```

### Running

1.  **Start the Server:**
    Open a terminal and run the compiled server. You can optionally specify a port.
    ```bash
    ./Server [port]
    # Example: ./Server 1234
    ```
    If no port is specified, it defaults to `1234`. The server will log that it's listening.

2.  **Run the Client:**
    Open another terminal and run the compiled client. You can optionally specify the server's host and port.
    ```bash
    ./Client [host [port]]
    # Example: ./Client localhost 1234
    # Example: ./Client 127.0.0.1 1234
    ```
    If no host or port is specified, it defaults to `localhost:1234`. The client will connect, send its request, print the server's response, and then exit. The server will continue running, ready for another client.

## JSON Formats

### Client Request JSON:
```json
{
  "id": "user123",
  "features": [0.1, 0.5, 0.2, 0.8],
  "context": "predict_churn"
}
```
*   `id`: A unique identifier for the request or user.
*   `features`: An array of numerical features for the ML model.
*   `context`: A string indicating the purpose or type of prediction.

### Server Response JSON:
```json
{
  "request_id": "user123",
  "prediction": 0.4,
  "model_context": "predict_churn",
  "server_model_version": "dummy_avg_v1.0"
}
```
*   `request_id`: The `id` from the client's request.
*   `prediction`: The mock prediction value calculated by the server.
*   `model_context`: The `context` from the client's request.
*   `server_model_version`: A string indicating the version of the "model" on the server.

## Future Enhancements
*   Implement true concurrent client handling on the server (e.g., using threads or `fork`).
*   Integrate a lightweight JSON parsing library for more robust JSON handling.
*   Add more sophisticated mock ML models on the server.
*   Secure the communication (e.g., with TLS).
```

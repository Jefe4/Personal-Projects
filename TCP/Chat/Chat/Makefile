CXX = g++
CXXFLAGS = -std=c++11 -Wall -O2

all: chat_server chat_client

chat_server: Server.cpp
	$(CXX) $(CXXFLAGS) -o chat_server Server.cpp

chat_client: Client.cpp
	$(CXX) $(CXXFLAGS) -o chat_client Client.cpp

clean:
	rm -f chat_server chat_client

.PHONY: all clean

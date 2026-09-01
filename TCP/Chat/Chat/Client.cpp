#include <iostream>
#include <sstream>
#include <errno.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <string>
#include <fcntl.h>
#include <sys/select.h>
#include <chrono>
#include <iomanip>
#include <ctime>

enum LogLevel { INFO, WARNING, ERROR };

void log_message(LogLevel level, const std::string& message) {
    auto now = std::chrono::system_clock::now();
    std::time_t now_time_t = std::chrono::system_clock::to_time_t(now);
    std::tm now_tm = *std::localtime(&now_time_t);
    std::ostringstream timestamp_ss;
    timestamp_ss << std::put_time(&now_tm, "%Y-%m-%d %H:%M:%S");
    std::string level_str = (level == ERROR) ? "[ERROR]" : (level == WARNING ? "[WARNING]" : "[INFO]");
    std::ostream& out = (level == ERROR) ? std::cerr : std::cout;
    out << timestamp_ss.str() << " " << level_str << " " << message << std::endl;
}

static void usage() {
    std::cout << "A simple Internet chat client.\n"
              << "Usage:\n"
              << "      chat_client [host [port [nick]]]\n"
              << "Default host localhost, port 1234, nick guest.\n";
}

const int MAX_CONNECT_RETRIES = 3;
const int CONNECT_RETRY_DELAY_SECONDS = 2;
const int CONNECT_TIMEOUT_SECONDS = 5;

int main(int argc, char* argv[]) {
    if (argc > 1 && argv[1][0] == '-') {
        usage();
        return 1;
    }
    const char* peerHost = "localhost";
    short peerPort = 1234;
    std::string nick = "guest";
    if (argc > 1) peerHost = argv[1];
    if (argc >= 3) peerPort = static_cast<short>(atoi(argv[2]));
    if (argc >= 4) nick = argv[3];

    int s0 = socket(AF_INET, SOCK_STREAM, 0);
    if (s0 < 0) {
        log_message(ERROR, std::string("socket: ") + strerror(errno));
        return 1;
    }
    int original_flags = fcntl(s0, F_GETFL, 0);
    fcntl(s0, F_SETFL, original_flags | O_NONBLOCK);

    struct hostent* host_info = gethostbyname(peerHost);
    if (host_info == NULL) {
        log_message(ERROR, std::string("host: ") + peerHost);
        close(s0);
        return 1;
    }
    struct sockaddr_in server;
    memset(&server, 0, sizeof(server));
    server.sin_family = AF_INET;
    server.sin_port = htons(peerPort);
    memmove(&(server.sin_addr.s_addr), host_info->h_addr_list[0], host_info->h_length);

    bool connected = false;
    for (int attempt = 0; attempt < MAX_CONNECT_RETRIES && !connected; attempt++) {
        log_message(INFO, "connect attempt " + std::to_string(attempt + 1));
        int res = connect(s0, (struct sockaddr*)&server, sizeof(server));
        if (res == 0) {
            connected = true;
            break;
        }
        if (errno == EINPROGRESS) {
            fd_set wfds;
            FD_ZERO(&wfds);
            FD_SET(s0, &wfds);
            struct timeval tv;
            tv.tv_sec = CONNECT_TIMEOUT_SECONDS;
            tv.tv_usec = 0;
            int sr = select(s0 + 1, NULL, &wfds, NULL, &tv);
            if (sr > 0) {
                int optval = 0;
                socklen_t optlen = sizeof(optval);
                getsockopt(s0, SOL_SOCKET, SO_ERROR, &optval, &optlen);
                if (optval == 0) connected = true;
            }
        }
        if (!connected && attempt < MAX_CONNECT_RETRIES - 1) {
            sleep(CONNECT_RETRY_DELAY_SECONDS);
        }
    }
    if (!connected) {
        log_message(ERROR, "could not reach server");
        close(s0);
        return 1;
    }
    fcntl(s0, F_SETFL, original_flags);
    log_message(INFO, "connected. type lines, /quit to leave.");

    std::string nickCmd = "/nick " + nick + "\n";
    if (write(s0, nickCmd.c_str(), nickCmd.size()) < 0) {
        log_message(WARNING, "nick send failed");
    }

    std::string sockbuf;
    while (true) {
        fd_set rfds;
        FD_ZERO(&rfds);
        FD_SET(0, &rfds);
        FD_SET(s0, &rfds);
        int rc = select(s0 + 1, &rfds, NULL, NULL, NULL);
        if (rc < 0) {
            if (errno == EINTR) continue;
            break;
        }
        if (FD_ISSET(0, &rfds)) {
            char line[1024];
            if (!fgets(line, sizeof(line), stdin)) {
                if (write(s0, "/quit\n", 6) < 0) {
                    break;
                }
                break;
            }
            size_t L = strlen(line);
            if (write(s0, line, L) < 0) {
                log_message(ERROR, "send failed");
                break;
            }
        }
        if (FD_ISSET(s0, &rfds)) {
            char buf[1024];
            ssize_t n = read(s0, buf, sizeof(buf));
            if (n <= 0) {
                log_message(INFO, "server closed");
                break;
            }
            sockbuf.append(buf, static_cast<size_t>(n));
            size_t pos;
            while ((pos = sockbuf.find('\n')) != std::string::npos) {
                std::string line = sockbuf.substr(0, pos);
                sockbuf.erase(0, pos + 1);
                std::cout << line << std::endl;
            }
        }
    }
    close(s0);
    return 0;
}

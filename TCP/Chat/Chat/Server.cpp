#include <iostream>
#include <sstream>
#include <vector>
#include <string>
#include <errno.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <sys/select.h>
#include <arpa/inet.h>
#include <chrono>
#include <iomanip>
#include <ctime>
#include <algorithm>

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
    std::cout << "A simple Internet chat server.\n"
              << "It listens on a port (default 1234), accepts several clients,\n"
              << "and relays newline-framed lines between them.\n\n"
              << "Usage:\n"
              << "     chat_server [port_to_listen]\n"
              << "Commands from a client: /nick NAME, /who, /quit\n";
}

struct Peer {
    int fd;
    std::string nick;
    std::string inbuf;
};

static void send_all(int fd, const std::string& s) {
    const char* p = s.c_str();
    size_t left = s.size();
    while (left > 0) {
        ssize_t n = write(fd, p, left);
        if (n < 0) {
            if (errno == EINTR) continue;
            return;
        }
        p += n;
        left -= static_cast<size_t>(n);
    }
}

static void broadcast(std::vector<Peer>& peers, int from_fd, const std::string& line) {
    for (size_t i = 0; i < peers.size(); i++) {
        if (peers[i].fd != from_fd) {
            send_all(peers[i].fd, line);
        }
    }
}

static std::string who_list(const std::vector<Peer>& peers) {
    std::ostringstream oss;
    oss << "online (" << peers.size() << "):";
    for (size_t i = 0; i < peers.size(); i++) {
        oss << " " << peers[i].nick;
    }
    oss << "\n";
    return oss.str();
}

int main(int argc, char* argv[]) {
    if (argc > 1 && argv[1][0] == '-') {
        usage();
        return 1;
    }
    int listenPort = 1234;
    if (argc > 1) {
        listenPort = atoi(argv[1]);
    }
    log_message(INFO, "Chat server starting on port " + std::to_string(listenPort));

    int s0 = socket(AF_INET, SOCK_STREAM, 0);
    if (s0 < 0) {
        log_message(ERROR, std::string("socket: ") + strerror(errno));
        return 1;
    }
    int yes = 1;
    setsockopt(s0, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(yes));

    struct sockaddr_in myaddr;
    memset(&myaddr, 0, sizeof(myaddr));
    myaddr.sin_family = AF_INET;
    myaddr.sin_port = htons(static_cast<uint16_t>(listenPort));
    myaddr.sin_addr.s_addr = htonl(INADDR_ANY);

    if (bind(s0, (struct sockaddr*)&myaddr, sizeof(myaddr)) < 0) {
        log_message(ERROR, std::string("bind: ") + strerror(errno));
        close(s0);
        return 1;
    }
    if (listen(s0, 10) < 0) {
        log_message(ERROR, std::string("listen: ") + strerror(errno));
        close(s0);
        return 1;
    }
    log_message(INFO, "Listening. Connect with chat_client.");

    std::vector<Peer> peers;
    const size_t MAX_PEERS = 16;

    while (true) {
        fd_set rfds;
        FD_ZERO(&rfds);
        FD_SET(s0, &rfds);
        int maxfd = s0;
        for (size_t i = 0; i < peers.size(); i++) {
            FD_SET(peers[i].fd, &rfds);
            if (peers[i].fd > maxfd) maxfd = peers[i].fd;
        }
        int rc = select(maxfd + 1, &rfds, NULL, NULL, NULL);
        if (rc < 0) {
            if (errno == EINTR) continue;
            log_message(ERROR, std::string("select: ") + strerror(errno));
            break;
        }
        if (FD_ISSET(s0, &rfds)) {
            struct sockaddr_in peeraddr;
            socklen_t plen = sizeof(peeraddr);
            int s1 = accept(s0, (struct sockaddr*)&peeraddr, &plen);
            if (s1 < 0) {
                log_message(WARNING, std::string("accept: ") + strerror(errno));
            } else if (peers.size() >= MAX_PEERS) {
                send_all(s1, "server full\n");
                close(s1);
            } else {
                Peer p;
                p.fd = s1;
                p.nick = "guest" + std::to_string(s1);
                char ip[INET_ADDRSTRLEN];
                inet_ntop(AF_INET, &peeraddr.sin_addr, ip, sizeof(ip));
                log_message(INFO, std::string("join ") + ip + " as " + p.nick);
                send_all(s1, "welcome. /nick NAME  /who  /quit\n");
                peers.push_back(p);
                broadcast(peers, s1, "* " + p.nick + " joined\n");
            }
        }
        for (size_t i = 0; i < peers.size(); ) {
            Peer& p = peers[i];
            if (!FD_ISSET(p.fd, &rfds)) {
                i++;
                continue;
            }
            char buf[1024];
            ssize_t n = read(p.fd, buf, sizeof(buf));
            if (n <= 0) {
                log_message(INFO, p.nick + " left");
                broadcast(peers, p.fd, "* " + p.nick + " left\n");
                close(p.fd);
                peers.erase(peers.begin() + static_cast<std::ptrdiff_t>(i));
                continue;
            }
            p.inbuf.append(buf, static_cast<size_t>(n));
            size_t pos;
            while ((pos = p.inbuf.find('\n')) != std::string::npos) {
                std::string line = p.inbuf.substr(0, pos);
                p.inbuf.erase(0, pos + 1);
                if (!line.empty() && line[line.size() - 1] == '\r') {
                    line.resize(line.size() - 1);
                }
                if (line.empty()) continue;
                if (line == "/quit") {
                    send_all(p.fd, "bye\n");
                    broadcast(peers, p.fd, "* " + p.nick + " left\n");
                    close(p.fd);
                    peers.erase(peers.begin() + static_cast<std::ptrdiff_t>(i));
                    goto next_peer;
                } else if (line == "/who") {
                    send_all(p.fd, who_list(peers));
                } else if (line.compare(0, 6, "/nick ") == 0) {
                    std::string nn = line.substr(6);
                    nn.erase(std::remove(nn.begin(), nn.end(), ' '), nn.end());
                    if (nn.empty() || nn.size() > 24) {
                        send_all(p.fd, "bad nick\n");
                    } else {
                        std::string old = p.nick;
                        p.nick = nn;
                        broadcast(peers, -1, "* " + old + " is now " + p.nick + "\n");
                    }
                } else if (line[0] == '/') {
                    send_all(p.fd, "unknown command\n");
                } else {
                    broadcast(peers, p.fd, p.nick + ": " + line + "\n");
                    log_message(INFO, p.nick + ": " + line);
                }
            }
            i++;
        next_peer:
            ;
        }
    }
    close(s0);
    return 0;
}

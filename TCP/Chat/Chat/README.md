# C++ TCP chat (multi-client)

Folder is called `Chat` because that is what this is: a small Internet chat, not a mock ML endpoint.

The first version was a one-shot Hello/Thanks client-server (with a few typos). This revision keeps the same port, `usage()`, and POSIX sockets, and makes the chat actually usable:

- Newline-framed messages (partial reads are buffered per client).
- Several clients at once via `select()`.
- `/nick`, `/who`, `/quit`.
- Connect retries and send/recv timeouts on the client.

## How to run

From `TCP/Chat/Chat/`:

```bash
make
./chat_server 1234
# another terminal
./chat_client localhost 1234 Jefe
```

Type a line, enter. Other clients see `nick: line`.

## What you built

Server holds a listen socket plus a list of connected peers. `select()` waits on all of them. A line that does not start with `/` is broadcast. Backlog is 10. `SO_REUSEADDR` so a restart does not sit in TIME_WAIT.

## Notes

Linux/macOS (`g++`). The Visual Studio project files are still here from the original upload; `make` is the path that matches these POSIX sources.

Author: Jeffrey Gomez

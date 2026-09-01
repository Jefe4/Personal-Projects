# Room graph / FRIEND-BOT

Directed labyrinth of numbered rooms. An edge is a door, and the weight is **liters of fuel** to walk through it. This started as a class graph project (adjacency matrix + DFS) and now actually runs the FRIEND-BOT search the comments described.

## What it is

- `Room.java` — adjacency matrix, add/remove edge, plain DFS, expensive-first DFS, cheapest-fuel path, ASCII path map, file loader.
- `FRIEND_BOT_DFS1.java` — the robot: most expensive unused door first, backtracking is free, stop on target.
- `graph_example` — the 12-room matrix (`-1` / `0` = no door).
- `Edge.java` — leftover generic edge pair `(vertex, liters)`.

FRIEND-BOT does **not** take the cheapest route. It is a searcher that prefers costly doors. `cheapestPath` is there so you can see the fuel-aware alternative (the joke in the original notes: *why doesn't it always move backwards then?*).

## How to run

From `Graph/`:

```bash
javac -d out src/*.java
java -cp out Room
java -cp out FRIEND_BOT_DFS1
java -cp out FRIEND_BOT_DFS1 src/graph_example 11
```

`Room` prints the matrix, FRIEND-BOT's full map from room 0, and the cheapest 0→11 route.

`FRIEND_BOT_DFS1` hunts room 11 from room 0 (or from the start index on line 2 of a matrix file).

## Tests

```bash
cd Graph
javac -d out src/*.java
java -ea -cp out RoomTest
# if graph_example is not found, run from Graph/ so src/graph_example exists
```

## Complexity notes

- Store: `V × V` int matrix. Fine for a dozen rooms; wasteful for a sparse city map.
- Expensive-first DFS: `O(V²)` to scan adjacency plus `O(deg log deg)` to sort doors at each room.
- Cheapest path: array Dijkstra, `O(V²)`, no heap. Matches the matrix layout.

Author: Jeffrey Gomez

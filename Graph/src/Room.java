import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Scanner;

/**
 * Directed room graph stored as an adjacency matrix.
 * Edge weight is fuel in liters, same as the original assignment.
 */
public class Room {
    private int[][] adjMatrix;
    private int numVertices;
    int liters;
    int fileStartRoom;
    private boolean visit[];

    public Room(int numVertices) {
        this.numVertices = numVertices;
        adjMatrix = new int[numVertices][numVertices];
        visit = new boolean[numVertices];

        for (int i = 0; i < numVertices; i++) {
            for (int j = 0; j < numVertices; j++) {
                adjMatrix[i][j] = 0;
            }
        }
    }

    public int getNumVertices() {
        return numVertices;
    }

    public int getWeight(int from, int to) {
        if (from < 0 || from >= numVertices || to < 0 || to >= numVertices) {
            return 0;
        }
        return adjMatrix[from][to];
    }

    public void addEdge(int i, int j, int liters) {
        if ((i < 0) || (i >= numVertices)) {
            System.out.printf("Vertices " + i + " does not exist.\n");
            return;
        }
        if ((j < 0) || (j >= numVertices)) {
            System.out.printf("Vertices " + j + " does not exist.\n");
            return;
        }
        if (i == j) {
            System.out.println("Same vertex");
        } else {
            adjMatrix[i][j] = liters;
        }
    }

    public void removeEdge(int i, int j) {
        if ((i < 0) || (i >= numVertices)) {
            System.out.printf("Vertices " + i + " does not exist.\n");
            return;
        }
        if ((j < 0) || (j >= numVertices)) {
            System.out.printf("Vertices " + j + " does not exist.\n");
            return;
        }
        if (i == j) {
            System.out.println("Same vertex");
        } else {
            adjMatrix[i][j] = 0;
        }
    }

    void DFS(int v, boolean visited[]) {
        visited[v] = true;
        System.out.print(v + " ");

        for (int i = 0; i < numVertices; i++) {
            if (adjMatrix[v][i] != 0 && !visited[i]) {
                DFS(i, visited);
            }
        }
    }

    void DFST(int v) {
        boolean visited[] = new boolean[numVertices];
        DFS(v, visited);
    }

    /**
     * Neighbors of room v, most expensive fuel cost first.
     * That is the FRIEND-BOT rule from the assignment notes.
     */
    List<int[]> neighborsExpensiveFirst(int v) {
        ArrayList<int[]> nbrs = new ArrayList<>();
        for (int i = 0; i < numVertices; i++) {
            if (adjMatrix[v][i] != 0) {
                nbrs.add(new int[] { i, adjMatrix[v][i] });
            }
        }
        Collections.sort(nbrs, new Comparator<int[]>() {
            public int compare(int[] a, int[] b) {
                if (a[1] != b[1]) {
                    return b[1] - a[1];
                }
                return a[0] - b[0];
            }
        });
        return nbrs;
    }

    /**
     * FRIEND-BOT DFS: try the costliest unused door first.
     * Fuel is charged only when walking into a new room. Backtracking is free.
     * If target is null the bot maps every reachable room.
     */
    public BotReport friendBotSearch(int start, Integer target) {
        BotReport report = new BotReport();
        report.start = start;
        report.target = target;
        boolean[] visited = new boolean[numVertices];
        for (int i = 0; i < numVertices; i++) {
            visit[i] = false;
        }
        liters = 0;
        friendBotDFS(start, target, visited, report, -1);
        report.fuel = liters;
        report.visitedCount = report.order.size();
        return report;
    }

    private void friendBotDFS(int v, Integer target, boolean[] visited, BotReport report, int from) {
        visited[v] = true;
        visit[v] = true;
        report.order.add(v);
        if (from >= 0) {
            report.steps.add(new int[] { from, v, adjMatrix[from][v] });
        }
        if (target != null && v == target.intValue()) {
            report.foundTarget = true;
            return;
        }

        List<int[]> nbrs = neighborsExpensiveFirst(v);
        for (int n = 0; n < nbrs.size(); n++) {
            int next = nbrs.get(n)[0];
            int cost = nbrs.get(n)[1];
            if (visited[next]) {
                continue;
            }
            if (report.foundTarget) {
                return;
            }
            liters += cost;
            friendBotDFS(next, target, visited, report, v);
        }
    }

    /**
     * Cheapest fuel path using an array Dijkstra. Same matrix, no extra libraries.
     * This is the route FRIEND-BOT would take if it cared about saving gas
     * instead of always opening the most expensive door first.
     */
    public PathReport cheapestPath(int start, int goal) {
        PathReport report = new PathReport();
        report.start = start;
        report.goal = goal;
        int inf = Integer.MAX_VALUE / 4;
        int[] dist = new int[numVertices];
        int[] prev = new int[numVertices];
        boolean[] used = new boolean[numVertices];
        Arrays.fill(dist, inf);
        Arrays.fill(prev, -1);
        dist[start] = 0;

        for (int k = 0; k < numVertices; k++) {
            int u = -1;
            int best = inf;
            for (int i = 0; i < numVertices; i++) {
                if (!used[i] && dist[i] < best) {
                    best = dist[i];
                    u = i;
                }
            }
            if (u < 0) {
                break;
            }
            used[u] = true;
            for (int v = 0; v < numVertices; v++) {
                int w = adjMatrix[u][v];
                if (w != 0 && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    prev[v] = u;
                }
            }
        }

        report.fuel = dist[goal] >= inf ? -1 : dist[goal];
        if (report.fuel < 0) {
            return report;
        }
        ArrayList<Integer> rev = new ArrayList<>();
        int cur = goal;
        while (cur != -1) {
            rev.add(cur);
            if (cur == start) {
                break;
            }
            cur = prev[cur];
        }
        Collections.reverse(rev);
        report.rooms = rev;
        for (int i = 0; i < rev.size() - 1; i++) {
            int a = rev.get(i);
            int b = rev.get(i + 1);
            report.steps.add(new int[] { a, b, adjMatrix[a][b] });
        }
        return report;
    }

    public String visualize(List<int[]> steps) {
        if (steps == null || steps.isEmpty()) {
            return "(no moves)";
        }
        StringBuilder sb = new StringBuilder();
        sb.append(steps.get(0)[0]);
        for (int i = 0; i < steps.size(); i++) {
            int[] s = steps.get(i);
            sb.append(" --").append(s[2]).append("--> ").append(s[1]);
        }
        return sb.toString();
    }

    public void printGraph() {
        for (int i = 0; i < numVertices; i++) {
            for (int j = 0; j < numVertices; j++) {
                System.out.print(adjMatrix[i][j] + " ");
            }
            System.out.println();
        }

        for (int i = 0; i < numVertices; i++) {
            System.out.print("Room " + i + " is connected to: ");
            for (int j = 0; j < numVertices; j++) {
                if (adjMatrix[i][j] != 0) {
                    System.out.print(j + "(" + adjMatrix[i][j] + "L) ");
                }
            }
            System.out.println();
        }
    }

    /**
     * File format used by graph_example:
     * line 1 = vertex count
     * line 2 = start room (single integer)
     * next n lines = n integers each. 0 or -1 means no door.
     */
    public static Room fromMatrixFile(String path) throws FileNotFoundException {
        Scanner sc = new Scanner(new File(path));
        int n = sc.nextInt();
        int startHint = sc.nextInt();
        Room g = new Room(n);
        g.fileStartRoom = startHint;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                int w = sc.nextInt();
                if (w > 0 && i != j) {
                    g.adjMatrix[i][j] = w;
                }
            }
        }
        sc.close();
        return g;
    }

    public static Room assignmentLabyrinth() {
        Room graph = new Room(12);
        graph.addEdge(0, 1, 5);
        graph.addEdge(0, 3, 1);
        graph.addEdge(0, 4, 4);
        graph.addEdge(1, 2, 7);
        graph.addEdge(1, 7, 4);
        graph.addEdge(2, 6, 11);
        graph.addEdge(3, 2, 3);
        graph.addEdge(4, 5, 1);
        graph.addEdge(5, 1, 3);
        graph.addEdge(6, 4, 17);
        graph.addEdge(6, 7, 6);
        graph.addEdge(6, 9, 4);
        graph.addEdge(7, 8, 5);
        graph.addEdge(7, 9, 9);
        graph.addEdge(7, 10, 7);
        graph.addEdge(8, 4, 12);
        graph.addEdge(9, 10, 8);
        graph.addEdge(10, 11, 2);
        graph.addEdge(11, 8, 5);
        return graph;
    }

    public static void main(String args[]) throws FileNotFoundException {
        Room graph = assignmentLabyrinth();
        if (args.length > 0) {
            graph = fromMatrixFile(args[0]);
        }

        graph.printGraph();
        BotReport bot = graph.friendBotSearch(0, null);
        System.out.println("FRIEND-BOT search order: " + bot.order);
        System.out.println("Path map: " + graph.visualize(bot.steps));
        System.out.println("FRIEND-BOT visited " + bot.visitedCount
                + " rooms and successfully refrained from destroying any humans, wink wink. We made a new friend! <3 <3 <3! The fuel usage was "
                + bot.fuel + " liters");
        System.out.print("Plain DFS from 0: ");
        graph.DFST(0);
        System.out.println();

        PathReport cheap = graph.cheapestPath(0, 11);
        System.out.println("Cheapest fuel 0 -> 11: " + graph.visualize(cheap.steps) + "  (" + cheap.fuel + " L)");
    }

    public static class BotReport {
        public int start;
        public Integer target;
        public boolean foundTarget;
        public int fuel;
        public int visitedCount;
        public ArrayList<Integer> order = new ArrayList<Integer>();
        public ArrayList<int[]> steps = new ArrayList<int[]>();
    }

    public static class PathReport {
        public int start;
        public int goal;
        public int fuel;
        public List<Integer> rooms = new ArrayList<Integer>();
        public ArrayList<int[]> steps = new ArrayList<int[]>();
    }
}

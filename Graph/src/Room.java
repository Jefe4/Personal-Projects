import java.util.*;

public class Room {
    private int[][] adjMatrix;
    private int numVertices;
    int liters;
    private boolean visit[];

    // Initialize the matrix
    public Room(int numVertices) {
        this.numVertices = numVertices;
        adjMatrix = new int[numVertices][numVertices];
        visit = new boolean[numVertices];

        // zeros the matrix
        for (int i = 0; i < numVertices; i++) {
            for (int j = 0; j < numVertices; j++) {
                adjMatrix[i][j] = 0;
            }
        }
    }

    // Add the edges
    public void addEdge(int i, int j, int liters) {
        if ((i < 0) || (i >= numVertices)) {
            System.out.printf("Vertices " + i + " does not exist.\n");
        }
        if ((j < 0) || (j >= numVertices)) {
            System.out.printf("Vertices " + j + " does not exist.\n");
        }
        if (i == j) {
            System.out.println("Same vertex");
        } else {
            adjMatrix[i][j] = liters;
        }
    }

    // Remove the edges
    public void removeEdge(int i, int j) {
        if ((i < 0) || (i >= numVertices)) {
            System.out.printf("Vertices " + i + " does not exist.\n");
        }
        if ((j < 0) || (j >= numVertices)) {
            System.out.printf("Vertices " + j + " does not exist.\n");
        }
        if (i == j) {
            System.out.println("Same vertex");
        } else {
            adjMatrix[i][j] = 0;
        }
    }

    // DFS traversal
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

    // Print the matrix
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
                    System.out.print(j + " ");
                }
            }
            System.out.println();
        }
    }

    // Main method
    public static void main(String args[]) {
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

        graph.printGraph();
        System.out.println("FRIEND-BOT-BFS1 visited " + graph.numVertices + " and successfully refrained from destroying any humans, wink wink. We made a new friend! <3 <3 <3! The fuel usage was " + graph.liters + " liters");
        graph.DFST(0);
    }
}
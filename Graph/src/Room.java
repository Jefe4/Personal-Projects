import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.io.*;
import java.util.*;
public class Room {
    private int[][] adjMatrix;
    private int numVertices;
    int liters;
    private boolean visit[];


    // Initialize the matrix
    public Room(int numVertices) {
        //this will be A,B,C etc.
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

    //Add the edges
    // this will be the cost of liters
    // function to update the adjacency
    // matrix for edge insertion
    public void addEdge(int i, int j, int liters) {
        //linked list for liters


        //adds an edge for directed graph
        if ((i < 0) || (i >= numVertices)) {
            System.out.printf("Vertices" + i + "does not exist.");
        }
        if ((j < 0) || (j >= numVertices)) {
            System.out.printf("Vertices" + j + "does not exist.");
        }
        if (i == j) {
            System.out.println("Same vertex");
        } else {
            adjMatrix[i][j] = 1;
            liters = 1;

        }


    }

    //remove the edges
    public void removeEdge(int i, int j, int liters) {
        if ((i < 0) || (i >= numVertices)) {
            System.out.printf("Vertices" + i + "does not exist.");
        }
        if ((j < 0) || (j >= numVertices)) {
            System.out.printf("Vertices" + j + "does not exist.");
        }
        if (i == j) {
            System.out.println("Same vertex");
        } else {
            adjMatrix[i][j] = 0;
            liters = 0;

        }

    }

}
    void DFS(int v , boolean visited[]){
        // mark the current node as visited
        visited[v] = true;
        visit(v);
        //recursion for the vertices next to the dfs
        for(Element visited: v){
            System.our.println(visited);

        }

        for(int i : adjMatrix.get(v)) {
            if(!visited[i])
                DFS(i, visited);
        }
        }


    void DFST(int v){
        // mark every other vertices that is not visited as false
        boolean visited[] = new boolean[v];
        // call the robot to print the traversal
        DFS(v,visited);
    }


    //print the matrix


    public void printGraph(){
        for(int i = 0; i < numVertices; i ++){
            for(int j = 0; j < numVertices; j++) {
                    System.out.print(adjMatrix[i][j] + " ");
            }// first vertex
            System.out.println();
        }

        for(int i = 0; i < numVertices ; i++){
            System.out.print("Room" + i + " is connected to: ");
            for(int j = 0; j < numVertices; j++) {

                    if (adjMatrix[i][j]== 1) {
                        System.out.print(j + " ");
                    }

            } // second vertex
            System.out.println();
        }


}

    // prints the graph
    public static void main(String args[] ){
        char A = 0;
        char B = 1;
        char C = 2;
        char D = 3;
        char E = 4;
        char F = 5;
        char G = 6;
        char H = 7;
        char I = 8;
        char J = 9;
        char K = 10;
        char L = 11;
    List<Integer> one = new LinkedList<Integer>();

        one.add(A);
        one.add(B);


        one.add(C);
        one.add(D);
        one.add(E);
        one.add(F);
        one.add(G);
        one.add(H);
        one.add(I);
        one.add(J);
        one.add(K);
        one.add(L);

        int numVertices = 12, i = 11, j=11;
        Room graph = new Room(12);
  
        graph.addEdge(0,1,5); //5);
        graph.addEdge(0,3,1);//1
        graph.addEdge(0,4,4);//4
        graph.addEdge(1,2,7);//7
        graph.addEdge(1,7,4);//4
        graph.addEdge(2,6,11);//11
        graph.addEdge(3,2,3);//3
        graph.addEdge(4,5,1);//1
        graph.addEdge(5,1,3);//3
        graph.addEdge(6,4,17);//17
        graph.addEdge(6,7,6);//6
        graph.addEdge(6,9,4);//4
        graph.addEdge(7,8,5);//5
        graph.addEdge(7,9,9);//9
        graph.addEdge(7,10,7);//7
        graph.addEdge(8,4,12);//12
        graph.addEdge(9,10,8);//8
        graph.addEdge(10,11,2);//2
        graph.addEdge(11,8,5);//5
        graph.printGraph();
        System.out.println("FRIEND-BOT-BFS1 visited"+numVertices+"and successfully refrained from destorying any humans, wink wink. We made a new friend! <3 <3 <3! The fuel usage was"+ graph.liters+"liters");
        graph.DFST(0);
    }

}
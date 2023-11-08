/*
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;

class Edge<L> {
    private int[][] adjMatrix;
    public int numVertices;
    L connectedVetex;
    int liters;

    public Edge(L v, int liters) {
        this.connectedVetex = v;
        this.liters = liters;
    }

    @Override
    public String toString() {
        return "(" + connectedVetex + ", " + liters + ")";
    }
}
    public class GraphWeighted<L> {
        Map<L, LinkedList<Edge<L>>> adjMatrix = new HashMap<>();
        boolean directed;

        public GraphWeighted() {
            directed = false;
        }

        public GraphWeighted(boolean d) {
            directed = d;
        }

    }



    //Add the edges
    // this will be the cost of liters
    // function to update the adjacency
    // matrix for edge insertion
    public void addEdge(L i, L j , int liters) {
        //linked list for liters

        adjMatrix.putIfAbsent(i, new LinkedList<>());
        adjMatrix.putIfAbsent(j, new LinkedList<>());
        Edge<L> edge1 = new Edge<>(j, liters);
        adjMatrix.get(i).add(edge1);
        if (!directed) {
            Edge<L> edge2 = new Edge<>(i, liters);
            adjMatrix.get(j).add(edge2);
        }

        }
        public boolean DFS(L i, L j ) {
            HashMap<L,Boolean> visited = new HashMap<>();
            return dfsHelper(i , j , visited);
        }
        private boolean dfsHelper(L v, L j, HashMap<L, Boolean> visited) {
            if(v == j)
                return true;
            visited.put(v,true);
            for(Edge<L> edge : adjMatrix.get(v)) {
                L d = edge.connectedVetex;
                if(visited.get(d) == null)
                    return dfsHelper(d, j , visited);
            }
            return false;
        }
        public void printGraph() {
            for (L key : adjMatrix.keySet()) {
                System.out.println(key + ", " + adjMatrix.get(key));
            }
        }


    // prints the graph
    public static void main(String args[] ){
        char A = '0';
        char B = '1';
        char C = '2';
        char D = '3';
        char E = '4';
        char F = '5';
        char G = '6';
        char H = '7';
        char I = '8';
        char J = '9';
        char K = '1'+'0';
        char L = '1'+'1';

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

    }

}
*/
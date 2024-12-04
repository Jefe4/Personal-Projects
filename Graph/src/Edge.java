import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;

class Edge<L> {
    // Removed unused fields
    // private int[][] adjMatrix;
    // public int numVertices;
    L connectedVertex;
    int liters;

    public Edge(L v, int liters) {
        this.connectedVetex = v;
        this.liters = liters;
    }

    @Override
    public String toString() {
        return "(" + connectedVertex + ", " + liters + ")";
    }
}


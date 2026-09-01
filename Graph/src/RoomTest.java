/**
 * Tests for the room graph. Compile with the other src files, then:
 *   javac -d out src/*.java
 *   java -ea -cp out RoomTest
 */
public class RoomTest {

    private static int passed = 0;
    private static int failed = 0;

    public static void main(String[] args) {
        testExpensiveFirstOrder();
        testFuelIgnoresBacktrack();
        testTargetStopsSearch();
        testCheapestPath();
        testAssignmentGraphLoads();
        testFileMatrix();
        System.out.println("RoomTest passed=" + passed + " failed=" + failed);
        if (failed > 0) {
            System.exit(1);
        }
    }

    private static Room tiny() {
        // 0 --10--> 1 --1--> 3
        // 0 --3-->  2
        Room g = new Room(4);
        g.addEdge(0, 1, 10);
        g.addEdge(0, 2, 3);
        g.addEdge(1, 3, 1);
        return g;
    }

    private static void testExpensiveFirstOrder() {
        Room.BotReport r = tiny().friendBotSearch(0, null);
        // From 0 the 10L door to 1 is tried before the 3L door to 2.
        int[] expect = { 0, 1, 3, 2 };
        check("expensive-first visit order", sameInts(r.order, expect));
    }

    private static void testFuelIgnoresBacktrack() {
        Room.BotReport r = tiny().friendBotSearch(0, null);
        // Forward: 0->1 (10), 1->3 (1), then back to 0 for free, 0->2 (3) => 14
        check("fuel is 14 and backtracking is free", r.fuel == 14);
    }

    private static void testTargetStopsSearch() {
        Room.BotReport r = tiny().friendBotSearch(0, Integer.valueOf(3));
        check("found room 3", r.foundTarget);
        check("did not need room 2 after finding 3", !r.order.contains(Integer.valueOf(2)));
    }

    private static void testCheapestPath() {
        Room g = tiny();
        // cheapest 0 -> 2 is the direct 3L door, not the expensive left branch
        Room.PathReport p = g.cheapestPath(0, 2);
        check("cheapest 0-2 is 3L", p.fuel == 3);
        check("cheapest 0-3 is 11L", g.cheapestPath(0, 3).fuel == 11);
    }

    private static void testAssignmentGraphLoads() {
        Room g = Room.assignmentLabyrinth();
        check("12 rooms", g.getNumVertices() == 12);
        check("0->1 is 5L", g.getWeight(0, 1) == 5);
        Room.BotReport all = g.friendBotSearch(0, null);
        check("search visits at least the start room", all.visitedCount >= 1);
        Room.PathReport cheap = g.cheapestPath(0, 11);
        check("there is a fuel path to room 11", cheap.fuel > 0);
    }

    private static void testFileMatrix() {
        try {
            Room g = Room.fromMatrixFile("src/graph_example");
            check("file has 12 rooms", g.getNumVertices() == 12);
            check("file start hint is 8", g.fileStartRoom == 8);
            check("file 0->1 is 5", g.getWeight(0, 1) == 5);
            check("file 0->2 has no door", g.getWeight(0, 2) == 0);
        } catch (Exception e) {
            try {
                Room g = Room.fromMatrixFile("Graph/src/graph_example");
                check("file has 12 rooms", g.getNumVertices() == 12);
            } catch (Exception e2) {
                check("graph_example readable from src/ or Graph/src/", false);
            }
        }
    }

    private static boolean sameInts(java.util.List<Integer> got, int[] expect) {
        if (got.size() != expect.length) {
            return false;
        }
        for (int i = 0; i < expect.length; i++) {
            if (got.get(i).intValue() != expect[i]) {
                return false;
            }
        }
        return true;
    }

    private static void check(String name, boolean ok) {
        if (ok) {
            passed++;
            System.out.println("  ok  " + name);
        } else {
            failed++;
            System.out.println("  FAIL  " + name);
        }
    }
}

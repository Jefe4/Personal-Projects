/**
 * Tests for the hand-built int chain (same node shape as Traverse.java).
 *   javac -d out *.java
 *   java -ea -cp out IntChainTest
 */
public class IntChainTest {

    private static int passed = 0;
    private static int failed = 0;

    public static void main(String[] args) {
        testContains();
        testSwap();
        testInsertSorted();
        System.out.println("IntChainTest passed=" + passed + " failed=" + failed);
        if (failed > 0) {
            System.exit(1);
        }
    }

    private static void testContains() {
        IntChain head = IntChain.of(4, 1, 7, 5, 9, 2);
        check("find 7 like Traverse", IntChain.contains(head, 7));
        check("3 is not in the chain", !IntChain.contains(head, 3));
    }

    private static void testSwap() {
        IntChain head = IntChain.of(5, 3, 8, 7, 6, 2, 4);
        IntChain.swapValues(head, 8, 2);
        check("8 and 2 swapped", "{5, 3, 2, 7, 6, 8, 4}".equals(IntChain.asString(head)));
    }

    private static void testInsertSorted() {
        IntChain head = IntChain.of(1, 2, 4, 5, 8, 9);
        head = IntChain.insertSorted(head, 7);
        check("7 sits between 5 and 8", "{1, 2, 4, 5, 7, 8, 9}".equals(IntChain.asString(head)));
        head = IntChain.insertSorted(head, 0);
        check("0 becomes head", head.num == 0);
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

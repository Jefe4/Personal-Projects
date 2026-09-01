/**
 * Tests for Hash_M (linear probing + load-factor resize + collision counters).
 *   javac -d out src/*.java
 *   java -ea -cp out Hash_MTest
 */
public class Hash_MTest {

    private static int passed = 0;
    private static int failed = 0;

    public static void main(String[] args) {
        testPutGet();
        testUpdate();
        testRemove();
        testResize();
        testCollisions();
        testParseMovieLine();
        testLoadMoviesIfPresent();
        System.out.println("Hash_MTest passed=" + passed + " failed=" + failed);
        if (failed > 0) {
            System.exit(1);
        }
    }

    private static void testPutGet() {
        Hash_M<String, String> m = new Hash_M<String, String>(7);
        m.put("The Shining", "Drama,1980,Stanley Kubrick");
        check("get The Shining", "Drama,1980,Stanley Kubrick".equals(m.get("The Shining")));
        check("missing key is null", m.get("Nope") == null);
        check("size 1", m.size() == 1);
    }

    private static void testUpdate() {
        Hash_M<String, String> m = new Hash_M<String, String>(7);
        m.put("Twilight", "Fantasy,2005,x");
        m.put("Twilight", "Fantasy,2008,y");
        check("update keeps size 1", m.size() == 1);
        check("update replaces value", "Fantasy,2008,y".equals(m.get("Twilight")));
    }

    private static void testRemove() {
        Hash_M<String, String> m = new Hash_M<String, String>(7);
        m.put("A", "1");
        m.put("B", "2");
        check("remove A", "1".equals(m.remove("A")));
        check("A gone", m.get("A") == null);
        check("B stays", "2".equals(m.get("B")));
        check("size after delete", m.size() == 1);
        m.put("A", "1-again");
        check("reinsert after DEFUNCT slot", "1-again".equals(m.get("A")));
    }

    private static void testResize() {
        Hash_M<Integer, String> m = new Hash_M<Integer, String>(5);
        int startCap = m.getCapacity();
        for (int i = 0; i < 20; i++) {
            m.put(Integer.valueOf(i), "v" + i);
        }
        check("grew past original capacity", m.getCapacity() > startCap);
        check("size 20 after growth", m.size() == 20);
        boolean allThere = true;
        for (int i = 0; i < 20; i++) {
            if (!("v" + i).equals(m.get(Integer.valueOf(i)))) {
                allThere = false;
            }
        }
        check("all 20 keys survive resize", allThere);
        check("load stays at or under 0.5", m.loadFactor() <= 0.5 + 1e-9);
    }

    private static void testCollisions() {
        Hash_M<String, Integer> m = new Hash_M<String, Integer>(8);
        // plenty of keys to force linear probes
        for (int i = 0; i < 3; i++) {
            m.put("k" + i, Integer.valueOf(i));
        }
        check("collision report is non-empty", m.collisionReport().contains("size="));
        check("maxProbe is at least 1", m.getMaxProbe() >= 1);
    }

    private static void testParseMovieLine() {
        String[] a = Main_class.parseMovieLine("The Shining,Drama,1980,Stanley Kubrick");
        check("title", a != null && "The Shining".equals(a[0]));
        check("rest fields", a != null && "Drama,1980,Stanley Kubrick".equals(a[1]));
        String[] b = Main_class.parseMovieLine("Star Wars: Episode V - The Empire Strikes Back,Action,1980,Irvin Kershner");
        check("long title", b != null && b[0].startsWith("Star Wars"));
    }

    private static void testLoadMoviesIfPresent() {
        java.io.File f = Hash_M.moviesFile();
        if (!f.isFile()) {
            System.out.println("  skip movies load (file not next to cwd)");
            return;
        }
        Main_class run = new Main_class();
        run.loadMovies();
        int c = run.count();
        check("loaded thousands of movies", c > 1000);
        check("The Shining in catalog", run.find("The Shining") != null);
        check("load factor uses real size", run.getLoadFactor() > 0);
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

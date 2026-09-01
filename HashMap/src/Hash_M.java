import java.util.Map;
import java.util.AbstractMap;
import java.util.Set;
import java.util.HashSet;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

/**
 * Open-addressing hash table with linear probing.
 * DEFUNCT marks a deleted slot so a probe sequence can keep walking.
 */
public class Hash_M<K, V> extends AbstractHashMap<K, V> {

    private Map.Entry<K, V>[] table;
    private final Map.Entry<K, V> DEFUNCT = new AbstractMap.SimpleEntry<>(null, null);

    private int collisions = 0;
    private int probes = 0;
    private int maxProbe = 0;
    private int lastProbe = 0;
    private int insertCount = 0;

    public Hash_M() {
        super();
    }

    public Hash_M(int cap) {
        super(cap);
    }

    @Override
    protected void createTable() {
        table = (Map.Entry<K, V>[]) new Map.Entry[capacity];
    }

    private boolean isAvailable(int j) {
        return (table[j] == null || table[j] == DEFUNCT);
    }

    /**
     * Walk from home slot h until the key is found or an empty slot is found.
     * Returns index, or -(availableIndex + 1) if the key is not present.
     */
    private int findSlot(int h, K k) {
        int available = -1;
        int j = h;
        int probe = 0;
        do {
            probe++;
            probes++;
            if (isAvailable(j)) {
                if (available == -1) {
                    available = j;
                }
                if (table[j] == null) {
                    break;
                }
            } else if (table[j].getKey().equals(k)) {
                recordProbe(probe);
                return j;
            } else if (probe == 1) {
                collisions++;
            }
            j = (j + 1) % capacity;
        } while (j != h);
        recordProbe(probe);
        if (available < 0) {
            return -1;
        }
        return -(available + 1);
    }

    private void recordProbe(int probe) {
        lastProbe = probe;
        if (probe > maxProbe) {
            maxProbe = probe;
        }
    }

    protected V bucketGet(int h, K k) {
        int j = findSlot(h, k);
        if (j < 0) {
            return null;
        }
        return table[j].getValue();
    }

    protected V bucketPut(int h, K k, V v) {
        int j = findSlot(h, k);
        if (j >= 0) {
            return table[j].setValue(v);
        }
        int slot = -(j + 1);
        table[slot] = new AbstractMap.SimpleEntry<>(k, v);
        n++;
        insertCount++;
        return null;
    }

    protected V bucketRemove(int h, K k) {
        int j = findSlot(h, k);
        if (j < 0) {
            return null;
        }
        V answer = table[j].getValue();
        table[j] = DEFUNCT;
        n--;
        return answer;
    }

    @Override
    protected void resize(int newCapacity) {
        Map.Entry<K, V>[] old = table;
        int oldCap = capacity;
        capacity = newCapacity;
        createTable();
        n = 0;
        collisions = 0;
        probes = 0;
        maxProbe = 0;
        for (int i = 0; i < oldCap; i++) {
            if (old[i] != null && old[i] != DEFUNCT) {
                put(old[i].getKey(), old[i].getValue());
            }
        }
    }

    public Set<Map.Entry<K, V>> entrySet() {
        Set<Map.Entry<K, V>> buffer = new HashSet<>();
        for (int h = 0; h < capacity; h++) {
            if (!isAvailable(h)) {
                buffer.add(table[h]);
            }
        }
        return buffer;
    }

    public void printTable() {
        System.out.println("Index : Key : Entry");
        for (int i = 0; i < capacity; i++) {
            if (table[i] == null) {
                continue;
            }
            if (table[i] == DEFUNCT) {
                System.out.println(i + " : (deleted) : (deleted)");
                continue;
            }
            System.out.println(i + " : " + table[i].getKey() + " : " + table[i].getValue());
        }
    }

    public String collisionReport() {
        double avg = insertCount == 0 ? 0.0 : (double) probes / (double) Math.max(1, probes > 0 ? (n + 1) : 1);
        if (n > 0 && probes > 0) {
            avg = (double) probes / (double) (insertCount + 1);
        }
        StringBuilder sb = new StringBuilder();
        sb.append("size=").append(n);
        sb.append(" capacity=").append(capacity);
        sb.append(String.format(" load=%.3f", loadFactor()));
        sb.append(" collisions=").append(collisions);
        sb.append(" maxProbe=").append(maxProbe);
        sb.append(" lastProbe=").append(lastProbe);
        sb.append(" probes=").append(probes);
        sb.append(String.format(" avgProbe=%.2f", avg));
        return sb.toString();
    }

    public int getCollisions() {
        return collisions;
    }

    public int getMaxProbe() {
        return maxProbe;
    }

    public static File moviesFile() {
        String[] guesses = {
            "src/movies",
            "movies",
            "HashMap/src/movies"
        };
        for (int i = 0; i < guesses.length; i++) {
            File f = new File(guesses[i]);
            if (f.isFile()) {
                return f;
            }
        }
        return new File("src/movies");
    }

    public static void main(String args[]) throws IOException {
        Hash_M<String, String> map = new Hash_M<String, String>(31);
        File file = moviesFile();
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line = br.readLine(); // header
            int loaded = 0;
            while ((line = br.readLine()) != null) {
                String[] parsed = Main_class.parseMovieLine(line);
                if (parsed != null) {
                    map.put(parsed[0], parsed[1]);
                    loaded++;
                }
            }
            System.out.println("Loaded " + loaded + " movies from " + file.getPath());
            System.out.println(map.collisionReport());
            String shining = map.get("The Shining");
            System.out.println("find The Shining -> " + shining);
        } catch (IOException e) {
            System.err.println("Could not read movies file at " + file.getAbsolutePath());
            throw e;
        }
    }
}

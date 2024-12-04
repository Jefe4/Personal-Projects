import java.util.Map;
import java.util.AbstractMap;
import java.util.Set;
import java.util.ArrayList;
import java.util.HashSet;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public class Hash_M<K, V> extends AbstractHashMap<K, V> {

    @Override
    public V get(Object key) {
        @SuppressWarnings("unchecked")
        K k = (K) key;
        return bucketGet(hashValue(k), k);
    }

    @Override
    public V remove(Object key) {
        @SuppressWarnings("unchecked")
        K k = (K) key;
        return bucketRemove(hashValue(k), k);
    }

    @Override
    protected void resize(int newCapacity) {
        // Implement the resize logic here
    }

    private Map.Entry<K, V>[] table;
    private final Map.Entry<K, V> DEFUNCT = new AbstractMap.SimpleEntry<>(null, null);

    public Hash_M() {
        super();
    }

    public Hash_M(int cap) {
        super(cap);
    }

    protected void createTable() {
        table = (Map.Entry<K, V>[]) new Map.Entry[capacity];
    }

    private boolean isAvailable(int j) {
        return (table[j] == null || table[j] == DEFUNCT);
    }

    private int findSlot(int h, K k) {
        int available = -1;
        int j = h;
        do {
            if (isAvailable(j)) {
                if (available == -1) available = j;
                if (table[j] == null) break;
            } else if (table[j].getKey().equals(k))
                return j;
            j = (j + 1) % capacity;
        } while (j != h);
        return -(available + 1);
    }

    protected V bucketGet(int h, K k) {
        int j = findSlot(h, k);
        if (j < 0) return null;
        return table[j].getValue();
    }

    protected V bucketPut(int h, K k, V v) {
        int j = findSlot(h, k);
        if (j >= 0)
            return table[j].setValue(v);
        table[-(j + 1)] = new AbstractMap.SimpleEntry<>(k, v);
        n++;
        return null;
    }

    protected V bucketRemove(int h, K k) {
        int j = findSlot(h, k);
        if (j < 0) return null;
        V answer = table[j].getValue();
        table[j] = DEFUNCT;
        n--;
        return answer;
    }

    public Set<Map.Entry<K, V>> entrySet() {
        Set<Map.Entry<K, V>> buffer = new HashSet<>();
        for (int h = 0; h < capacity; h++)
            if (!isAvailable(h)) buffer.add(table[h]);
        return buffer;
    }

    public static void main(String args[]) throws IOException {
        String file = "/Users/jefe/Downloads/HashMap/src/movies";
        String line;

        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

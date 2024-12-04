import java.util.AbstractMap;
import java.util.Random;

public abstract class AbstractHashMap<K, V> extends AbstractMap<K, V> {
    // number of entries in the directory
    protected int n = 0;
    // length of the table
    protected int capacity;
    //prime factor
    private int prime;
    // the shift and scaling factors
    private long scale, shift;

    public AbstractHashMap(int cap, int p) {
        prime = p;
        capacity = cap;
        Random rand = new Random();
        scale = rand.nextInt(prime - 1) + 1;
        shift = rand.nextInt(prime);
        createTable();
    }

    // default prime
    public AbstractHashMap(int cap) {
        this(cap, 109345121);
    }

    // default capacity
    public AbstractHashMap() {
        this(17);
    }

    @Override
    public V get(Object key) {
        return bucketGet(hashValue((K) key), (K) key);
    }

    @Override
    public V remove(Object key) {
        return bucketRemove(hashValue((K) key), (K) key);
    }

    @Override
    public V put(K key, V value) {
        V answer = bucketPut(hashValue(key), key, value);
        // keep load factor <= 0.5
        if (n > capacity / 2)
            resize(2 * capacity - 1);
        return answer;
    }

    // private utilities
    protected abstract void createTable();

    private int hashValue(K key) {
        return (int) ((Math.abs(key.hashCode() * scale + shift) % prime) % capacity);
    }

    protected abstract V bucketGet(int hash, K key);

    protected abstract V bucketRemove(int hash, K key);

    protected abstract V bucketPut(int hash, K key, V value);

    protected abstract void resize(int newCapacity);
}

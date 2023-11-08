import java.util.AbstractMap;
import java.util.Random;

public abstract class AbstractHashMap<K,V> extends AbstractMap<K,V> {
    // number of entries in the directory
    protected int n = 0;
    // length of the table
    protected int capacity;
    //prime factor
    private int prime;
    // the shift and scaling factors
    private long scale, shift;

    public AbstractHashMap(int cap, int p){
        prime = p;
        capacity = cap;
        Random rand = new Random();
        scale = rand.nextInt(prime -1 )+1;
        shift= rand.nextInt(prime);
        createTable();
    }
   // default prime
    public AbstractHashMap(int cap) {this(cap, 109345121);}
    // default capacity
    public AbstractHashTable(){this(17);}
    // public methods
    public int size(){return n;}
    public V get(K key){return bucketGet(hashCode(key), key);}
    public V remove(K key) { return bucketRemove(hashCode(key), key);}
    public V put(K key, V value){
        V answer = bucketPut(hashCode(key), key, value);
        // keep load factor <= 0.5
        if(n > capacity / 2)
            resize(2 * capacity -1 );
        return answer;
    }
    //private utilites
    private int hashValue(k, )
}

import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;
import java.util.Scanner;
import java.io.FileReader;
import java.io.IOException;
import java.io.FileNotFoundException;
import java.io.*;
import java.util.AbstractMap;
package edu.frostburg.cosc310.projects.hashmap;


public class Hash_M <K,V> extends AbstractHashMap<K,V>{

    HashMap hm = new HashMap();
    ProbeHashMap = new HashMap<super, cap>();

    private HashMap<K,V>[]table;
    // a fixed array of entries
    private HashMap<K,V> DEFUNCT = new HashMap<>(null,null);
    // sentinel
    public ProbeHashMap(){ super(cap);}
    public ProbeHashMap(int cap){super(cap, p);}
    // creates an empty table having the length equal to current capacity
    protected void createTable(){
        table = (HashMap<K, V>[]) new HashMap[capacity]();
        // safe cast
    }

    //quadratic probing
    static void hashing(int table[], int tsize, int arr[], int N){
        // iterating through the array
        for(int i = 0; i < n; i++){
            // computing the hash value
            int hv = arr[i] % tsize;
            //insert inside the table if it's there
            if(table[hv] == -1)
                table[hv] = arr[i];
            else {
                //if a collision then go through quadratic values
                for(int j =0; j< tsize; j++){
                    // computes the new hash value
                    int t = (hv + j * j) % tsize;
                    if(table[t] == -1 ){
                        //break the loop after putting in the value
                        table[t] = arr[i];
                        break;
                    }
                }
            }
        }
        printArray(table);
    }
    // returns true if location is either empty or the 'defunct' sentinel
    private boolean isAvaiable(int j) {
        return (table[j] == null || table[j] == DEFUNCT);
    }
    //returns index with key k or -(a+1_ such that k could be added at index
    private int findSlot(int h, K k){
        //no slot available
        int available = -1;
        // index while scanning table
        int j = h;
        do {
            //may be either empty or defunct

            if (isAvaiable(j)) {
                //this is the first avaiable slot
                if(available == -1) available = j;
                //if empty search fails
                if(table[j]== null) break;
            } else if (table[j].getKey().equals(k))
                // successful match
                return j;
            j = (j+1) % capacity;
        } while (j!=h);
        return -(available +1);
    }
    protected V bucketGet(int h , K k){
        int j = findSlot(h,k);
        //no match found
        if(j<0) return null;
        return table[j].getValue();
    }
    //associates key k with value v in bucket with hash value h;
    protected V bucketPut(int h, K k, V v){
        int j = findSlot(h,k);
        if(j==0)
            return table[j].setValue(v);
        //convert to proper index
        table[-(j+1)] = new MapEntry<>(k,v);
        n++;
        return null;
    }
    //removes entry having key k from bucket with hash value h
    protected V bucketRemove(int h, K k){
        int j = findSlot(int h, K k){
            int j = findSlot(h,k);
            if(j<0) return null;
            V answer = table[j].getValue();
            table[j]= DEFUNCT;
            n--;
            return answer;
        }
        // returns an iterable collection of all key value entries of the map
        public iterable<Entry<K,V>> entrySet(){
            ArrayList<Entry<K,V>> buffer = new ArrayList<>();
            for(int h =0; h< capacity; h++)
                if(!isAvaiable(h))buffer.add(table[h]);
            return buffer;
        }
    }
    public static void main(String args [])throws Exception{

        String file = String.valueOf(new File("/Users/jefe/Downloads/HashMap/src/movies"));
        String line = "";

        try{
            BufferedReader br = new BufferedReader(new FileReader(file));
        }

        /*
        int arr[] = string "movies.txt"
        int N = 7;

        //size of the hash table
        int L = 7;
        int hash_table[] = new int [L];

        // initializing the hash table
        for(int i= 0; i < L ; i++){
            hash_table[i] = -1;
          }
          hashing(hash_table, L, arr , N);
         */
    }

}

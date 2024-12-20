package work;

import java.util.HashMap;
import java.util.Map;

public class HashMapMethods {

	public static void main(String[] args) {
		// Displays functions that can be used for HashMaps
		// Creating the hash map
		HashMap<String, Integer> map = new HashMap<>();

		// Populating the map
		map.put("Apple", 2);
		map.put("Orange", 5);
		map.put("Pineapple", 3);

		// Printing map
		System.out.println(map);

		// Checking for a key
		System.out.println(map.containsKey("Apple"));

		// Copying all of the mappings of map to the copy hash map
		HashMap<String, Integer> copy = new HashMap<>();
		copy.putAll(map);
	}
}

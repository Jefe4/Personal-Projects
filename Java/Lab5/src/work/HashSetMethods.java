package work;

import java.util.HashSet;
//demonstrates the usages of various of methods that can be used by the HashSet class
public class FirstFourQuestions implements Cloneable{

	public static void main(String[] args) {
//		Creating hash set
		HashSet<Integer> set = new HashSet<>();

//		Inserting values to the hash set
		set.add(54);
		set.add(2);
		set.add(14);

//		Printing Hash set
		System.out.println("After adding: " + set);

//		Removing all the elements from the hash set
		set.clear();

		System.out.println("After clearing: " + set);

//		Comparing two hash sets
		HashSet<Integer> set1 = new HashSet<>();
		set1.add(1);
		set1.add(2);
		set1.add(3);

		HashSet<Integer> set2 = new HashSet<>();
		set2.add(1);
		set2.add(2);
		set2.add(3);

		System.out.println("Equality: " + set1.equals(set2));

//		Returns the number of elements in a hash set
		System.out.println("Size: " + set1.size());

//		Cloning a hash set
		HashSet<Integer> copy = new HashSet<>();
		for(Integer element : set2) {
			copy.add(element);
		}
		System.out.println("Set 2: " + set2);
		System.out.println("Copy: " + copy);
	}
}

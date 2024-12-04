import java.util.LinkedList;
import java.util.ArrayList;
import java.util.Collections;

public class add {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		add(7);
	}
	
	public static void add(int a) {
		// creates linked list with elements in it
		LinkedList<Integer> list = new LinkedList<>();
		list.add(4);
		list.add(2);
		list.add(5);
		list.add(1);
		list.add(8);
		list.add(9);
		System.out.println("Previous linked list: " + list);
		
		// sorts linked list
		Collections.sort(list);
		System.out.println("Sorted linked list: " + list);
		
		// adds the new element
		list.add(a);
		
		System.out.println("Linked list with added element: " + list);
	}
}

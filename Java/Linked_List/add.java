import java.util.LinkedList;
import java.util.ArrayList;
import java.util.Collections;
public class MM {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		add(7);
	}
	
	public static void add(int a) {
		
		//creates linked list with elements in it
		 LinkedList list =new LinkedList();
		 list.add(4);
		 list.add(2);
		 list.add(5);
		 list.add(1);
		 list.add(8);
	     list.add(9);
		System.out.println("previous linked list"+list);
		
		//sorts linked list
		Collections.sort(list);
		System.out.println("sorted linked list"+list);
		
		//clears the linked list
		list.clear();
		
		
		//creates arraylist that stores all linked list elements
        ArrayList <Integer> lst= new ArrayList<>();
         lst.add(1);
		 lst.add(2);
		 lst.add(5);
		 lst.add(6);
		 lst.add(8);
		 lst.add(9);
		 lst.add(a);
		
		 
		 /*turns arraylist into array and then fills back 
		  the linked list in order of highest number to smallest*/
		 Integer [] array =new Integer[lst.size()+1];
		 lst.toArray(array);
		 for (int i=0;i<lst.size();i++) {
	     list.add(array[i]);
		}
				 
		System.out.println("linked list with added element"+list);
				 
	}

}
 
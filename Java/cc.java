import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
public class cc {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		 System.out.println("Current linked list {5 ,3 ,8 ,7 ,6 ,2 ,4}");
		 swap(8,2);
	}

	public static void swap(int a,int b) {
		//creates linkedlist
		LinkedList list =new LinkedList();
		 list.add(5);
		 list.add(3);
		 list.add(8);
		 list.add(7);
		 list.add(6);
	     list.add(2);
	     list.add(4);


	   //creates array that stores all linked list elements
	    int [] T =new int[7];
	    T[0]=5;
		T[1]=3;
		T[2]=8;
		T[3]=7;
		T[4]=6;
		T[5]=2;
		T[6]=4;
		int c=0;
		int d=0;


		//uses for loop to interchange the posistions of the given integers
		for (int i=0;i<=6;i++) {
			if (a ==T[i]) {
				c=i;
			}
		}
			for (int e=0;e<=6;e++) {
				if (b ==T[e]) {
					d=e;
				}
		}
			T[c]=b;
			T[d]=a;


		//clears the existing linkedlist
		list.clear();


		//fills in the linkedlist with the updated list
		for (int f=0;f<=6;f++) {
				list.add(T[f]);
			}

			System.out.println("New linkedlist afte swap"+list);
		}

}

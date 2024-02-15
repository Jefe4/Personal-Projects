import java.util.LinkedList;
import java.util.ListIterator;
public class ww {
//creates a linked list to represent grocery items
	public static void main(String[] args) {
		// TODO Auto-generated method stub

		LinkedList<String> ap = new LinkedList<String>();
		ap.add("bread");
		ap.add("milk");
		ap.add("sugar");
		ap.add("tea");
		ap.add("salt");
		//allows the list to be called
		ListIterator<String> itr =ap.listIterator();
		// prints the linked list on  seperate line
		while(itr.hasNext()!= false) {
			System.out.println(itr.next());
		}
	}

}

import java.util.LinkedList;
import java.util.ListIterator;

public class Iterator {
	// creates a linked list to represent grocery items
	public static void main(String[] args) {
		// TODO Auto-generated method stub

		LinkedList<String> ap = new LinkedList<>();
		ap.add("bread");
		ap.add("milk");
		ap.add("sugar");
		ap.add("tea");
		ap.add("salt");
		// allows the list to be called
		ListIterator<String> itr = ap.listIterator();
		// prints the linked list on separate lines
		while (itr.hasNext()) {
			System.out.println(itr.next());
		}
	}
}

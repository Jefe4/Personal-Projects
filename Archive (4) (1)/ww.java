import java.util.LinkedList;
import java.util.ListIterator;
public class ww {

	public static void main(String[] args) {
		// TODO Auto-generated method stub

		LinkedList<String> ap = new LinkedList<String>();
		ap.add("bread");
		ap.add("milk");
		ap.add("sugar");
		ap.add("tea");
		ap.add("salt");
		
		ListIterator<String> itr =ap.listIterator();
		
		while(itr.hasNext()!= false) {
			System.out.println(itr.next());
		}
	}

}

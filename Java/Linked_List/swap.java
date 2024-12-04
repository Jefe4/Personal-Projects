import java.util.LinkedList;

public class swap {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		System.out.println("Current linked list {5, 3, 8, 7, 6, 2, 4}");
		swap(8, 2);
	}

	public static void swap(int a, int b) {
		// creates linked list
		LinkedList<Integer> list = new LinkedList<>();
		list.add(5);
		list.add(3);
		list.add(8);
		list.add(7);
		list.add(6);
		list.add(2);
		list.add(4);

		int indexA = list.indexOf(a);
		int indexB = list.indexOf(b);

		if (indexA != -1 && indexB != -1) {
			list.set(indexA, b);
			list.set(indexB, a);
		}

		System.out.println("New linked list after swap: " + list);
	}
}

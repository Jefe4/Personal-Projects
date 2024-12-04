public class Traverse {
	int num;
	Traverse next = null;

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		transverse(3);
	}
	
	public static void transverse(int a) {
		int d = 0;
	
		Traverse node1 = new Traverse();
		node1.num = 4;
		
		Traverse node2 = new Traverse();
		node2.num = 1;
		node1.next = node2;
		
		Traverse node3 = new Traverse();
		node3.num = 7;
		node2.next = node3;
		
		Traverse node4 = new Traverse();
		node4.num = 5;
		node3.next = node4;
		
		Traverse node5 = new Traverse();
		node5.num = 9;
		node4.next = node5;
		
		Traverse node6 = new Traverse();
		node6.num = 2;
		node5.next = node6;
		
		Traverse head = node1;
		
		Traverse temp = head;
		
		while (temp != null) {
			if (temp.num == a) {
				d = 1;
				break;
			}
			temp = temp.next;
		}
		if (d == 1) {
			System.out.println("True");
		} else {
			System.out.println("False");
		}
	}
}

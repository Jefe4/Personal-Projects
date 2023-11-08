
public class dd {
	int num;
	dd next= null;

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		transverse(3);
	}
	
	public static void transverse(int a) {
		int d = 0;
	
		dd node1 =new dd();
		node1.num = 4;
		
		dd node2 =new dd();
		node2.num = 1;
		node1.next=node2;
		
		dd node3 =new dd();
		node3.num = 7;
		node2.next=node3;
		
		dd node4 =new dd();
		node4.num = 5;
		node3.next=node4;
		
		dd node5 =new dd();
		node5.num = 9;
		node4.next=node5;
		
		dd node6 =new dd();
		node6.num = 2;
		node5.next=node6;
		
		dd head= node1;
		
		dd temp = head;
		
		while(temp != null && d == 0) {
			if (temp.num == a) {
				d=1;
			}
			else {
				d=0;
			}
			temp =temp.next;
			
		}
		if (d==1) {
			System.out.println("True");
		}
		else if (d==0) {
			System.out.println("False");
		}
		
		
	}

}

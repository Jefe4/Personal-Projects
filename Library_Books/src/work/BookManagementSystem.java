package work;

public class BookManagementSystem {

	public static void main(String[] args) {
		BookManagement bm = new BookManagement();
		if (args.length > 0 && "--menu".equals(args[0])) {
			bm.menu();
			return;
		}
		bm.viewBooks();
	}

}

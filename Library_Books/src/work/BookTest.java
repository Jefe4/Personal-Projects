package work;

import java.io.File;

public class BookTest {
	private static int passed = 0;
	private static int failed = 0;

	public static void main(String[] args) throws Exception {
		File tmp = File.createTempFile("booklist", ".txt");
		tmp.delete();
		BookManagement bm = new BookManagement(tmp);
		check("seeded starter shelf", bm.getBookList().size() == 5);
		check("Hunger Games is on the shelf", bm.SearchBook("The Hunger Games") != null);
		check("reject duplicate title", !bm.addBook("Twilight", "Someone Else", 1999));
		check("add new title", bm.addBook("Days Gone", "Bend Studio", 2019));
		check("delete works", bm.deleteBook("Twilight"));
		check("twilight gone", bm.SearchBook("Twilight") == null);
		Book parsed = BookManagement.parseLine("The Hunger Games by Suzanne Collins, 2008");
		check("parse round-trip", parsed != null && parsed.getYear() == 2008);
		System.out.println("BookTest passed=" + passed + " failed=" + failed);
		if (failed > 0) {
			System.exit(1);
		}
	}

	private static void check(String name, boolean ok) {
		if (ok) {
			passed++;
			System.out.println("  ok  " + name);
		} else {
			failed++;
			System.out.println("  FAIL  " + name);
		}
	}
}

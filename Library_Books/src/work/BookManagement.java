package work;

import java.io.File;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Scanner;

public class BookManagement {
	
	private ArrayList<Book> bookList;
	private File store;
	
	public BookManagement() {
		this(new File("booklist.txt"));
	}

	public BookManagement(File store) {
		this.store = store;
		bookList = new ArrayList<>();
		if (store.isFile()) {
			loadFromFile();
		} else {
			seedDefaults();
			saveBooks();
		}
	}

	private void seedDefaults() {
		bookList.add(new Book("The Hunger Games", "Suzanne Collins", 2008));
		bookList.add(new Book("Harry Potter and the Order of the Phoenix", "J.K. Rowling", 2003));
		bookList.add(new Book("To Kill a Mockingbird", "Harper Lee", 1960));
		bookList.add(new Book("Twilight", "Stephanie Meyer", 2005));
		bookList.add(new Book("The Catcher in the Rye", "J.D. Salinger", 2008));
	}

	private void loadFromFile() {
		try {
			Scanner sc = new Scanner(store);
			while (sc.hasNextLine()) {
				String line = sc.nextLine().trim();
				if (line.isEmpty()) {
					continue;
				}
				Book parsed = parseLine(line);
				if (parsed != null && !bookList.contains(parsed)) {
					bookList.add(parsed);
				}
			}
			sc.close();
		} catch (Exception e) {
			System.out.println("Error reading the file, using the starter list.");
			seedDefaults();
		}
	}

	static Book parseLine(String line) {
		int by = line.lastIndexOf(" by ");
		int comma = line.lastIndexOf(',');
		if (by < 0 || comma < 0 || comma < by) {
			return null;
		}
		String name = line.substring(0, by).trim();
		String author = line.substring(by + 4, comma).trim();
		String yearPart = line.substring(comma + 1).trim();
		try {
			int year = Integer.parseInt(yearPart);
			return new Book(name, author, year);
		} catch (NumberFormatException e) {
			return null;
		}
	}

	public void saveBooks() {
		try {
			PrintWriter pw = new PrintWriter(store);
			for (Book book : bookList) {
				pw.println(book.toString());
			}
			pw.close();
		} catch (Exception e) {
			System.out.println("Error creating the file");
		}
	}

	public ArrayList<Book> getBookList() {
		return bookList;
	}
	
	public void viewBooks() {
		Collections.sort(bookList);
		for(Book book : bookList) {
			System.out.println(book.toString());
		}
	}
	
	public boolean addBook(String bookName, String authorName, int bookYear) {
		Book newBook = new Book(bookName, authorName, bookYear);
		if(bookList.contains(newBook)) {
			System.out.println("Book already exists!");
			return false;
		}
		bookList.add(newBook);
		saveBooks();
		System.out.println("Book has been added!");
		return true;
	}

	public void addBook() {
		Scanner input = new Scanner(System.in);
		System.out.println("What is the book name? ");
		String bookName = input.nextLine();
		System.out.println("What is the author name? ");
		String authorName = input.nextLine();
		System.out.println("What is the book year? ");
		int bookYear = Integer.parseInt(input.nextLine());
		addBook(bookName, authorName, bookYear);
	}
	
	private Book getBook(String bookName) {
		for(Book book : bookList) {
			if(book.getBookName().equalsIgnoreCase(bookName)) {
				return book;
			}
		}
		return null;
	}

	public void searchByAuthor(String author) {
		boolean any = false;
		for (Book book : bookList) {
			if (book.getAuthorName().equalsIgnoreCase(author)) {
				System.out.println(book.toString());
				any = true;
			}
		}
		if (!any) {
			System.out.println("No books by that author.");
		}
	}
	
	public void editBook() {
		Scanner input = new Scanner(System.in);
		System.out.println("What book would you like to edit? ");
		String bookName = input.nextLine();
		Book bookToEdit = getBook(bookName);
		if(bookToEdit == null) {
			System.out.println("A book with this title does not exist!");
			return;
		}
		System.out.println("Would you like to change the book name? Please enter 'yes' or 'no'");
		if (input.nextLine().equalsIgnoreCase("yes")) {
			System.out.println("What would you like to change the book name to?");
			bookToEdit.setBookName(input.nextLine());
			System.out.println("Book Name has been changed!");
		}
		System.out.println("Would you like to change the author name? Please enter 'yes' or 'no'");
		if (input.nextLine().equalsIgnoreCase("yes")) {
			System.out.println("What would you like to change the author name to?");
			bookToEdit.setAuthorName(input.nextLine());
			System.out.println("Author Name has been changed!");
		}
		System.out.println("Would you like to change the book year? Please enter 'yes' or 'no'");
		if (input.nextLine().equalsIgnoreCase("yes")) {
			System.out.println("What would you like to change the year to?");
			bookToEdit.setYear(Integer.parseInt(input.nextLine()));
			System.out.println("Book year has been changed!");
		}
		saveBooks();
	}
	
	public boolean deleteBook(String bookName) {
		Book bookToDelete = getBook(bookName);
		if(bookToDelete == null) {
			System.out.println("A book with this title does not exist!");
			return false;
		}
		bookList.remove(bookToDelete);
		saveBooks();
		System.out.println("The book has been deleted!");
		return true;
	}

	public void deleteBook() {
		Scanner input = new Scanner(System.in);
		System.out.println("What book would you like to delete? ");
		deleteBook(input.nextLine());
	}
	
	public Book SearchBook(String bookName) {
		Book book = getBook(bookName);
		if(book == null) {
			System.out.println("A book with this title does not exist!");
			return null;
		}
		System.out.println("Book's information: " + book.toString());
		return book;
	}

	public void SearchBook() {
		Scanner input = new Scanner(System.in);
		System.out.println("What book would you like to search? ");
		SearchBook(input.nextLine());
	}

	public void menu() {
		Scanner input = new Scanner(System.in);
		boolean running = true;
		while (running) {
			System.out.println("1 view  2 add  3 search  4 author  5 edit  6 delete  7 quit");
			String cmd = input.nextLine().trim();
			if (cmd.equals("1") || cmd.equals("view")) {
				viewBooks();
			} else if (cmd.equals("2") || cmd.equals("add")) {
				addBook();
			} else if (cmd.equals("3") || cmd.equals("search")) {
				SearchBook();
			} else if (cmd.equals("4") || cmd.equals("author")) {
				System.out.println("Author name?");
				searchByAuthor(input.nextLine());
			} else if (cmd.equals("5") || cmd.equals("edit")) {
				editBook();
			} else if (cmd.equals("6") || cmd.equals("delete")) {
				deleteBook();
			} else if (cmd.equals("7") || cmd.equals("quit")) {
				running = false;
			}
		}
	}
}

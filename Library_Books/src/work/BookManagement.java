package work;

import java.io.File;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Scanner;

public class BookManagement {
	
	private ArrayList<Book> bookList;
	
	public BookManagement() {
		bookList = new ArrayList<>();
		
//		Create 5 original books that will go in the file and list
		Book first = new Book("The Hunger Games", "Suzanne Collins", 2008);
		Book second = new Book("Harry Potter and the Order of the Phoenix", "J.K. Rowling", 2003);
		Book third = new Book("To Kill a Mockingbird", "Harper Lee", 1960);
		Book fourth = new Book("Twilight", "Stephanie Meyer", 2005);
		Book fifth = new Book("The Catcher in the Rye", "J.D. Salinger", 2008);
		
//		Add each book to the list
		bookList.add(first);
		bookList.add(second);
		bookList.add(third);
		bookList.add(fourth);
		bookList.add(fifth);

//		Create the file
		try {
			File file = new File("booklist.txt");
			PrintWriter pw = new PrintWriter(file);
			
//			Populate the file with the list of books
			for(Book book : bookList) {
				pw.println(book.toString());
			}
			pw.close();
			System.out.println("File has been created!");
		} catch (Exception e) {
			System.out.println("Error creating the file");
		}
	
	}
	
//	View books in order
	public void viewBooks() {
		Collections.sort(bookList);
		for(Book book : bookList) {
			System.out.println(book.toString());
		}
	}
	
//	Add book
	public void addBook() {
		Scanner input = new Scanner(System.in);
		
		System.out.println("What is the book name? ");
		String bookName = input.next();
		
		System.out.println("What is the author name? ");
		String authorName = input.next();
		
		System.out.println("What is the book year? ");
		int bookYear = input.nextInt();
		
		Book newBook = new Book(bookName, authorName, bookYear);
		
		if(bookList.contains(newBook)) {
			System.out.println("Book already exists!");
		} else {
			bookList.add(newBook);
			System.out.println("Book has been added!");
		}
		input.close();
	}
	
	private Book getBook(String bookName) {
		for(Book book : bookList) {
			if(book.getBookName().equals(bookName)) {
				return book;
			}
		}
		return null;
	}
	
	public void editBook() {
		Scanner input = new Scanner(System.in);
		
		System.out.println("What book would you like to edit? ");
		String bookName = input.next();
		
		Book bookToEdit = getBook(bookName);
		
		if(bookToEdit == null) {
			System.out.println("A book with this title does not exist!");
		} else {
			System.out.println("Would you like to change the book name? Please enter 'yes' or 'no'");
			String changeBookNameAnswer = input.next();
			
			if(changeBookNameAnswer.toLowerCase().equals("yes")) {
				System.out.println("What would you like to change the book name to?");
				String newBookName = input.next();
				bookToEdit.setBookName(newBookName);
				System.out.println("Book Name has been changed!");
			}
			
			System.out.println("Would you like to change the author name? Please enter 'yes' or 'no'");
			String changeAuthorNameAnswer = input.next();
			
			if(changeAuthorNameAnswer.toLowerCase().equals("yes")) {
				System.out.println("What would you like to change the author name to?");
				String newAuthorName = input.next();
				bookToEdit.setAuthorName(newAuthorName);
				System.out.println("Author Name has been changed!");
			}
			
			System.out.println("Would you like to change the book year? Please enter 'yes' or 'no'");
			String changeYearAnswer = input.next();
			
			if(changeYearAnswer.toLowerCase().equals("yes")) {
				System.out.println("What would you like to change the year to?");
				int newYear = input.nextInt();
				bookToEdit.setYear(newYear);
				System.out.println("Book year has been changed!");
			}
		}

		input.close();
	}
	
	public void deleteBook() {
		Scanner input = new Scanner(System.in);
		
		System.out.println("What book would you like to delete? ");
		String bookName = input.next();
		
		Book bookToDelete = getBook(bookName);
		
		if(bookToDelete == null) {
			System.out.println("A book with this title does not exist!");
		} else {
			bookList.remove(bookToDelete);
			System.out.println("The book has been deleted!");
		}
		
		input.close();
	}
	
	public void SearchBook() {
		Scanner input = new Scanner(System.in);
		
		System.out.println("What book would you like to delete? ");
		String bookName = input.next();
		
		Book book = getBook(bookName);
		
		if(book == null) {
			System.out.println("A book with this title does not exist!");
		} else {
			System.out.println("Book's information: " + book.toString());
		}
		
		input.close();
	}
	
}

package work;

public class Book implements Comparable<Book>{
	private String bookName;
	private String authorName;
	private int year;
	
	
	public Book(String bookName, String authorName, int year) {
		this.bookName = bookName;
		this.authorName = authorName;
		this.year = year;
	}

	public String getBookName() {
		return bookName;
	}


	public void setBookName(String bookName) {
		this.bookName = bookName;
	}


	public String getAuthorName() {
		return authorName;
	}


	public void setAuthorName(String authorName) {
		this.authorName = authorName;
	}


	public int getYear() {
		return year;
	}


	public void setYear(int year) {
		this.year = year;
	}
	
	@Override
	public String toString() {
		return bookName + " by " + authorName + ", " + year;
	}

	@Override
	public int compareTo(Book otherBook) {
		return bookName.compareTo(otherBook.bookName);
	}
	
//	If the book has the same name, they are equal. no other fields are checked.
	@Override
	 public boolean equals(Object obj) {
	      if (obj == this) {
	         return true;
	      }
	      if (!(obj instanceof Book)) {
	         return false;
	      }
	      Book currentBook = (Book) obj;
	      return bookName.equals(currentBook.bookName);
	   }

}

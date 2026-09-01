# Library book list

Java shelf for a handful of books: add, search, edit, delete, persist to `booklist.txt`. Titles with spaces now work (`nextLine` instead of `next`). The file is reloaded on startup so adds survive a rerun.

## Run

```bash
cd Library_Books
javac -d out src/work/*.java
java -cp out work.BookManagementSystem
java -cp out work.BookManagementSystem --menu
java -ea -cp out work.BookTest
```

Equals is by title only, same as the original `Book` class. Search-by-author is extra.

Author: Jeffrey Gomez

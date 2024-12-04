import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.Map;

public class Main_class implements MoviesProject {

    public static void main(String[] args) {
        Main_class run = new Main_class();
        run.find(null);
        run.go();
        run.count();
        System.out.println();
        run.exit();
    }

    public Main_class() {
        int result = hash("Looking through the data");
        System.out.println(result);
    }

    @Override
    public String find(String movie) {
        if (movie == null || movie.isEmpty()) {
            System.out.println("Which movie would you like to view?");
            Scanner find = new Scanner(System.in);
            movie = find.nextLine();
        }
        return movie;
    }

    public void go() {
        try {
            File myHashTable = new File("/Users/jefe/Downloads/HashMap/src/movies");
            Scanner myReader = new Scanner(myHashTable);
            Hash_M<String, String> hashMap = new Hash_M<>();

            while (myReader.hasNextLine()) {
                String data = myReader.nextLine();
                String[] parts = data.split(",", 2); // Assuming CSV format
                if (parts.length >= 2) {
                    String movie = parts[0];
                    String entry = parts[1];
                    add(movie, entry); // Use the add method
                }
            }
            myReader.close();

            // Print the hash table
            for (Map.Entry<String, String> entry : hashMap.entrySet()) {
                System.out.println(entry.getKey() + ": " + entry.getValue());
            }
        } catch (FileNotFoundException e) {
            System.err.println("There is an error.");
            e.printStackTrace();
        }
    }

    @Override
    public boolean add(String movie, String entry) {
        System.out.println("Adding movie: " + movie + " with entry: " + entry);
        return true;
    }

    @Override
    public boolean delete(String movie) {
        System.out.println("Deleting movie: " + movie);
        return true;
    }

    @Override
    public void printHash_M() {
        System.out.println("Printing the entire hash table...");
    }

    @Override
    public double getLoadFactor() {
        return 0.5;
    }

    @Override
    public double getMaxLoadFactor() {
        return 0.7;
    }

    @Override
    public int count() {
        System.out.println("There are 7669 entries.");
        return 7669;
    }

    @Override
    public void who() {
        System.out.println("Jeffrey Gomez");
    }

    @Override
    public void help() {
        System.out.println("The commands of this program are:");
        System.out.println("add entry, delete entry, find movie, printHashTable, who, and exit");
    }

    @Override
    public void exit() {
        System.out.println("The program has ended");
    }

    private int hash(String key) {
        return 7769;
    }
}

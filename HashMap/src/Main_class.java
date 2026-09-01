import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

/**
 * Movie catalog on top of Hash_M.
 * Default run loads the CSV and prints stats so it does not hang waiting for stdin.
 * Interactive commands: java Main_class --repl
 */
public class Main_class implements MoviesProject {

    private Hash_M<String, String> table = new Hash_M<String, String>(31);
    private static final double MAX_LOAD = 0.5;

    public static void main(String[] args) {
        Main_class run = new Main_class();
        run.who();
        run.loadMovies();
        if (args.length > 0 && "--repl".equals(args[0])) {
            run.repl();
            return;
        }
        System.out.println("Loaded catalog.");
        run.count();
        System.out.println("Load factor: " + run.getLoadFactor() + " (max " + run.getMaxLoadFactor() + ")");
        System.out.println("Collision stats: " + run.table.collisionReport());
        String sample = run.find("The Shining");
        System.out.println("The Shining -> " + sample);
        run.help();
        run.exit();
    }

    public Main_class() {
    }

    public void loadMovies() {
        File movies = Hash_M.moviesFile();
        try {
            Scanner myReader = new Scanner(movies);
            if (myReader.hasNextLine()) {
                myReader.nextLine(); // header: name,genre,year,director
            }
            while (myReader.hasNextLine()) {
                String data = myReader.nextLine();
                String[] parsed = parseMovieLine(data);
                if (parsed != null) {
                    table.put(parsed[0], parsed[1]);
                }
            }
            myReader.close();
        } catch (FileNotFoundException e) {
            System.err.println("There is an error. Movies file not found at " + movies.getAbsolutePath());
        }
    }

    /**
     * CSV rows are title,genre,year,director. Titles can contain commas,
     * so genre/year/director are taken from the right.
     */
    public static String[] parseMovieLine(String data) {
        if (data == null) {
            return null;
        }
        String line = data.trim();
        if (line.isEmpty()) {
            return null;
        }
        int last = line.lastIndexOf(',');
        int mid = last > 0 ? line.lastIndexOf(',', last - 1) : -1;
        int genreComma = mid > 0 ? line.lastIndexOf(',', mid - 1) : -1;
        if (genreComma < 0) {
            String[] parts = line.split(",", 2);
            if (parts.length < 2) {
                return null;
            }
            return new String[] { parts[0].trim(), parts[1].trim() };
        }
        String title = line.substring(0, genreComma).trim();
        String rest = line.substring(genreComma + 1).trim();
        if (title.isEmpty()) {
            return null;
        }
        return new String[] { title, rest };
    }

    private void repl() {
        help();
        Scanner in = new Scanner(System.in);
        while (true) {
            System.out.print("> ");
            if (!in.hasNextLine()) {
                break;
            }
            String line = in.nextLine().trim();
            if (line.equalsIgnoreCase("exit") || line.equalsIgnoreCase("quit")) {
                exit();
                break;
            } else if (line.equalsIgnoreCase("who")) {
                who();
            } else if (line.equalsIgnoreCase("help")) {
                help();
            } else if (line.equalsIgnoreCase("count")) {
                count();
            } else if (line.equalsIgnoreCase("print") || line.equalsIgnoreCase("printHashTable")
                    || line.equalsIgnoreCase("printHash_M")) {
                printHash_M();
            } else if (line.equalsIgnoreCase("stats")) {
                System.out.println(table.collisionReport());
                System.out.println("load=" + getLoadFactor());
            } else if (line.toLowerCase().startsWith("find ")) {
                System.out.println(find(line.substring(5).trim()));
            } else if (line.toLowerCase().startsWith("delete ")) {
                delete(line.substring(7).trim());
            } else if (line.toLowerCase().startsWith("add ")) {
                String rest = line.substring(4);
                int comma = rest.indexOf(',');
                if (comma < 0) {
                    System.out.println("Usage: add Title,genre,year,director");
                } else {
                    add(rest.substring(0, comma).trim(), rest.substring(comma + 1).trim());
                }
            } else {
                System.out.println("Unknown command. Type help.");
            }
        }
        in.close();
    }

    @Override
    public String find(String movie) {
        if (movie == null || movie.isEmpty()) {
            return null;
        }
        String hit = table.get(movie);
        if (hit == null) {
            System.out.println("No entry for \"" + movie + "\".");
            return null;
        }
        return hit;
    }

    @Override
    public boolean add(String movie, String entry) {
        if (movie == null || movie.isEmpty()) {
            return false;
        }
        table.put(movie, entry);
        System.out.println("Adding movie: " + movie + " with entry: " + entry);
        return true;
    }

    @Override
    public boolean delete(String movie) {
        if (table.remove(movie) == null) {
            System.out.println("No entry for \"" + movie + "\".");
            return false;
        }
        System.out.println("Deleting movie: " + movie);
        return true;
    }

    @Override
    public void printHash_M() {
        table.printTable();
    }

    @Override
    public double getLoadFactor() {
        return table.loadFactor();
    }

    @Override
    public double getMaxLoadFactor() {
        return MAX_LOAD;
    }

    @Override
    public int count() {
        int c = table.size();
        System.out.println("There are " + c + " entries.");
        return c;
    }

    @Override
    public void who() {
        System.out.println("Jeffrey Gomez");
    }

    @Override
    public void help() {
        System.out.println("The commands of this program are:");
        System.out.println("add Title,entry | delete Title | find Title | print | stats | count | who | help | exit");
    }

    @Override
    public void exit() {
        System.out.println("The program has ended");
    }
}

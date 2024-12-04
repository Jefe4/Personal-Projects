public interface MoviesProject {

    /**
     * Search for a movie title
     * Shows the title and the information that goes with the movie
     */
    String find(String movie);

    /**
     * Add a new entry. The values are passed as a string.
     * List is added to hash table
     * @param movie name will be the table key
     * @param entry the values that will be inserted
     * @return true if insertion was successful
     */
    boolean add(String movie, String entry);

    /**
     * Remove an entry
     * @param movie is the key for the entry to remove
     * @return true if this entry was deleted.
     */
    boolean delete(String movie);

    /**
     * Print the entire table in the format below
     * Index : Key : Entry
     */
    void printHash_M();

    /**
     * How full is this table?
     * Count the amount of entries you have and divide by the size of the table
     * @return count / size
     */
    double getLoadFactor();

    /**
     * How full can this table be?
     * @return maximum load factor
     */
    double getMaxLoadFactor();

    /**
     * Count the number of entries in the table
     * @return the number of entries
     */
    int count();

    /**
     * Print the author's name
     */
    void who();

    /**
     * Print the help message with available commands
     */
    void help();

    /**
     * Exit the program
     */
    void exit();
}

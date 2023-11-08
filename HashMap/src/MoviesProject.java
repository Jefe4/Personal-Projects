public interface MoviesProject {

    /**
     * Search for a movie title
     * Shows the title
     * and the information that goes with the movie
     */
String find(String movie);
// add a new entry. The values are passed as a string.
    // List is added to hash table
boolean add(String movie, String[] entry);

    /**
     *
     * @param movie name will be the table key
     * @para entry the values that will be inserted
     * @return true if insertion was successful
     */
    boolean delete(String movie);

    /**
     * remove an entry
     * @para movie is the key for the entry to remove
     * @return true if this entry was deleted.
     */
    void printHash_M();

    /**
     * print the entire table in the format below
     * Index : Key : Entry
     * @return
     */


double getLoadFactor();

    /**
     * How full is this table?
     * Count the amount of entries you have and divide by the size of the table
     * @return count / size
     */
    double getMaxLoadFactor();

    /**
     * How full can this table be?
     * @return maximum load factor
     */




}

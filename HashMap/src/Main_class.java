package edu.frostburg.cosc310.projects.hashmap;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Main_class implements MovieProject{


    public static void main(String[] args) {
        Main_class run = new Main_class();
        run.find(movie null);
        run.go();
        run.count();
        System.out.println();
        run.exit();

    }
    Main_class map;

    public Main_class(){
        map = new Main_class();

        int result = hash("Looking through the data");
        System.out.println(result);
    }
    @Override
    public String find(String movie){
        String line = "find";
        // prints out user commands
        if(line.equals("find")){
            System.out.println("Which movie would you like to view?");
            // scanner will scan for the movie
            Scanner find = new Scanner(System.in);
            String movieName = find.nextLine();
        }
        return movie;
    }
    public void go(){
        try{
            //reads the file
            File myHashTable = new File("/Users/jefe/Downloads/HashMap/src/movies");
            // scanner reads the file
            Scanner myReader = new Scanner(myHashTable);

            while(myReader.hasNextLine()){
                //print data to console
                String data = myReader.nextLine();
                System.out.println(data);
            }
            // closes the myReader to stop running
            myReader.close();
        } catch (FileNotFoundException e){
            // prints if the file is not found
            System.err.println("There is an error.");
            e.printStackTrace();
        }
    }
    @Override
    public boolean add(String movie, String[] entry){
        String exampleInWrongType = entry[0] + entry[1];
        return map.add(movie, exampleInWrongType);
    }
    @Override
    public boolean delete(String movie) { return false;}
    @Override
    public void printHT(){
        String hashTable;
    }
    @Override
    public double getLoadFactor(){
        // TODO Auto-generated method stub
        return 0.1;
    }
    @Override
    public double getMaxLoadFactor(){return 0.7;}
    @Override
    public int count(){
        System.out.println("There are"+e);
        System.out.printf("You searched for:");
        System.out.printf(map);
        return 7669;
    }
    @Override
    public void who(){
        System.out.println("Jeffrey Gomez");
    }
    @Override
    public void help(){
        String Line = "help";
        if(Line.equals("help")){
            // prints out the commands for the user
            System.out.println("The commands of this program is add entry, delete entry");
            System.out.println("FInd movie, printHashTable, who, and exit");
            Scanner help = new Scanner(System.in);
            String movieName = help.nextLine();
        }
    }
    @Override
    public void exit(){
        String ExitLine = "Exit";
        if (ExitLine.equals("Exit")){
            //terminates the program
            System.out.println("The program has ended");
        }

    }

    private int hash(String key){
        return 7769;
    }
     /*
add – insert an entry into the table
delete – remove an entry
find – If the user enters a movie name, print out its entry
printHT – Print the entire table (along with the indices of each entry)
who – Print your name
help – Print these commands
exit – Quit your program
     */

    
}

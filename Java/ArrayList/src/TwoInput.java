import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;

public class QuestionOne {

	public static void main(String[] args) {
		
		try {
			File file = new File("C:\\Users\\gerdi\\Personal Projects\\Lab6\\src\\word.txt" );
			Scanner fileReader = new Scanner(file);
			Scanner input = new Scanner(System.in);
			String data = fileReader.nextLine();
			
//			Populate an array list with all the words from the sentence
			ArrayList<String> words = new ArrayList<>();
			for(int i = 0; i < data.split(" ").length; i++) {
				String[] splitWords = data.split(" "); 
				String word = splitWords[i].replaceAll(",", ""); //Removes all commas
				word = word.replace('.', (char) 0); 
				
				if(word.charAt(word.length() - 1) == (char) 0) {
					words.add(word.substring(0, word.length() - 1)); //Removes the empty space from the period
				} else {
					words.add(word); //Adds the words
				}
			}
			
//			Information for the two words
			System.out.print("Please type in two words: ");
			String firstString = input.next();
			String secondString = input.next();
			int firstStringIndex = getIndex(words, firstString);
			int secondStringIndex = getIndex(words, secondString);
			
//			Check if the words are inside the list
			if(firstStringIndex == -1 && secondStringIndex == -1) {
				System.out.println("Both words are not found!");
			} else if(firstStringIndex == -1) {
				System.out.println(firstString + " is not found!");
			} else if (secondStringIndex == -1){
				System.out.println(secondString + " is not found!");
			} else {
//				Output
				int count = ((secondStringIndex - firstStringIndex)-1);
				System.out.println("There are " + count + " words between " + firstString + " and " + secondString );
			}
			
			input.close();
			fileReader.close();
		} catch (FileNotFoundException e) {
			System.out.println("The file cannot be found or opened!");
			e.printStackTrace();
		}

	}

	private static int getIndex(ArrayList<String> list, String word) {
		int index = -1;
		
		for(int i = 0; i < list.size(); i++) {
			if(list.get(i).equals(word)) {
				return i;
			}
		}
		return index;
	}

}

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;

public class TwoInput {

	public static void main(String[] args) {
		
		try {
			File file = resolveWordFile();
			Scanner fileReader = new Scanner(file);
			Scanner input = new Scanner(System.in);
			String data = fileReader.nextLine();
			
			ArrayList<String> words = new ArrayList<>();
			String[] splitWords = data.split(" ");
			for (int i = 0; i < splitWords.length; i++) {
				String word = splitWords[i].replace(",", "").replace(".", "");
				if (!word.isEmpty()) {
					words.add(word);
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

	private static File resolveWordFile() {
		File[] candidates = new File[] {
			new File("word.txt"),
			new File("src/word.txt"),
			new File("Java/ArrayList/src/word.txt")
		};
		for (File f : candidates) {
			if (f.exists()) {
				return f;
			}
		}
		return candidates[0];
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

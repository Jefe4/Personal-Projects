import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Scanner;

public class QuestionTwo {

	public static void main(String[] args) {
		try {
			File file = new File("C:\\Users\\gerdi\\Personal Projects\\Lab6\\src\\names.txt" );
			Scanner fileReader = new Scanner(file);

			ArrayList<String> names = new ArrayList<>();
			while (fileReader.hasNextLine()) {
//				Obtain data about the exam from the file
				String data = fileReader.nextLine();
				names.add(data);
			}
			
			System.out.println("Unsorted: " + names);
			Collections.sort(names);
			System.out.println("Sorted: " + names);
			fileReader.close();
		} catch (FileNotFoundException e) {
			System.out.println("The file cannot be found or opened!");
			e.printStackTrace();
		}
	}

}

/* COSC 241
 * 2/17/2021
 * Moose Njoka
 * This program allows you to create different player objects from different sports
 * and prints out certain stats about them.
 * Screenshot: https://gyazo.com/e997833758cead24c4a69f93456824d6
 */


package problem1;

public class Driver {

	public static void main(String[] args) {
//		Football player
		String name = "Tom Brady";
		int jerseyNumber = 12;
		double salary = 15000000.00; // US Dollars
		int totalYards = 4633; //Passing Yards
		int totalTackles = 0;
		int totalTouchdowns = 40;
		FootballPlayer footballPlayer = new FootballPlayer(name, jerseyNumber, salary, totalYards, totalTackles, totalTouchdowns);
		
//		Baseball player
		String name2 = "Mike Trout";
		int jerseyNumber2 = 27;
		double salary2 = 33250000.00; // US Dollars
		double battingAverage = 0.304;
		double onBasePercentage = 0.39;
		int RBIs = 46;
		BaseballPlayer baseballPlayer = new BaseballPlayer(name2, jerseyNumber2, salary2, battingAverage, onBasePercentage, RBIs);
		
//		Basketball player
		String name3 = "Lebron James";
		int jerseyNumber3 = 23;
		double salary3 = 39220000.00; // US Dollars
		double pointsPerGame = 25.5;
		double assistsPerGame = 8.00;
		double reboundsPerGame = 8.00;
		BasketballPlayer basketballPlayer = new BasketballPlayer(name3, jerseyNumber3, salary3, pointsPerGame, assistsPerGame, reboundsPerGame);

//		Print Statements
		System.out.println(footballPlayer.toString());
		System.out.println(baseballPlayer.toString());
		System.out.println(basketballPlayer.toString());
	}

}

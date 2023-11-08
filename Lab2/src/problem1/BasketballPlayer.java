package problem1;

public class BasketballPlayer extends CommonPlayerInfo{
	private double pointsPerGame;
	private double assistsPerGame;
	private double reboundsPerGame;
	
	
	public BasketballPlayer(String name, int jerseyNumber, double salary, double pointsPerGame, double assistsPerGame, double reboundsPerGame) {
		super(name, jerseyNumber, salary);
		this.pointsPerGame = pointsPerGame;
		this.assistsPerGame = assistsPerGame;
		this.reboundsPerGame = reboundsPerGame;
	}

	public double getPointsPerGame() {
		return pointsPerGame;
	}


	public double getAssistsPerGame() {
		return assistsPerGame;
	}


	public double getReboundsPerGame() {
		return reboundsPerGame;
	}
	
	@Override
	public String toString() {
		return super.toString() + ", Points Per Game: "+ getPointsPerGame() + ", Assists Per Game: " + getAssistsPerGame() + ", Rebounds Per Game: " + getReboundsPerGame();
	}

}

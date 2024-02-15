package problem1;

public class BaseballPlayer extends CommonPlayerInfo {
	private double battingAverage;
	private double onBasePercentage;
	private int RBIs;
	
	public BaseballPlayer(String name, int jerseyNumber, double salary, double battingAverage, double onBasePercentage, int RBIs) {
		super(name, jerseyNumber, salary);
		this.battingAverage = battingAverage;
		this.onBasePercentage = onBasePercentage;
		this.RBIs = RBIs;
	}

	public double getBattingAverage() {
		return battingAverage;
	}

	public double getOnBasePercentage() {
		return onBasePercentage;
	}

	public int getRBIs() {
		return RBIs;
	}
	
	@Override
	public String toString() {
		return super.toString() + ", Batting Average: " + getBattingAverage() + ", On Base Percentage: " + getOnBasePercentage() + ", RBIs: " + getRBIs();
 	}
	
	

}

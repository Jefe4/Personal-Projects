package problem1;

public class FootballPlayer extends CommonPlayerInfo {
	private int totalYards; 
	private int totalTackles;
	private int totalTouchdowns;
		
	public FootballPlayer(String name, int jerseyNumber, double salary, int totalYards, int totalTackles, int totalTouchdowns) {
		super(name, jerseyNumber, salary);
		this.totalYards = totalYards;
		this.totalTackles = totalTackles;
		this.totalTouchdowns = totalTouchdowns;
	}

	public int getTotalYards() {
		return totalYards;
	}

	public int getTotalTackles() {
		return totalTackles;
	}

	public int getTotalTouchdowns() {
		return totalTouchdowns;
	}
	
	@Override
	public String toString() {
		return super.toString() + ", Total Yards: " + getTotalYards() + ", Total Tackles: " + getTotalTackles() + ", Total Touchdowns: " + getTotalTouchdowns();
	}
	
}

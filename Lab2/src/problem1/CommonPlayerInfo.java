package problem1;

public class CommonPlayerInfo {
	private String name;
	private int jerseyNumber;
	private double salary;
	
	public CommonPlayerInfo(String name, int jerseyNumber, double salary) {
		this.name = name;
		this.jerseyNumber = jerseyNumber;
		this.salary = salary;
	}

	public String getName() {
		return name;
	}

	public int getNumber() {
		return jerseyNumber;
	}

	public double getSalary() {
		return salary;
	}
	
	@Override
	public String toString() {
		return "Player name: " + getName() + ", Number:" + getNumber() + ", Salary:"+  getSalary();
		
	}
}

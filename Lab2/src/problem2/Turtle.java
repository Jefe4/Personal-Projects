package problem2;

public class Turtle implements Critter{

	@Override
	public char getChar() {
		return 'T';
	}

	@Override
	public int getMove(CritterInfo info) {
		return (SOUTH * 5) + (WEST * 5) + (NORTH * 5) + (EAST * 5);
	}

}

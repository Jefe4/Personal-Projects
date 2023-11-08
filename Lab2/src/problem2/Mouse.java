package problem2;

public class Mouse implements Critter{


	@Override
	public char getChar() {
		return 'M';
	}

	@Override
	public int getMove(CritterInfo info) {
		return WEST + NORTH;
	}

}

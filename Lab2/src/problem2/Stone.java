package problem2;

public class Stone implements Critter{

	@Override
	public char getChar() {
		return 'S';
	}

	@Override
	public int getMove(CritterInfo info) {
		return CENTER;
	}

}

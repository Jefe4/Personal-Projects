package problem2;

import java.util.Random;

public class Frog implements Critter {

	@Override
	public char getChar() {
		return 'F';
	}

	@Override
	public int getMove(CritterInfo info) {
		int[] move = {NORTH, SOUTH, EAST, WEST};
		Random num = new Random(4);
		return move[num.nextInt()] * 3; // same as bird but times 3
	}

}

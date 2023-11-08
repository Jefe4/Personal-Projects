package problem2;

import java.util.Random;

public class Bird implements Critter{
	
	@Override
	public char getChar() {
		return 'B';
	}

	@Override
	public int getMove(CritterInfo info) {
		int[] move = {NORTH, SOUTH, EAST, WEST};
		Random num = new Random(4);
		return move[num.nextInt()];
	}

}

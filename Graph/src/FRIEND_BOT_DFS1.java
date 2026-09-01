/**
 * FRIEND-BOT: walk the labyrinth, always trying the most expensive unused
 * door first (DFS). Backtracking does not burn fuel.
 *
 * Assignment notes kept from the original file:
 * - If the robot cannot find any rooms it has not explored, it is done searching.
 * - Otherwise, it is done when finding its target. Print a message in
 *   commemoration of this occasion and refrain from destroying any present humans.
 * - Adjacent rooms: visit rooms that are most expensive to reach first.
 * - Backtracking costs nothing. Why doesn't it always move backwards then?
 *   Because the assignment asked for a search order, not the cheapest route.
 *   cheapestPath() on Room is the fuel-aware answer to that joke.
 */
public class FRIEND_BOT_DFS1 {

    public static void main(String[] args) {
        int start = 0;
        Integer target = 11;
        Room graph = Room.assignmentLabyrinth();

        if (args.length >= 1) {
            try {
                graph = Room.fromMatrixFile(args[0]);
                start = graph.fileStartRoom;
            } catch (Exception e) {
                System.out.println("Could not read graph file, using the built-in labyrinth.");
            }
        }
        if (args.length >= 2) {
            target = Integer.parseInt(args[1]);
        }

        System.out.println("FRIEND-BOT powering on. Start room " + start
                + (target == null ? "" : (", hunting room " + target)) + ".");
        graph.printGraph();

        Room.BotReport report = graph.friendBotSearch(start, target);
        System.out.println("Rooms searched, in order: " + report.order);
        System.out.println("Walk (forward moves only): " + graph.visualize(report.steps));
        System.out.println("Fuel burned exploring (backtracks free): " + report.fuel + " liters");

        if (report.foundTarget) {
            System.out.println("Target room " + target
                    + " found. FRIEND-BOT commemorates this occasion and refrains from destroying any present humans. We made a new friend! <3 <3 <3");
        } else if (target != null) {
            System.out.println("No unused doors left and the target was never reached. FRIEND-BOT sits down.");
        } else {
            System.out.println("Map complete. FRIEND-BOT visited " + report.visitedCount + " rooms.");
        }

        if (target != null) {
            Room.PathReport cheap = graph.cheapestPath(start, target.intValue());
            if (cheap.fuel >= 0) {
                System.out.println("If the bot had used cheapest-fuel routing: "
                        + graph.visualize(cheap.steps) + "  (" + cheap.fuel + " L)");
                System.out.println("Difference vs greedy-expensive DFS fuel: "
                        + (report.fuel - cheap.fuel) + " L (search explores more doors than a single path).");
            }
        }
    }
}

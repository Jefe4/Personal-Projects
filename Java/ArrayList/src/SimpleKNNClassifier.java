package Java.ArrayList.src;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.Arrays;

class DataPoint {
    final double[] features;
    final String label;

    public DataPoint(double[] features, String label) {
        this.features = features;
        this.label = label;
    }

    public double[] getFeatures() {
        return features;
    }

    public String getLabel() {
        return label;
    }

    @Override
    public String toString() {
        return "Features: " + java.util.Arrays.toString(features) + ", Label: " + label;
    }
}

class DistanceToPoint {
    final DataPoint point;
    final double distance;

    public DistanceToPoint(DataPoint point, final double distance) {
        this.point = point;
        this.distance = distance;
    }

    public DataPoint getPoint() {
        return point;
    }

    public double getDistance() {
        return distance;
    }
}


public class SimpleKNNClassifier {

    public static double euclideanDistance(DataPoint p1, DataPoint p2) {
        if (p1.getFeatures().length != p2.getFeatures().length) {
            System.err.println("Error: Feature vectors must have the same length for Euclidean distance calculation. p1: " + p1.getFeatures().length + ", p2: " + p2.getFeatures().length);
            return Double.POSITIVE_INFINITY;
        }
        double sum = 0;
        for (int i = 0; i < p1.getFeatures().length; i++) {
            sum += Math.pow(p1.getFeatures()[i] - p2.getFeatures()[i], 2);
        }
        return Math.sqrt(sum);
    }

    /** Fit mean/std on train only, then z-score a feature vector. Avoids leaking query stats. */
    public static double[] zscoreWithTrainStats(double[] features, double[] means, double[] stds) {
        double[] out = new double[features.length];
        for (int i = 0; i < features.length; i++) {
            out[i] = stds[i] == 0 ? 0.0 : (features[i] - means[i]) / stds[i];
        }
        return out;
    }

    public static void fitZscore(List<DataPoint> train, double[] means, double[] stds) {
        int dim = train.get(0).getFeatures().length;
        int n = train.size();
        Arrays.fill(means, 0.0);
        Arrays.fill(stds, 0.0);
        for (DataPoint p : train) {
            for (int i = 0; i < dim; i++) {
                means[i] += p.getFeatures()[i];
            }
        }
        for (int i = 0; i < dim; i++) {
            means[i] /= n;
        }
        for (DataPoint p : train) {
            for (int i = 0; i < dim; i++) {
                double d = p.getFeatures()[i] - means[i];
                stds[i] += d * d;
            }
        }
        for (int i = 0; i < dim; i++) {
            stds[i] = n > 1 ? Math.sqrt(stds[i] / (n - 1)) : 1.0;
        }
    }

    public static List<DataPoint> scaleCopy(List<DataPoint> data, double[] means, double[] stds) {
        List<DataPoint> out = new ArrayList<>();
        for (DataPoint p : data) {
            out.add(new DataPoint(zscoreWithTrainStats(p.getFeatures(), means, stds), p.getLabel()));
        }
        return out;
    }

    public static String classify(List<DataPoint> trainingData, double[] queryFeatures, int k) {
        if (trainingData == null || trainingData.isEmpty()) {
            System.err.println("Error: Training data cannot be empty.");
            return "Error: Training data empty";
        }
        if (queryFeatures == null) {
            System.err.println("Error: Query features cannot be null.");
            return "Error: Query features null";
        }
        if (trainingData.get(0).getFeatures().length != queryFeatures.length) {
             System.err.println("Error: Query features length (" + queryFeatures.length +
                               ") does not match training data features length (" +
                               trainingData.get(0).getFeatures().length + "). Cannot classify.");
            return "Error: Feature length mismatch";
        }
        if (k <= 0) {
            System.err.println("Error: k must be a positive integer.");
            return "Error: k not positive";
        }
        if (k > trainingData.size()) {
            System.err.println("Warning: k ("+ k +") is larger than training data size ("+ trainingData.size() +"). Setting k to training data size.");
            k = trainingData.size();
        }

        DataPoint queryPoint = new DataPoint(queryFeatures, "");
        List<DistanceToPoint> distances = new ArrayList<>();

        for (DataPoint trainPoint : trainingData) {
            double dist = euclideanDistance(queryPoint, trainPoint);
            distances.add(new DistanceToPoint(trainPoint, dist));
        }

        distances.sort(Comparator.comparingDouble(DistanceToPoint::getDistance));

        Map<String, Integer> labelCounts = new HashMap<>();
        for (int i = 0; i < k; i++) {
            String label = distances.get(i).getPoint().getLabel();
            labelCounts.put(label, labelCounts.getOrDefault(label, 0) + 1);
        }

        String predictedLabel = null;
        int maxCount = -1;
        for (Map.Entry<String, Integer> entry : labelCounts.entrySet()) {
            if (entry.getValue() > maxCount) {
                maxCount = entry.getValue();
                predictedLabel = entry.getKey();
            }
        }
        return predictedLabel;
    }

    public static List<DataPoint> loadData(String filePath) {
        List<DataPoint> data = new ArrayList<>();
        File file = new File(filePath);

        try (Scanner scanner = new Scanner(file)) {
            while (scanner.hasNextLine()) {
                String line = scanner.nextLine().trim();
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }
                String[] parts = line.split(",");
                if (parts.length < 2) {
                    System.err.println("Skipping malformed line (not enough parts): " + line);
                    continue;
                }

                double[] features = new double[parts.length - 1];
                try {
                    for (int i = 0; i < parts.length - 1; i++) {
                        features[i] = Double.parseDouble(parts[i].trim());
                    }
                    String label = parts[parts.length - 1].trim();
                    if (label.isEmpty()) {
                        System.err.println("Skipping line with empty label: " + line);
                        continue;
                    }
                    data.add(new DataPoint(features, label));
                } catch (NumberFormatException e) {
                    System.err.println("Skipping malformed line (number format error): " + line + " - " + e.getMessage());
                }
            }
        } catch (FileNotFoundException e) {
            System.err.println("Error: Data file not found at '" + file.getAbsolutePath() + "'");
        }
        return data;
    }

    static File resolveDataFile(String name) {
        File[] candidates = new File[] {
            new File(name),
            new File("Java/ArrayList/src/" + name),
            new File("src/" + name)
        };
        for (File f : candidates) {
            if (f.exists()) {
                return f;
            }
        }
        return candidates[0];
    }

    static void runChronologicalEval(List<DataPoint> series, int k) {
        if (series.size() < 10) {
            System.out.println("Not enough rows for a chronological split.");
            return;
        }
        int split = (int) (series.size() * 0.7);
        List<DataPoint> train = series.subList(0, split);
        List<DataPoint> query = series.subList(split, series.size());
        int dim = train.get(0).getFeatures().length;
        double[] means = new double[dim];
        double[] stds = new double[dim];
        fitZscore(train, means, stds);
        List<DataPoint> trainZ = scaleCopy(train, means, stds);

        int correct = 0;
        for (DataPoint q : query) {
            double[] qz = zscoreWithTrainStats(q.getFeatures(), means, stds);
            String pred = classify(trainZ, qz, k);
            if (pred != null && pred.equals(q.getLabel())) {
                correct++;
            }
        }
        double acc = 100.0 * correct / query.size();
        System.out.println("\nChronological split (no shuffle): train=" + train.size() + " query=" + query.size());
        System.out.println("Train-only z-score, k=" + k + ", last-30% accuracy: " + String.format("%.1f", acc) + "% (" + correct + "/" + query.size() + ")");
        System.out.println("Shuffling time series before this split would leak the future into the past.");
    }

    public static void main(String[] args) {
        File regime = resolveDataFile("knn_regime.csv");
        File toy = resolveDataFile("knn_data.csv");
        int k = 5;
        if (args.length > 0) {
            try {
                k = Integer.parseInt(args[0]);
            } catch (NumberFormatException e) {
                System.err.println("Warning: could not parse k. Using 5.");
            }
        }

        if (regime.exists()) {
            List<DataPoint> series = loadData(regime.getPath());
            System.out.println("Loaded " + series.size() + " chronological regime rows from " + regime.getPath());
            runChronologicalEval(series, k);
        }

        if (toy.exists()) {
            List<DataPoint> trainingData = loadData(toy.getPath());
            System.out.println("\nLoaded " + trainingData.size() + " toy points from " + toy.getPath());
            double[] query1 = {1.2, 2.8};
            if (!trainingData.isEmpty() && trainingData.get(0).getFeatures().length == query1.length) {
                String predictedLabel1 = classify(trainingData, query1, 3);
                System.out.println("Toy query " + Arrays.toString(query1) + " -> " + predictedLabel1);
            }
        }
    }
}

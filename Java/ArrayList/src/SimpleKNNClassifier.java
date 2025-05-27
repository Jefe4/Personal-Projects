package Java.ArrayList.src; // Assuming this package structure based on path

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.Arrays; // Added for Arrays.toString

// Define DataPoint class/record
class DataPoint { // Made non-public to be in the same file as SimpleKNNClassifier
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

// Helper class for storing distance to a datapoint
class DistanceToPoint { // Made non-public
    final DataPoint point;
    final double distance;

    public DistanceToPoint(DataPoint point, double distance) {
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

        DataPoint queryPoint = new DataPoint(queryFeatures, ""); // Label is irrelevant for query
        List<DistanceToPoint> distances = new ArrayList<>();

        for (DataPoint trainPoint : trainingData) {
            double dist = euclideanDistance(queryPoint, trainPoint);
            distances.add(new DistanceToPoint(trainPoint, dist));
        }

        // Sort by distance
        distances.sort(Comparator.comparingDouble(DistanceToPoint::getDistance));

        // Get top k neighbors
        Map<String, Integer> labelCounts = new HashMap<>();
        for (int i = 0; i < k; i++) {
            String label = distances.get(i).getPoint().getLabel();
            labelCounts.put(label, labelCounts.getOrDefault(label, 0) + 1);
        }

        // Find the majority label
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
                if (line.isEmpty() || line.startsWith("#")) { // Skip empty lines or comments
                    continue;
                }
                String[] parts = line.split(",");
                // Expecting at least one feature and a label, so parts.length >= 2
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
            System.err.println("Please create 'knn_data.csv' in the 'Java/ArrayList/src/' directory with sample data (e.g., '1.0,2.0,A').");
        }
        return data;
    }


    public static void main(String[] args) {
        // Path for knn_data.csv. This assumes the program is run from the project root directory.
        // If running from Personal-Projects/Java/ArrayList/src, the path should be "knn_data.csv"
        // For consistency, let's assume it's relative to the project root.
        String dataFilePath = "Java/ArrayList/src/knn_data.csv"; 
        List<DataPoint> trainingData = loadData(dataFilePath);

        if (trainingData.isEmpty()) {
            System.out.println("Could not load training data or data is empty from '" + dataFilePath + "'. Exiting.");
            return;
        }

        System.out.println("Loaded " + trainingData.size() + " data points:");
        for(DataPoint dp : trainingData) {
            System.out.println("  " + dp);
        }
        
        // Example queries
        double[] query1 = {1.2, 2.8}; 
        int k = 3; // Default k
        
        if (args.length > 0) {
            try {
                k = Integer.parseInt(args[0]);
                System.out.println("\nUsing k from command line argument: " + k);
                if (args.length > 1) {
                    query1 = new double[args.length -1];
                    for(int i=1; i < args.length; i++) {
                        query1[i-1] = Double.parseDouble(args[i]);
                    }
                     System.out.println("Using query features from command line argument: " + Arrays.toString(query1));
                }
            } catch (NumberFormatException e) {
                System.err.println("Warning: Could not parse command line arguments for k and query features. Using defaults.");
            }
        }


        // Check if features length matches training data before classifying
        if (!trainingData.isEmpty() && trainingData.get(0).getFeatures().length != query1.length) {
            System.out.println("\nQuery features length (" + query1.length + 
                               ") does not match training data features length (" + 
                               trainingData.get(0).getFeatures().length + "). Cannot classify query: " + Arrays.toString(query1));
        } else {
            String predictedLabel1 = classify(trainingData, query1, k);
            System.out.println("\nQuery point: " + Arrays.toString(query1));
            System.out.println("K value: " + k);
            System.out.println("Predicted label: " + predictedLabel1);
        }

        // Another example query (if no command line args used)
        if (args.length == 0) { // Only run this second example if no cmd line args
            double[] query2 = {5.0, 5.0}; 
            if (!trainingData.isEmpty() && trainingData.get(0).getFeatures().length != query2.length) {
                 System.out.println("\nQuery features length (" + query2.length + 
                                   ") does not match training data features length (" + 
                                   trainingData.get(0).getFeatures().length + "). Cannot classify query: " + Arrays.toString(query2));
            } else {
                String predictedLabel2 = classify(trainingData, query2, k);
                System.out.println("\nQuery point: " + Arrays.toString(query2));
                System.out.println("K value: " + k);
                System.out.println("Predicted label: " + predictedLabel2);
            }
        }
    }
}

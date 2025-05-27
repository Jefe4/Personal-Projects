# Java k-Nearest Neighbors (k-NN) Classifier Example

This project demonstrates a simple implementation of the k-Nearest Neighbors (k-NN) algorithm in Java. The code is located in `src/SimpleKNNClassifier.java`.

## Overview

The k-NN algorithm is a non-parametric, instance-based learning algorithm used for classification and regression. For classification, an object is classified by a majority vote of its neighbors, with the object being assigned to the class most common among its `k` nearest neighbors.

This example includes:
*   A `DataPoint` class to represent data instances with features and a label.
*   A method to calculate Euclidean distance between two data points.
*   A `classify` method that implements the k-NN logic.
*   A `main` method in `SimpleKNNClassifier.java` to load sample data from `src/knn_data.csv`, classify sample query points, and print the results.

## Files
*   `src/SimpleKNNClassifier.java`: Contains the Java source code for the k-NN implementation.
*   `src/knn_data.csv`: A sample CSV file containing feature data and labels used for training/testing the classifier. Each row is an instance, with comma-separated numeric features followed by a class label (e.g., `1.0,2.5,A`).

## Data Format (`knn_data.csv`)
The `src/knn_data.csv` file should contain data in the following format:
`feature1,feature2,...,featureN,Label`

Example:
```csv
1.0,2.0,A
1.5,2.5,A
5.0,6.0,B
```
The current implementation in `SimpleKNNClassifier.java` assumes all features are `double` values and the label is a `String`.

## Building and Running

### Prerequisites
*   Java Development Kit (JDK) installed (e.g., JDK 8 or newer).

### Compilation
Navigate to the `Java/ArrayList/src/` directory from your project's root directory and compile the Java file:

```bash
# Navigate to the source directory
cd Java/ArrayList/src

# Compile
javac SimpleKNNClassifier.java
```
Alternatively, if your project is set up with an IDE like Eclipse or IntelliJ IDEA, you can usually compile and run directly from the IDE. Ensure the package declaration in `SimpleKNNClassifier.java` (e.g., `package Java.ArrayList.src;`) matches your project structure if running from a root that's not `Personal-Projects/`. For command-line compilation from the project root (`Personal-Projects/`), you might need:
```bash
javac Java/ArrayList/src/SimpleKNNClassifier.java
```


### Running
After successful compilation:

1.  **If you compiled from within `Java/ArrayList/src/`:**
    You can run the classifier. Make sure `knn_data.csv` is in the same directory (`src/`).
    ```bash
    # Make sure you are in Java/ArrayList/src/
    java SimpleKNNClassifier
    ```
    The program uses a relative path `knn_data.csv` if it's run from the directory containing the class file and the CSV.
    If the `SimpleKNNClassifier.java` has a package declaration like `package Java.ArrayList.src;`, you need to run it from the directory that is the root of this package structure (i.e., from `Personal-Projects/` in this case):
    ```bash
    # From the project root (e.g., Personal-Projects/)
    java Java.ArrayList.src.SimpleKNNClassifier
    ```
    The `loadData` method in the Java code currently uses `String dataFilePath = "Java/ArrayList/src/knn_data.csv";` which is relative to the project root.

The program will:
1.  Load data from `Java/ArrayList/src/knn_data.csv`.
2.  Print the loaded data.
3.  Classify a few hardcoded sample query points.
4.  Print the query points, the chosen `k` value, and their predicted labels.

You can modify the `main` method in `SimpleKNNClassifier.java` to test different query points or `k` values.
```

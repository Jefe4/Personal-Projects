# Python Scripts for Utility and AI/ML Concepts

This directory contains various Python scripts. Some are simple utilities, while others have been enhanced to demonstrate concepts relevant to Artificial Intelligence (AI) and Machine Learning (ML).

## ML Math Toolkit (`ml_math_toolkit.py`)

This script provides a set of basic mathematical operations commonly used in ML algorithms, implemented using the NumPy library. It replaces the previous `calculator_project.py`.

### Features:
*   **Vector Operations:**
    *   `vector_dot_product(vec1, vec2)`: Computes the dot product of two vectors.
    *   `vector_elementwise_add(vec1, vec2)`: Performs element-wise addition of two vectors.
*   **Matrix Operations:**
    *   `matrix_multiply(mat1, mat2)`: Multiplies two matrices.
*   **Activation Functions:**
    *   `sigmoid(x)`: Computes the sigmoid function.
    *   `relu(x)`: Computes the Rectified Linear Unit (ReLU) function.
*   Includes basic error handling for incompatible shapes or types.

### Dependencies:
*   **NumPy**: A fundamental package for scientific computing in Python.
    To install NumPy, run:
    ```bash
    pip install numpy
    ```

### Usage:
To see examples of these functions in action, you can run the script directly:
```bash
python ml_math_toolkit.py
```
The script's `if __name__ == "__main__":` block contains demonstrations of each function with sample data and expected outputs, including error handling examples. You can also import these functions into your own Python scripts:
```python
import numpy as np
from ml_math_toolkit import vector_dot_product, sigmoid

# Example usage in another script
my_vec1 = np.array([1, 2, 3])
my_vec2 = np.array([4, 5, 6])
print(vector_dot_product(my_vec1, my_vec2))

print(sigmoid(np.array([-1, 0, 1])))
```

## Other Scripts

### String Slicing (`string_slicing.py`)
*   Demonstrates various string manipulation techniques in Python.
*   **AI/ML Context**: String manipulation is a foundational element of Natural Language Processing (NLP). Tasks like tokenization (splitting text into words or sub-words), stemming (reducing words to their root form), and lemmatization rely heavily on these techniques before text data can be fed into ML models.

### Circle Area Calculation (`Calculate_area.py`)
*   A simple script to calculate the area and circumference of a circle.
*   **AI/ML Context**: While basic, geometric calculations like these can be part of feature engineering in ML. For example, in computer vision, extracting geometric properties (area, perimeter, aspect ratio) of detected objects can create useful features for classification or other tasks. Similarly, in spatial data analysis, geometric features are often crucial.
```

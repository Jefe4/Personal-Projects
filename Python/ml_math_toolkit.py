import numpy as np

# --- Vector Operations ---
def vector_dot_product(vec1, vec2):
    if not isinstance(vec1, np.ndarray) or not isinstance(vec2, np.ndarray):
        print("Error: Inputs must be NumPy arrays.")
        return None
    if vec1.ndim != 1 or vec2.ndim != 1: # Check if they are 1D arrays
        print(f"Error: Both inputs must be 1D vectors. vec1 dim: {vec1.ndim}, vec2 dim: {vec2.ndim}.")
        return None
    # Dot product doesn't require same shape for 1D vectors, but number of elements must match.
    # vec1.shape[0] should be equal to vec2.shape[0]
    if vec1.shape[0] != vec2.shape[0]:
        print(f"Error: Incompatible shapes for dot product. Number of elements must be the same. vec1: {vec1.shape[0]}, vec2: {vec2.shape[0]}.")
        return None
    try:
        result = np.dot(vec1, vec2)
        return result
    except Exception as e:
        print(f"Error during dot product: {e}")
        return None

def vector_elementwise_add(vec1, vec2):
    if not isinstance(vec1, np.ndarray) or not isinstance(vec2, np.ndarray):
        print("Error: Inputs must be NumPy arrays.")
        return None
    if vec1.shape != vec2.shape:
        print(f"Error: Incompatible shapes for element-wise addition. vec1: {vec1.shape}, vec2: {vec2.shape}.")
        return None
    try:
        result = vec1 + vec2
        return result
    except Exception as e:
        print(f"Error during element-wise addition: {e}")
        return None

# --- Matrix Operations ---
def matrix_multiply(mat1, mat2):
    if not isinstance(mat1, np.ndarray) or not isinstance(mat2, np.ndarray):
        print("Error: Inputs must be NumPy arrays.")
        return None
    if mat1.ndim != 2 or mat2.ndim != 2:
        print(f"Error: Inputs must be 2D matrices. mat1 dim: {mat1.ndim}, mat2 dim: {mat2.ndim}.")
        return None
    if mat1.shape[1] != mat2.shape[0]:
        print(f"Error: Incompatible shapes for matrix multiplication. mat1 columns ({mat1.shape[1]}) must equal mat2 rows ({mat2.shape[0]}).")
        return None
    try:
        result = np.matmul(mat1, mat2)
        return result
    except Exception as e:
        print(f"Error during matrix multiplication: {e}")
        return None

# --- Activation Functions ---
def sigmoid(x):
    # Allow numbers (int, float), lists, and NumPy arrays
    if not isinstance(x, (np.ndarray, int, float, list)):
        print("Error: Input must be a NumPy array, a number (int/float), or a list.")
        return None
    try:
        # Convert to np.asarray to handle numbers, lists, and arrays uniformly
        result = 1 / (1 + np.exp(-np.asarray(x, dtype=float))) # Ensure float for np.exp
        return result
    except Exception as e:
        print(f"Error during sigmoid calculation: {e}")
        return None

def relu(x):
    # Allow numbers (int, float), lists, and NumPy arrays
    if not isinstance(x, (np.ndarray, int, float, list)):
        print("Error: Input must be a NumPy array, a number (int/float), or a list.")
        return None
    try:
        # Convert to np.asarray to handle numbers, lists, and arrays uniformly
        result = np.maximum(0, np.asarray(x, dtype=float)) # Ensure float for np.maximum
        return result
    except Exception as e:
        print(f"Error during ReLU calculation: {e}")
        return None

if __name__ == "__main__":
    print("--- ML Math Toolkit Examples ---")

    # Vector examples
    v1 = np.array([1, 2, 3])
    v2 = np.array([4, 5, 6])
    v_row_test = np.array([[1,2,3]]) # To test 1D check in dot product
    v_col_test = np.array([[1],[2],[3]]) # To test 1D check

    print(f"\nVector v1: {v1}")
    print(f"Vector v2: {v2}")

    dot_prod = vector_dot_product(v1, v2)
    if dot_prod is not None:
        print(f"Dot product of v1 and v2: {dot_prod}")
    
    elem_add = vector_elementwise_add(v1, v2)
    if elem_add is not None:
        print(f"Element-wise addition of v1 and v2: {elem_add}")

    # Matrix examples
    m1 = np.array([[1, 2], [3, 4]])
    m2 = np.array([[5, 6], [7, 8]])
    print(f"\nMatrix m1:\n{m1}")
    print(f"Matrix m2:\n{m2}")

    mat_prod = matrix_multiply(m1, m2)
    if mat_prod is not None:
        print(f"Matrix multiplication of m1 and m2:\n{mat_prod}")

    # Activation function examples
    scalar_val = 0.5
    list_vals = [-10.0, -0.5, 0.0, 0.5, 10.0] # Use floats in list for consistency
    array_vals = np.array([-2.0, -1.0, 0.0, 1.0, 2.0])

    print(f"\nSigmoid of scalar {scalar_val}: {sigmoid(scalar_val)}")
    print(f"ReLU of scalar {scalar_val}: {relu(scalar_val)}")
    
    print(f"\nSigmoid of list {list_vals}: {sigmoid(list_vals)}")
    print(f"ReLU of list {list_vals}: {relu(list_vals)}")

    print(f"\nSigmoid of array {array_vals}: {sigmoid(array_vals)}")
    print(f"ReLU of array {array_vals}: {relu(array_vals)}")

    print("\n--- Error Handling Examples ---")
    # Vector errors
    v_bad_shape_dot = np.array([1,2]) # Different number of elements than v1
    print(f"\nAttempting dot product with v1: {v1} and v_bad_shape_dot: {v_bad_shape_dot}")
    vector_dot_product(v1, v_bad_shape_dot)

    print(f"\nAttempting dot product with v1: {v1} and a 2D row array v_row_test: {v_row_test}")
    vector_dot_product(v1, v_row_test) 
    
    print(f"\nAttempting dot product with v1: {v1} and a 2D col array v_col_test: {v_col_test}")
    vector_dot_product(v1, v_col_test) 

    v_bad_shape_add = np.array([10, 20]) # Different shape from v1 for addition
    print(f"\nAttempting element-wise add with v1: {v1} and v_bad_shape_add: {v_bad_shape_add}")
    vector_elementwise_add(v1, v_bad_shape_add)

    # Matrix errors
    m_bad_shape_mult = np.array([[1,2,3],[4,5,6]]) # 2x3, m1 is 2x2, incompatible for m1 @ m_bad_shape_mult
    print(f"\nAttempting matrix multiplication with m1 (2x2):\n{m1}\nand m_bad_shape_mult (2x3):\n{m_bad_shape_mult}")
    matrix_multiply(m1, m_bad_shape_mult) # m1.shape[1] (2) == m_bad_shape_mult.shape[0] (2) -> this should actually work! Let's test m_bad_shape_mult @ m1
    
    print(f"\nAttempting matrix multiplication with m_bad_shape_mult (2x3) and m1 (2x2):") # This should fail
    matrix_multiply(m_bad_shape_mult, m1)


    print(f"\nAttempting matrix multiplication with m1 (2x2):\n{m1}\nand a 1D array v1: {v1}")
    matrix_multiply(m1, v1) 

    # Activation function errors
    print("\nAttempting sigmoid with incompatible type (string):")
    sigmoid("test_string")

    print("\nAttempting relu with incompatible type (complex number):")
    relu(1+2j) 
    
    print("\n--- Testing with various valid inputs for activation functions ---")
    print(f"Sigmoid of -1 (int): {sigmoid(-1)}")
    print(f"ReLU of -3.5 (float): {relu(-3.5)}")
    print(f"Sigmoid of [1, 2, 3] (list of ints): {sigmoid([1, 2, 3])}")
    print(f"ReLU of [-1.0, 0.0, 1.5] (list of floats): {relu([-1.0, 0.0, 1.5])}")
    print(f"Sigmoid of np.array([0]): {sigmoid(np.array([0]))}")
    print(f"ReLU of np.array([-5, 5]): {relu(np.array([-5, 5]))}")
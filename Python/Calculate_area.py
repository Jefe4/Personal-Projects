# AI/ML Context for Geometric Calculations:
# While this script performs basic geometric calculations (area and circumference),
# such computations can be vital in the feature engineering stage of an ML pipeline,
# especially in domains like:
#   - Computer Vision: Extracting geometric properties of objects detected in images
#     (e.g., area of a detected tumor, aspect ratio of a bounding box for an item)
#     can provide crucial features for image classification, object detection, or segmentation models.
#   - Spatial Data Analysis: Analyzing geographic data often involves calculating areas of regions,
#     distances between points, or other geometric features that can be used as input for
#     predictive models (e.g., predicting housing prices based on lot area).
#   - Robotics and Autonomous Systems: Calculating distances, areas, and volumes is essential
#     for navigation, path planning, and object manipulation.
# These fundamental calculations help transform raw data into a more informative
# representation for ML algorithms.

# Calculate the area and circumference of a circle

import math

# Function to calculate the area of a circle
def calculate_area(radius):
    # ...existing code...
    return math.pi * (radius ** 2)

# Function to calculate the circumference of a circle
def calculate_circumference(radius):
    # ...existing code...
    return 2 * math.pi * radius

# Main function to get user input and perform calculations
def main():
    # Get user input for the radius
    radius_str = input("Enter a radius: ")
    
    try:
        # Convert the input string to an integer
        radius_int = int(radius_str)
        
        # Ensure the radius is positive
        if radius_int <= 0:
            raise ValueError("Radius must be a positive number.")
        
        # Calculate area and circumference
        area = calculate_area(radius_int)
        circumference = calculate_circumference(radius_int)
        
        # Print the results
        print("Area of a circle is", area, ", circumference of a circle is", circumference)
    
    except ValueError as e:
        # Handle invalid input
        print("Invalid input:", e)

# Call the main function
if __name__ == "__main__":
    main()

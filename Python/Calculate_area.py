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

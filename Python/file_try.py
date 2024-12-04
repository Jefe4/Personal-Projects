# Try to open input and output files, reverse each line from input and write to output
try:
    input_file = open("input1.txt","r")
    output_file = open("output.txt","w")

    # Process each line in the input file
    for line_str in input_file:
        new_str = ""
        line_str = line_str.strip()
        # Reverse the line
        for char in line_str:
            new_str = char + new_str
        # Write the reversed line to the output file
        print(new_str, file= output_file)

    input_file.close()
    output_file.close()
except FileNotFoundError:
    # Handle the case where the input file does not exist
    print("The file input1.txt doesn't exist")
    
# Try to read a number from user input and determine if it is even or odd
try:
    num1 = int(input("Enter a number: "))
    if num1 % 2 == 0:
        print(num1,"is even")
    else:
        print(num1,"is odd")
except ValueError:
    # Handle the case where the input is not a valid integer
    print("Please enter a number: ")

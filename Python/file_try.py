try:
    input_file = open("input1.txt","r")
    output_file = open("output.txt","w")

    for line_str in input_file:
        new_str = ""
        line_str = line_str.strip()
        for char in line_str:
            new_str = char + new_str
        print(new_str, file= output_file)

    input_file.close()
    output_file.close()
except FileNotFoundError:
    print("The file input1.txt doesn't exist")
    
try:
    num1 = int(input("Enter a number: "))
    if num1 % 2 == 0:
        print(num1,"is even")
    else:
        print(num1,"is odd")

except ValueError:
    print("Please enter a number: ")

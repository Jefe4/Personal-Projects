# A variable is a reserved memory location where it stores value. To later use it in the program and will recall that variable.
# y= Jim  x= Shoes n = buy   y likes to n x every week. 
# Is a finite sequence of well-defined instructions to solve a problem or perform a computation
# The # will show the python interpreter that it's just a comment which is used for notes to help the programmer. The comment won't show if you run the program.
# 1. Integers 2. Floating Point numbers 3. Complex numbers
# Print() .casefold() int(input)
# print is used for displaying anything within " " .casefold is for words to not be caps sensitive int or input allows the user to input a word or numbers
# We can write strings in if statements which could include series of steps to execute the code. 

import math
radius_str = input("Enter a radius: ")
radius_int = int(radius_str)
pi = 3.14 
area = math.pi*(radius_int**2)
circumference = 2 * math.pi * radius_int

print("Area of a circle is int", area ,",circumference of a circle is", circumference)

# by using import math to include certain properties

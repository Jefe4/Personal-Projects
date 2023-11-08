# calculate area and circumference of a circle 
# steps
# prompt user for radius 
# use the area formula to get the area of a circle 
# use the circumference formula to get the circumference of the circle 
# print results to the user 

# input returns a string variable 
# data types 
# string str()- sequence of integers 
# interger int() - whole numbers (-ve,+ve)
# float() - real numbers , decimal point values 
# bool - True or False



import math
radius_str = input("Enter a radius: ")
radius_int = int(radius_str)
pi = 3.14 
area = math.pi*(radius_int**2)
circumference = 2 * math.pi * radius_int

print("Area of a circle is int", area ,",circumference of a circle is", circumference)



# write a program that will get two values from the iser and print the multiplication of both values
# print the mulitplication of both values 


      

num1 = int(input("Enter first value: "))
num2 = int(input("Enter second value: "))
result = print("The answer is:",(num1*num2))

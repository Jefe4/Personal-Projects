# Demonstrate various Python concepts

# 1. Print numbers between 100 and 1000 that are divisible by 17
for i in range(100, 1000):
    if i % 17 == 0:
        print(i)

# 3. Difference between 'is' and '=='
num1 = 25
num2 = 24
num3 = 25

print(num1 is num2)  # False
print(num1 is num3)  # True
print(num1 == num3)  # True

# 7. Value a would be true but value b would be false

# 8. An iterator is an object that contains a countable number of values
mystr = "Strawberry"
for i in mystr:
    print(i)

myfruits = ("Mangos", "Berries", "Banana")
for i in myfruits:
    print(i)

# 10. Logical operations
x = 2
y = 2
z = 4
print(x or y)  # 2
print(x and y)  # 2
print(x or z)  # 2
print(x and y or y and z)  # 2

# 11. Loop example
i = 1
while i < 17:
    if i % 2 == 0:
        print(i)
    i += 1

# 20. Input validation
num = input("Enter an Integer: ")
if num.isdigit():
    print(num)
else:
    print("Error, please enter an integer")

# Example of a syntax error
"""
my_int = 5
my_int = my_int + 3
print(my_int)
"""

# Corrected example
my_int = 5
my_int += 3
print(my_int)  # 8

# Example of integer division
x = 4
y = 5
print(x // y)  # 0

# Example of type conversion
var_1 = 2.0
var_2 = "apple"
var_3 = 'orange'
var_4 = 4

print(var_1)  # 2.0
print(var_2)  # apple
print(var_3)  # orange
print(var_1 / var_4)  # 0.5
# print(var_4 + var_3)  # Error
print(var_2 + var_3)  # appleorange

# Find the largest number among three inputs
num_1 = int(input("Enter first number: "))
num_2 = int(input("Enter second number: "))
num_3 = int(input("Enter third number: "))

if num_1 >= num_2 and num_1 >= num_3:
    print("Largest number is", num_1)
elif num_2 >= num_1 and num_2 >= num_3:
    print("Largest number is", num_2)
else:
    print("Largest number is", num_3)

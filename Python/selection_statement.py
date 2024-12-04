# When do we use elif in python? - It's used to include multiple conditional expressions between if and else.
# Why do we need to indent for if, elif, else? - The indentation tells the python interpreter that the indented lines are part of the conditional block. Without it, the interpreter wouldn't recognize them as part of the statement.
# What is the difference between = and ==? - = is used for assignment while == is used for comparison.
# 4

num1 = int(input("Enter first number -  "))
num2 = int(input("Enter second number - "))

if num1 > num2:
    print(num1)
elif num1 == num2:
    print(num1)
else:
    print(num2)

# 5
import random

guessesTaken = 0
num = random.randint(1, 5)  # Generate a random number between 1 and 5

guess = int(input("Enter a number between 1-5: "))
guessesTaken += 1

if guess > num:
    print("Wrong guess")
elif guess < num:
    print("Wrong guess")
else:
    print("Correct")

# 6
age = int(input("Enter age: "))
assign = input("Have you completed your assignment? (yes or no): ").casefold()

if age >= 12:
    if assign == "yes":
        print("You can play Fortnite")
    elif assign == "no":
        print("Complete your assignment before playing Fortnite.")
    else:
        print("Invalid input")
else:
    print("Not allowed to play Fortnite")




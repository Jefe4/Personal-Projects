# When do we use elif in python? - It's used to include multiple conditional expression between if and else.
# Why do we need to indent for if,elif,else? - The idention would tell the python interpreter that the line under the header are the statements and should be followed. Without it the interpreter wouldn't see it as a statement.
# What is the difference between = and ==? - = means the assignment while == means equal to.
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

num = int(input("Enter a number between 1-5")

guess = int(input(guess))

guessesTaken = guessesTaken + 1

if guess > num
    print("Wrong guess")

if guess < num
    print("Wrong guess")

if guess == num
    print("Correct")

# 6

age = int(input("Enter age :  ")
assign.casefold() = int(input(" yes or no ")


if age ≥ 12
    print("Have you completed your assignment? : yes or no? -   ")


if assign == "yes" :
    print("You can play fortnite")

elif assign == "no" :
    print("Complete your assignment before playing fortnite.")

else:
    print("Not allowed to play fortnite")


          

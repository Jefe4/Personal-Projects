#


import random

pr_guess = random.randint(1,50)

while True:
    pl_guess = int(input("Enter your guess, from 1-50: "))

    if pr_guess == pl_guess:
        print("You guessed the number",pr_guess)
        break

    elif pr_guess > pl_guess:
        print("you guessed too small, guess a larger number")

    elif pr_guess < pl_guess:
        print("guess too high; lower number")

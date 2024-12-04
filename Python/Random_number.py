# Guess the number game

import random
c_guess = random.randint(1, 50)
count = 0
max_attempts = 5  # Maximum number of attempts allowed

while True:
    p_guess = int(input("Enter your guess (1-50): "))
    count += 1

    if c_guess == p_guess:
        print("You guessed right!")
        break
    elif c_guess < p_guess and p_guess <= 50:
        print("You guessed high.")
    elif c_guess > p_guess and p_guess >= 1:
        print("You guessed low.")
    else:
        print("Out of range.")

    if count >= max_attempts:
        print("You've reached the maximum number of attempts.")
        break

print("Number was", c_guess)

# Write a program that prints all numbers divisible by 4

# Using a for loop
for i in range(10, 100):
    if i % 4 == 0:
        print(i)

# Using a while loop
i = 10
while i <= 99:
    if i % 4 == 0:
        print(i, "is divisible by 4")
    i += 1


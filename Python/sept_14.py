

# guess the num

import random
c_guess = random.randint(1,50)
count = 0

While True:
    p_guess = int(input("Enter your guess, 1,50: "))
    count += 1

    if c_guess == p_guess:
        print("You guessed right")
        break
    elif c_guess < p_guess and p_guess <= 50:
        print("You guessed high")

    elif c_guess > p_guess and p_guess >= 1:
        print("You guess low")
    else:
        print("out of range")
print("Number was", c_guess)


"""
# write a program that prints all numbers divisible by 4

for i in range(10,100):
    if i%4 == 0:
        print(i)


# or

i=10
while i <= 99:
    if i%4 == 0:
        print(i "is divisible by 4")
    i += 1
"""

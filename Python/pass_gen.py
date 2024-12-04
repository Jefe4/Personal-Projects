"""
name = "Jeffrey Alberto Gomez"
>>> first,middle,last = name.split()
>>> name
'Jeffrey Alberto Gomez'
>>> first_name = first
>>> print(last)
Gomez
>>>
"""

# password generator
# create a pool of characters, digits, alphabets, punctuations
# import string, random
# ask user to enter length of password
# check if password length meets requirements
# generate password

import random, string

# Define the pool of characters
char = string.ascii_letters + string.digits + string.punctuation
print("This is where the password is chosen from:", char)

# Function to generate a single password
def generate_password(length):
    password = ""
    for i in range(length):
        password += random.choice(char)
    return password

# Ask user for the number of passwords
num_of_pass = int(input("How many passwords do you need?: "))

# Loop to generate the required number of passwords
for _ in range(num_of_pass):
    while True:
        length_of_pass = int(input("How long do you want your password to be: "))
        
        if length_of_pass < 8:
            print("Password is too short. Minimum is 8 characters.")
            continue
        if length_of_pass > 20:
            print("Password is too long. Maximum is 20 characters.")
            continue
        
        # Generate and print the password
        password = generate_password(length_of_pass)
        print(password)
        break

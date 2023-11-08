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
# create a pool xters, digits, alphabets, punctuations
# import string, random
# ask user to enter length of password
# check if password length meets req.
# generate password

import random, string

char = string.ascii_letters + string.digits + string.punctuation
print("This is where the password is chosen from.",char)

print("possible elements", char)
print()

num_of_pass = int(input("How many passwords do you need?: ")
                

while True:
    length_of_pass = int(input("How long do you want your password to be: "))
    
    if length_of_pass < 6:
        print("Password is too short.")
        continue
    if length_of_pass > 20:
        print("Password is too long.")
        continue
    for i in range(num_of_pass):
        password_list = []
        password_str = "" 
    for j in range(length_of_pass):
        password_list = random.sample(chars, length_of_pass)
    print(password_str.join(password_list))
    break

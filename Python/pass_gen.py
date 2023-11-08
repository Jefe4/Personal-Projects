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



while True:
    length_of_pass = int(input("How long do you want your password to be: "))
    
    if length_of_pass < 8 or length_of_pass > 20:
        print("Minimum is 8, maximum is 20")
    else:
        break
password = ""
for i in range(length_of_pass):
    password += random.choice(char)

print(password)

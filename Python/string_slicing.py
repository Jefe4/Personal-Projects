# String slicing and manipulation examples

str1 = "Monty Python"
print(str1[0])  # M, first character
print(str1[11])  # n, twelfth character
print(str1[-1])  # n, last character
print(str1[0:5])  # Monty, first five characters

str2 = "homebody"
print(str2[0:4])  # home, first four characters
print(str2[4:8])  # body, last four characters

x = "water"
x = x.replace("w", "c")
print(x)  # cater, replace 'w' with 'c'

S = "What is your name?"
print(S[::2])  # Wats o aei, every second character
print(S[2:8:-1])  # (empty string), reverse slicing with positive step results in empty string

x = "This is a test."
print(x * 3)  # This is a test.This is a test.This is a test., repeat string three times

S = " I had a cat named amanda when I was little"
count = S.count("a")
print(count)  # 7, count occurrences of 'a'

S = "Spam "
print(S * 5 + "baked beans" + S * 4)  # Spam Spam Spam Spam Spam baked beans Spam Spam Spam Spam, concatenate repeated strings

print("I like writing in Python.", "It is so much fun.")  # I like writing in Python. It is so much fun., print multiple strings

s = "CAT"
print(s.upper().lower())  # cat, convert to upper then lower case
s = "Cat"
print(s.upper().lower())  # cat, convert to upper then lower case

# More complicated string manipulations
str3 = "Hello, World!"
print(str3[::-1])  # !dlroW ,olleH, reverse the string

str4 = "Python Programming"
print(str4.swapcase())  # pYTHON pROGRAMMING, swap case of each character

str5 = "   Trim me   "
print(str5.strip())  # Trim me, remove leading and trailing whitespace

str6 = "Find the needle in the haystack"
print(str6.find("needle"))  # 9, find the position of the substring 'needle'

str7 = "Repeat after me: me me me"
print(str7.replace("me", "you", 2))  # Repeat after you: you me me, replace first two occurrences of 'me' with 'you'



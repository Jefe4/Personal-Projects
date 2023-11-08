str1 = "Monty Python"
print(str1[0])
print(str1[11])
print((str1[len(str1)-1]))
print(str1[0:5])
str2 = "homebody"
print(str2[0:4])
print(str2[4:8])

x= "water"
x.replace("w","c", l )
# this place would show an error as l isn't in " " so it's not defined for python.
"""
"""
S = "What is your name?"
print(S[::2])
print(S[2:8:-1])
# "Wa syu ae" would appear if this program is ran

# 8. 5+4 are integers so it would = 9 but "5"+"4" are strings so it would print 54 rather than adding it. 5 + 4.0 would = 9.0 as they're integers.

x = "This is a test."
print(x*3)

# 9. This program would print x three times

S = " I had a cat named amanda when I was little"
i = 0
count = 0
last = len(S)-1
while i <= last:
    if S[i] == "a":
        count += 1
    i += 1
print(count)


S = "Spam "
print(S*5,"baked beans", S*4)

# 13.
print("I like writing in Python.", "It is so much fun.")

#  15.
s = "CAT"
s.upper().lower()
# 'cat'
s = "Cat"
s.upper().lower()
# 'cat'



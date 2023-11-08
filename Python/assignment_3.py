# 1.
for i in range(100,1000):
    if i % 17 == 0:
        print(i)
# 3. The difference between 'is' and '==' is that 'is' compares the identity of two objects. '=='compares the value of two odjects.
# example
num1 = 25
num2 = 24
num3 = 25

num1 is num2:
# would print false
num1 is num3:
# would print true
num1 == num3:
# would print true


# 7. value a would be true but value b would be false as they number before it would show

# 8. An iterator is an objwct that contains a countable number of values.

mystr = "Strawberry"

for i in mystr:
    print(i)

myfruits = ("Mangos", "Berries", "Bananna")

for i in myfruits:
    print(i)

# 10. x or y = 2 x and y = 2 x or z = 4 x and y or y and z = 6

# 11. i = 1,2,3,4,5,6,7,8,9 j = 0

# 14.

while i<17:
    if i%2 == 0:
        print(i)

# 20.

num =int(input("Enter an Integer: "))
while num.isdigit():
    print(num)
    break
else:
    print("Error, please enter an integer")
    

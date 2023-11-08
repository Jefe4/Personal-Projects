  

import turtle
import math
# makes the number odd
def make_odd(n):
    return 2*n+1
#displays characters singlely
def displaychars(message):
    for char in (message):
        print(char)
# says Wow , and the sum 
def total_sum(n):
    my_sum = 0
    for i in range(n):
        my_sum += i
        print(my_sum)
    print("Wow", my_sum)
# average of the sum and count
def big_average(n):
    my_sum = 0
    my_count = 0
    for i in range(n):
        my_sum += i
        my_count += i
    avg = my_sum / my_count
    print(avg)
# print the number and stops
def print_num(stop_num):
    for i in range(stop_num):
        print(i)
# prints all odd numbers
def print_odd_num(n):
    for i in range(n):
        if i % 2 == 1:
            print(i)
# prints numbers that cant be divided
def print_indivisble(n, divisor):
    for i in range(n):
        if (i % divisor == 1):
            print(i)
# print the message on a different line of code
def weird_print(message):
    for letter in message:
        print(letter)
# prints every intervals of a message
def weird_print2(message):
    count = 1
    for letter in message:
        if count % 2 == 1:
            print(letter)
        count = count + 1
# print every interval and adds a letter 
def weird_print3(message):
    count = 1
    new_message = ""
    for letter in message:
        if count % 2 == 1:
            new_message = new_message + letter
        count = count + 1
    print(new_message)
# divides a and b
def problem_divide(a, b):
    result = a / b
    result = int(result)
    rem = a % b
    print(a, "/", b, "-", result, "r", rem )
# 
def problem_shape(n):
    stars = ""
    for i in range(n):
        stars = stars + '*'
    print(stars)
# drawing a spiral
def problem_draw_spiral(angle, n):
    length = 1
    for i in range(n):
        turtle.forward(length)
        length = length + 2
        turtle.right(angle)
# drawing a square
def draw_square():
    turtle.reset()
    for i in range(4):
        turtle.forward(100)
        turtle.right(90)
# draws a sqaure with colors
def draw_square_color(color1, color2):
    turtle.reset()
    turtle.color(color1, color2)
    turtle.begin_fill()

    for i in range(4):
        turtle.forward(100)
        turtle.right(90)

    turtle.end_fill()
# allows you to draw a shape
def draw_shape(length, angle, sides):
    turtle.reset()
    for i in range(sides):
        turtle.forward(length)
        turtle.right(angle)
# includes the area of the circle
def circleArea(radius):
    PI = 3.14
    return PI*radius*radius

def divisble17():
    count = 100
    while count<=999:
        if count%17==0:
            print(count)
# reveals what letter grade you have based on your percentage
def letterGrade():
    percent_float = float(input("Enter your percentage: "))
    if 90 <= percent_float <= 100:
        print("your letter grade is A")
    elif 80 <= percent_float <= 89:
        print("your letter grade is B")
    elif 70 <= percent_float <= 79:
        print("your letter grade is C")
    elif 60 <= percent_float <= 69:
        print("your letter grade is D")
    elif 0 <= percent_float <= 59:
        print("your letter grade is F")
    else:
        print("That's a bonus provided it's over 101")
# shows how much shipping would cost based on your order amount
def shippingAmount():
    order_float = float(input("Enter the order amount: "))
    if order_float > 500:
        print("The shipping cost is $30")
    elif 400 < order_float <= 500:
        print("The shipping cost is $25")
    elif 200 < order_float <= 400:
        print("The shipping cost is $20")
    elif 0 < order_float <= 199:
        print("The shipping cost is $15")
    else:
        print("Have a total order amount")
                        
# finds the length between a recangle 
def find_length():
    l = w*h
    w = input(int("Enter the width: "))
    h = input(int("Enter the height: "))
    return w*h
# contains a message
def made_a_fun():
    print("Hello, this is a function I made to let you know.")
    
        

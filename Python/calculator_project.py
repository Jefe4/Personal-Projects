# Calculator project with basic arithmetic operations

class MyCalcGuts_Jgomez:
    # Addition method
    @staticmethod
    def add(num1, num2):
        sum = num1 + num2
        print(f"{num1} + {num2} = {sum}")

    # Subtraction method
    @staticmethod
    def sub(num1, num2):
        diff = num1 - num2
        print(f"{num1} - {num2} = {diff}")

    # Multiplication method
    @staticmethod
    def multi(num1, num2):
        product = num1 * num2
        print(f"{num1} * {num2} = {product}")

    # Division method
    @staticmethod
    def quotient(num1, num2):
        if num2 == 0:
            print("Error: Cannot be divided by 0")
        else:
            quot = num1 / num2
            print(f"{num1} / {num2} = {quot}")

    # Modulus method
    @staticmethod
    def mod(num1, num2):
        if num2 == 0:
            print("Error: Cannot find mod by dividing by 0")
        else:
            mod = num1 % num2
            print(f"{num1} % {num2} = {mod}")

# Main function to run the calculator
def main():
    import sys
    input = sys.stdin.read
    data = input().split()
    num1, num2 = float(data[0]), float(data[1])
    choice = data[2]

    if choice == '+':
        MyCalcGuts_Jgomez.add(num1, num2)
    elif choice == '-':
        MyCalcGuts_Jgomez.sub(num1, num2)
    elif choice == '*':
        MyCalcGuts_Jgomez.multi(num1, num2)
    elif choice == '/':
        MyCalcGuts_Jgomez.quotient(num1, num2)
    elif choice == '%':
        MyCalcGuts_Jgomez.mod(num1, num2)
    else:
        print("That is an invalid character")

if __name__ == "__main__":
    main()
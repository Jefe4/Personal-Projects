# Program to check if a student has taken and passed a prerequisite class to enroll in another class

# Define the prerequisite and required class
pre_req = "COSC 130"
class_req = "ITEC 315"

# Prompt the student to check if they have taken the prerequisite class
std_pre_req = input("Have you taken COSC 130: Yes or No? ").casefold()

# Validate the input for prerequisite class
if std_pre_req not in ["yes", "no"]:
    print("Invalid input for prerequisite class. Please enter 'Yes' or 'No'.")
else:
    # Prompt the student to check if they passed the prerequisite class
    grade = input("Did you pass COSC 130: Yes or No? ").casefold()
    
    # Validate the input for grade
    if grade not in ["yes", "no"]:
        print("Invalid input for grade. Please enter 'Yes' or 'No'.")
    else:
        # Check if the student has taken and passed the prerequisite class
        if std_pre_req == "yes" and grade == "yes":
            print("You can enroll in ITEC 315")
        elif std_pre_req == "no":
            print("Take COSC 130 in order to take ITEC 315")
        elif std_pre_req == "yes" and grade == "no":
            print("You have to pass COSC 130 before enrolling in ITEC 315")
        else:
            print("Invalid input")

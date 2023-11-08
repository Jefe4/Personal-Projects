# write a program that checks if the student taken a certain class 
# to enroll in another class

pre_req = "COSC 130"
class_req = "ITEC 315"

std_pre_req = input("Have you taken COSC 130: Yes or No? ")

    
grade = input ("Did you pass COSC 130: Yes or No? ")


if std_pre_req.casefold() == "yes" and grade.casefold() == "yes":

    print ("You can enroll in ITEC 315")

elif std_pre_req.casefold() == "no" :
    print("Take COSC 130 in order to take ITEC 315")

elif std_pre_req.casefold() == "yes" and grade.casefold() == "no":
    print("You have to pass COSC 130 before enrolling in ITEC 315")

 

# another program


std_pre_req = input("Have you taken COSC 130: Yes or No? ")


if std_pre_req.casefold() == "yes":
    print("Did you pass COSC 130: Yes or No? ")

grade = input("Yes or No")

if grade == "yes":
    print("You can take ITEC 315")

elif grade == "no":
    print("Retake COSC first")

else std_pre_req.casefold() == "no" :
    print("Take Cosc")

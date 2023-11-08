Python 3.8.5 (v3.8.5:580fbb018f, Jul 20 2020, 12:11:27) 
[Clang 6.0 (clang-600.0.57)] on darwin
Type "help", "copyright", "credits" or "license()" for more information.
>>> str1 = "Hello"
>>> str1.count('l')
2
>>> str1.count('L')
0
>>> str1.find('o")
	  
SyntaxError: EOL while scanning string literal
>>> str1.find('o')
4
>>> str1.replace('l',"")
'Heo'
>>> str1.swapcase()
'hELLO'
>>> str2 = "Hi I am Jeff"
>>> str2.find("m")
6
>>> for i in range(5):
	print(i,i**2)

	
0 0
1 1
2 4
3 9
4 16
>>> 
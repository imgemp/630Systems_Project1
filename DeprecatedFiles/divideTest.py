def divide(x, y):
    try:
        result = x / y
    except ZeroDivisionError:
        print "division by zero!"
    else:
        print "result is ", result
    finally:
        print "executing finally clause"

print('Normal Division ||||||||||||||||||||||||||||||||||||||||||||||||||')
divide(2, 1)
print('Divide by Zero Test ||||||||||||||||||||||||||||||||||||||||||||||')
divide(2, 0)
print('Divide with Strings Test||||||||||||||||||||||||||||||||||||||||||')
divide("2", "1")
print('Divide by Zero Outside of Try Block Test |||||||||||||||||||||||||')
2/0
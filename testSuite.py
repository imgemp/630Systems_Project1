#test constants and conditional
def foo():
	a, b = 1, 0
	if a or b:
		print "Hello", a
#call function
foo()
#tests defaults
def foo2(x=1):
	return x**2
#call function
out = foo2(x=2)
decoy1 = out
print(out)
out = foo2()
print(out)
#test closure
def foo3():
    m=3
    n=5
    def bar():
        a=4
        return m+n+a
    return bar
#call function
bar = foo3()
print(bar())
#test for document string help
"""Other doc string"""
def foo4():
    """Doc string test."""
    return 'nothing'
print(foo4.func_name)
print(foo4.func_doc)
#test for classes, self, and property arguments
class object:
    def __init__(self,a,b,c=3,d=4):
        self.a = a
        self.b = b
        self.c = c
        self.d = d

    def fun(self):
        return self.a+self.b+self.c+self.d
objTest = object(1,2,d=5,c=3)
print(objTest.fun())
#test for dictionaries and tuples
def foo5():
	a = {}
	a['dog'] = 23
	print(a['dog'])
	b = ('suzy','q')
	print(b[1])
foo5()
#test for loops, break, continue
def loopTest():
    var = 10             
    while var > 0:              
       print 'Current variable value :', var
       var = var -1
       if var == 4:
        break
    x = 10                    
    while x > 0:              
       x = x -1
       if x == 5:
        continue;
       print 'Current variable value :', x
loopTest()
#test for if/else
def nestIf(a):
    if a == 1:
        print(a)
        b = 2
        c = 3
    else:
        print('a does not equal 1')
nestIf(2)
#test negative numbers
def foo6(a):
    return -1*a
x = foo6(2)
print x



# Expected Output
# Hello1
# 4
# 1
# 12
# foo4
# Doc string test.
# 11
# 23
# q
# Current variable value :10
# Current variable value :9
# Current variable value :8
# Current variable value :7
# Current variable value :6
# Current variable value :5
# Current variable value :9
# Current variable value :8
# Current variable value :7
# Current variable value :6
# Current variable value :4
# Current variable value :3
# Current variable value :2
# Current variable value :1
# Current variable value :0
# a does not equal 1
# -2
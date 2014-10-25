#tests constants, if statement, printing, and function creation/calls
def foo():
	a, b = 1, 0
	if a or b:
		print "Hello", a
foo()
#tests default function arguments and storing
def foo2(x=1):
	return x**2
out = foo2(x=2)
decoy1 = out
print(out)
out = foo2()
print(out)
#tests closure
def foo3():
    m=3
    n=5
    def bar():
        a=4
        return m+n+a
    return bar
bar = foo3()
print(bar())
#tests document string and function name properties
"""Other doc string"""
def foo4():
    """Doc string test."""
    return 'nothing'
print(foo4.func_name)
print(foo4.func_doc)
#tests classes, self, and property arguments
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
#tests for dictionaries and tuples
def foo5():
	a = {}
	a['dog'] = 23
	print(a['dog'])
	b = ('suzy','q')
	print(b[1])
foo5()
#tests loops, break, continue
def foo6():
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
foo6()
#tests if/else
def foo7(a):
    if a == 1:
        print(a)
        b = 2
        c = 3
    else:
        print('a does not equal 1')
foo7(2)
#tests negative numbers
def foo8(a):
    return -1*a
x = foo8(2)
print x
#tests float built in
a = float(1023)
b = a*0.5
print(b)
#tests try catch
def foo10(x, y):
    try:
        result = x / y
    except ZeroDivisionError:
        print "division by zero!"
    else:
        print "result is ", result
    finally:
        print "executing finally clause"
foo10(2, 1)
foo10(2, 0)
#tests complex
a = 1+1j
b = a*1j
print(b)
a = complex(real=1);
b = complex(real=2,imag=2);
print(a+b);
#tests integer only arithmetic builtins
tests = [[3,-2]]
i = 0
while i < len(tests):
    [b,a] = tests[i]
    j = 0
    while j < 2:
        a,b = b,a
        j = j + 1
        print(a+b)
        print(a-b)
        print(a*b)
        print(a//b)
        print(a%b)
        print(divmod(a,b))
        print(a**b)
        print(a<<b)
        print(a>>b)
        print(a&b)
        print(a^b)
        print(a|b)
        print(a/b)
        print(-a)
        print(+a)
        print(abs(a))
        print(~a)
        print(complex(a))
        print(int(a))
        print(float(a))
        print(oct(a))
        print(hex(a))
        print(index(a))
        print(coerce(a,b))
    i = i + 1
#tests other arithmetic builtins
tests = [[3,-2.0],[3,-1-2j],[3.0,-2.0],[3.0,-1-2j],[3+4j,-1-2j]]
i = 0
while i < len(tests):
    [b,a] = tests[i]
    j = 0
    while j < 2:
        a,b = b,a
        j = j + 1
        print(a+b)
        print(a-b)
        print(a*b)
        print(a//b)
        print(a%b)
        print(divmod(a,b))
        print(a**b)
        print(a/b)
        print(-a)
        print(+a)
        print(abs(a))
        print(complex(a))
        print(int(a))
        print(float(a))
        print(coerce(a,b))
    i = i + 1


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
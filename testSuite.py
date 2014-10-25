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
tests = [[3,2]]
i = 0
while i < len(tests):
    b = tests[i][0]
    a = tests[i][1]
    j = 0
    while j < 2:
        a,b = b,a
        j = j + 1
        print(str(a)+'+'+str(b)+'='+str(a+b))
        print(str(a)+'-'+str(b)+'='+str(a-b))
        print(str(a)+'*'+str(b)+'='+str(a*b))
        print(str(a)+'//'+str(b)+'='+str(a//b))
        print(str(a)+'%'+str(b)+'='+str(a%b))
        print(str(a)+'divmod'+str(b)+'='+str(divmod(a,b)))
        print(str(a)+'**'+str(b)+'='+str(a**b))
        print(str(a)+'<<'+str(b)+'='+str(a<<b))
        print(str(a)+'>>'+str(b)+'='+str(a>>b))
        print(str(a)+'&'+str(b)+'='+str(a&b))
        print(str(a)+'^'+str(b)+'='+str(a^b))
        print(str(a)+'|'+str(b)+'='+str(a|b))
        print(str(a)+'/'+str(b)+'='+str(a/b))
        print('neg'+str(a)+'='+str(-a))
        print('pos'+str(a)+'='+str(+a))
        print('abs'+str(a)+'='+str(abs(a)))
        print('~'+str(a)+'='+str(~a))
        print('complex'+str(a)+'='+str(complex(a)))
        print('int'+str(a)+'='+str(int(a)))
        print('float'+str(a)+'='+str(float(a)))
        print('oct'+str(a)+'='+str(oct(a)))
        print('hex'+str(a)+'='+str(hex(a)))
        print(str(a)+'coerce'+str(b)+'='+str(coerce(a,b)))
    i = i + 1
#tests other non complex arithmetic builtins
tests = [[3,2.5],[3.5,2.5]]
i = 0
while i < len(tests):
    b = tests[i][0]
    a = tests[i][1]
    j = 0
    while j < 2:
        a,b = b,a
        j = j + 1
        print(str(a)+'+'+str(b)+'='+str(a+b))
        print(str(a)+'-'+str(b)+'='+str(a-b))
        print(str(a)+'*'+str(b)+'='+str(a*b))
        print(str(a)+'//'+str(b)+'='+str(a//b))
        print(str(a)+'%'+str(b)+'='+str(a%b))
        print(str(a)+'divmod'+str(b)+'='+str(divmod(a,b)))
        print(str(a)+'**'+str(b)+'='+str(a**b))
        print(str(a)+'/'+str(b)+'='+str(a/b))
        print('neg'+str(a)+'='+str(-a))
        print('pos'+str(a)+'='+str(+a))
        print('abs'+str(a)+'='+str(abs(a)))
        print('complex'+str(a)+'='+str(complex(a)))
        print('int'+str(a)+'='+str(int(a)))
        print('float'+str(a)+'='+str(float(a)))
    i = i + 1
#tests rest of arithmetic builtins
tests = [[3,-1-2j],[3.5,-1-2j],[3+4j,-1-2j]]
i = 0
while i < len(tests):
    b = tests[i][0]
    a = tests[i][1]
    j = 0
    while j < 2:
        a,b = b,a
        j = j + 1
        print(str(a)+'+'+str(b)+'='+str(a+b))
        print(str(a)+'-'+str(b)+'='+str(a-b))
        print(str(a)+'*'+str(b)+'='+str(a*b))
        print(str(a)+'//'+str(b)+'='+str(a//b))
        print(str(a)+'%'+str(b)+'='+str(a%b))
        print(str(a)+'divmod'+str(b)+'='+str(divmod(a,b)))
        print(str(a)+'**'+str(b)+'='+str(a**b))
        print(str(a)+'/'+str(b)+'='+str(a/b))
        print('neg'+str(a)+'='+str(-a))
        print('pos'+str(a)+'='+str(+a))
        print('abs'+str(a)+'='+str(abs(a)))
        print('complex'+str(a)+'='+str(complex(a)))
    i = i + 1
#testing coercion
print(str(1)+'coerce'+str(2)+'='+str(coerce(1,2)))
print(str(1.3)+'coerce'+str(2)+'='+str(coerce(1.3,2)))
print(str(1.3)+'coerce'+str(2.5)+'='+str(coerce(1.3,2.5)))
print(str(1+1j)+'coerce'+str(2)+'='+str(coerce(1+1j,2)))
print(str(1+1j)+'coerce'+str(2.5)+'='+str(coerce(1+1j,2.5)))
print(str(1+1j)+'coerce'+str(2+2j)+'='+str(coerce(1+1j,2+2j)))


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
# 511.5
# result is  2
# executing finally clause
# division by zero!
# executing finally clause
# (-1+1j)
# (3+2j)
# 5
# 1 ----------------- shows -1
# 6
# 1
# 1
# (1, 1)
# 9
# 12
# 0
# 2
# 1
# 3
# 1
# -3
# 3
# 3
# -4
# (3+0j)
# 3
# 3.0
# 03
# 0x3
# (3, 2)
# 5
# -1
# 6
# 0
# 2
# (0, 2)
# 8
# 16
# 0
# 2
# 1
# 3
# 0
# -2
# 2
# 2
# -3
# (2+0j)
# 2
# 2.0
# 02
# 0x2
# (2, 3)
# 5.5
# 0.5
# 7.5
# 1.0
# 0.5
# (1.0, 0.5)
# 15.5884572681
# 1.2
# -3
# 3
# 3
# (3+0j)
# 3
# 3.0
# 5.5
# -0.5
# 7.5
# 0.0
# 2.5
# (0.0, 2.5)
# 15.625
# 0.833333333333
# -2.5
# 2.5
# 2.5
# (2.5+0j)
# 2
# 2.5
# 6.0
# 1.0
# 8.75
# 1.0
# 1.0
# (1.0, 1.0)
# 22.917651494
# 1.4
# -3.5
# 3.5
# 3.5
# (3.5+0j)
# 3
# 3.5
# 6.0
# -1.0
# 8.75
# 0.0
# 2.5
# (0.0, 2.5)
# 24.7052942201
# 0.714285714286
# -2.5
# 2.5
# 2.5
# (2.5+0j)
# 2
# 2.5
# (2-2j)
# (4+2j)
# (-3-6j)
# (-1+0j)
# (2-2j)
# ((-1+0j), (2-2j))
# (-0.19541831143-0.27004220905j)
# (-0.6+1.2j)
# -3
# 3
# 3
# (3+0j)
# (2-2j)
# (-4-2j)
# (-3-6j)
# (-1+0j)
# (2-2j)
# ((-1+0j), (2-2j))
# (11+2j)
# (-0.333333333333-0.666666666667j)
# (1+2j)
# (-1-2j)
# 2.2360679775
# (-1-2j)
# (2.5-2j)
# (4.5+2j)
# (-3.5-7j)
# (-1+0j)
# (2.5-2j)
# ((-1+0j), (2.5-2j))
# (-0.229839567501-0.169724560015j)
# (-0.7+1.4j)
# -3.5
# 3.5
# 3.5
# (3.5+0j)
# (2.5-2j)
# (-4.5-2j)
# (-3.5-7j)
# (-1+0j)
# (2.5-2j)
# ((-1+0j), (2.5-2j))
# (11.1917044544-12.4199133891j)
# (-0.285714285714-0.571428571429j)
# (1+2j)
# (-1-2j)
# 2.2360679775
# (-1-2j)
# (2+2j)
# (4+6j)
# (5-10j)
# (-3+0j)
# -2j
# ((-3+0j), -2j)
# (-0.685476926706+1.07839492407j)
# (-2.2+0.4j)
# (-3-4j)
# (3+4j)
# 5.0
# (3+4j)
# (2+2j)
# (-4-6j)
# (5-10j)
# (-1+0j)
# (2+2j)
# ((-1+0j), (2+2j))
# (-36993.6705081-9727.77818753j)
# (-0.44-0.08j)
# (1+2j)
# (-1-2j)
# 2.2360679775
# (-1-2j)
# (1, 2)
# (1.3, 2.0)
# (1.3, 2.5)
# ((1+1j), (2+0j))
# ((1+1j), (2.5+0j))
# ((1+1j), (2+2j))
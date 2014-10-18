def nestIf(a):
    if a == 1:
        print(a)
        b = 2
        c = 3
    else:
        print('a does not equal 1')

def nestIf2(a):
    if a == 1:
        print(a)
        b = 2
        c = 3
    else:
        print('a does not equal 1')

nestIf(2)

# magic number: 32431310
# time stamp: 981736684
# code object:
# 	argcount:
# 	0
# 	nlocals:
# 	0
# 	stacksize:
# 	2
# 	flags:
# 	64
# 	code: (23)
# 		0:  100 (0,0)
# 		3:  132 (0,0)
# 		6:  90  (0,0)
# 		9:  101 (0,0)
# 		12: 100 (1,0)
# 		15: 131 (1,0)
# 		18: 1
# 		19: 100 (2,0)
# 		22: 83
# 	consts: (3)
# 		code object:
# 			argcount:
# 			1
# 			nlocals:
# 			3
# 			stacksize:
# 			2
# 			flags:
# 			67
# 			code: (41)
# 				0:  124 (0,0)
# 				3:  100 (1,0)
# 				6:  107 (2,0)
# 				9:  114 (32,0)
# 				12: 124 (0,0)
# 				15: 71
# 				16: 72
# 				17: 100 (2,0)
# 				20: 125 (1,0)
# 				23: 100 (3,0)
# 				26: 125 (2,0)
# 				29: 110 (5,0)
# 				32: 100 (4,0)
# 				35: 71
# 				36: 72
# 				37: 100 (0,0)
# 				40: 83
# 			consts: (5)
# 				None
# 				1
# 				2
# 				3
# 				a does not equal 1
# 			names: (0)
# 			varnames: (3)
# 				(interned)a
# 				(interned)b
# 				(interned)c
# 			freevars: (0)
# 			cellvars: (0)
# 			filename:
# 			nestIf.py
# 			name:
# 			(interned)nestIf
# 			firstlineno:
# 			1
# 			lnotab: (5)
# 			(0,1)
# 			(12,1)
# 			(5,1)
# 			(6,1)
# 			(9,2)
# 		2
# 		None
# 	names: (1)
# 		ref to interned string in position 3
# 	varnames: (0)
# 	freevars: (0)
# 	cellvars: (0)
# 	filename:
# 	nestIf.py
# 	name:
# 	(interned)<module>
# 	firstlineno:
# 	1
# 	lnotab: (1)
# 	(9,8)
# [ 'a', 'b', 'c', 'nestIf', '<module>' ]
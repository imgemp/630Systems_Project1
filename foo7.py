class object:
    def __init__(self,a,b,c=3,d=4):
        self.a = a
        self.b = b
        self.c = c
        self.d = d

    def fun(self):
        return self.a+self.b+self.c+self.d

foo = object(1,2,d=5,c=3)

print(foo.fun())
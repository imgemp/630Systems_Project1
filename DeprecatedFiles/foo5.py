class object:
    def __init__(self,var):
        self.var = var

    def fun(self):
        return 2*self.var

foo = object(1)
print(foo.fun())
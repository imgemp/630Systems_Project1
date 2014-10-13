def foo3():
    m=3
    n=5
    def bar():
        a=4
        return m+n+a
    return bar

bar = foo3()
bar()
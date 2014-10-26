def function(x=1):
	return x**2;

out = function(x=2);

decoy2 = 3;

decoy1 = out;

print(out);

out = function();

print(out);
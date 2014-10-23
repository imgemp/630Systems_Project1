/// <reference path="Globals.ts" />
/// <reference path="Log.ts" />

class Integer {

	value: number;

	constructor(value: number) { this.value = value; }

	// Addition
	public __add__(other: any): any {

		if (other instanceof Integer) {
			// var newInteger = new Integer(this.value);
			// newInteger.value += other.value;
			// return newInteger;
			return new Integer(this.value + other.value);
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __radd__(other: any): any {

		return this.__add__(other); // addition is symmetric

	}

	// Subtraction
	public __sub__(other: any): any {

		if (other instanceof Integer) {
			// var newInteger = new Integer(this.value);
			// newInteger.value -= other.value;
			// return newInteger;
			return new Integer(this.value - other.value);
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rsub__(other: any): any {

		if (other instanceof Integer) {
			// var newInteger = new Integer(other.value);
			// newInteger.value -= this.value;
			// return newInteger;
			return new Integer(other.value - this.value);
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Multiplication
	public __mul__(other: any): any {

		if (other instanceof Integer) {
			// var newInteger = new Integer(this.value);
			// newInteger.value *= other.value;
			// return newInteger;
			return new Integer(this.value * other.value);
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rmul__(other: any): any {

		return this.__rmul__(other); // multiplication is symmetric

	}

	// Floor Division
	public __floordiv__(other: any): any {

		if (other instanceof Integer) {
			// var newInteger = new Integer(this.value);
			// newInteger.value = Math.floor(newInteger.value/other.value);
			// return newInteger;
			return new Integer(Math.floor( this.value / other.value ));
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rfloordiv__(other: any): any {

		if (other instanceof Integer) {
			// var newInteger = new Integer(other.value);
			// newInteger.value = Math.floor(newInteger.value/this.value);
			// return newInteger;
			return new Integer(Math.floor( other.value / this.value ));
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Modulus
	public __mod__(other: any): any {

		if (other instanceof Integer) {
			// var newInteger = new Integer(this.value);
			// newInteger.value = newInteger.value % other.value;
			// return newInteger;
			return new Integer(this.value % other.value);
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rmod__(other: any): any {

		if (other instanceof Integer) {
			// var newInteger = new Integer(other.value);
			// newInteger.value = newInteger.value % this.value;
			// return newInteger;
			return new Integer(other.value % this.value);
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Divmod
	public __divmod__(other: any): any {

		if (other instanceof Integer) {
			other = new Integer(other.value);
			var quotient: Integer = this.__floordiv__(other);
			var remainder: Integer = this.__sub__(quotient.__mul__(other));
			return [quotient,remainder];
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rdivmod__(other: any): any {

		if (other instanceof Integer) {
			var quotient: Integer = other.__floordiv__(this);
			var remainder: Integer = other.__sub__(quotient.__mul__(this));
			return [quotient,remainder];
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

}

class Float {

	value: number;

	constructor(value: number) { this.value = value; }

	// Addition
	public __add__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			// var newFloat = new Float(this.value);
			// newFloat.value += other.value;
			// return newFloat;
			return new Float(this.value + other.value);
		} else if (other instanceof Float) {
			// var newFloat = new Float(this.value);
			// newFloat.value += other.value;
			// return newFloat;
			return new Float(this.value + other.value);
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __radd__(other: any): any {

		return this.__add__(other);

	}

	// Subtraction
	public __sub__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			// var newFloat = new Float(this.value);
			// newFloat.value -= other.value;
			// return newFloat;
			return new Float(this.value - other.value);
		} else if (other instanceof Float) {
			// var newFloat = new Float(this.value);
			// newFloat.value -= other.value;
			// return newFloat;
			return new Float(this.value - other.value);
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rsub__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			// var newFloat = new Float(other.value);
			// newFloat.value -= this.value;
			// return newFloat;
			return new Float(other.value - this.value);
		} else if (other instanceof Float) {
			// var newFloat = new Float(other.value);
			// newFloat.value -= this.value;
			// return newFloat;
			return new Float(other.value - this.value);
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Multiplication
	public __mul__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			// var newFloat = new Float(this.value);
			// newFloat.value *= other.value;
			// return newFloat;
			return new Float(this.value * other.value);
		} else if (other instanceof Float) {
			// var newFloat = new Float(this.value);
			// newFloat.value *= other.value;
			// return newFloat;
			return new Float(this.value * other.value);
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rmul__(other: any): any {

		return this.__mul__(other); // multiplication is symmetric

	}

	// Floor Division
	public __floordiv__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			// var newFloat = new Float(this.value);
			// newFloat.value = Math.floor(newFloat.value/other.value);
			// return newFloat;
			return new Float(Math.floor( this.value / other.value ));
		} else if (other instanceof Float) {
			// var newFloat = new Float(this.value);
			// newFloat.value = Math.floor(newFloat.value/other.value);
			// return newFloat;
			return new Float(Math.floor( this.value / other.value ));
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rfloordiv__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			// var newFloat = new Float(other.value);
			// newFloat.value = Math.floor(newFloat.value/this.value);
			// return newFloat;
			return new Float(Math.floor( other.value / this.value ));
		} else if (other instanceof Float) {
			// var newFloat = new Float(other.value);
			// newFloat.value = Math.floor(newFloat.value/this.value);
			// return newFloat;
			return new Float(Math.floor( other.value / this.value ));
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Modulus
	public __mod__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			// var newFloat = new Float(other.value);
			// newFloat.value = this.value % newFloat.value;
			// return newFloat;
			return new Float(this.value % other.value);
		} else if (other instanceof Float) {
			// var newFloat = new Float(other.value);
			// newFloat.value = this.value % newFloat.value;
			// return newFloat;
			return new Float(this.value % other.value);
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rmod__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			// var newFloat = new Float(other.value);
			// newFloat.value = newFloat.value % this.value;
			// return newFloat;
			return new Float(other.value % this.value);
		} else if (other instanceof Float) {
			// var newFloat = new Float(other.value);
			// newFloat.value = newFloat.value % this.value;
			// return newFloat;
			return new Float(other.value % this.value);
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Divmod
	public __divmod__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			other = new Float(other.value);
			var quotient: Float = this.__floordiv__(other);
			var remainder: Float = this.__sub__(quotient.__mul__(other));
			return [quotient,remainder];
		} else if (other instanceof Float) {
			var quotient: Float = this.__floordiv__(other);
			var remainder: Float = this.__sub__(quotient.__mul__(other));
			return [quotient,remainder];
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rdivmod__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			other = new Float(other.value);
			var quotient: Float = other.__floordiv__(this);
			var remainder: Float = other.__sub__(quotient.__mul__(this));
			return [quotient,remainder];
		} else if (other instanceof Float) {
			var quotient: Float = other.__floordiv__(this);
			var remainder: Float = other.__sub__(quotient.__mul__(this));
			return [quotient,remainder];
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

}

class Complex {

	real: number;
	imag: number;

	constructor(real: number, imag: number) { this.real = real; this.imag = imag; }

	// Addition
	public __add__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			// var newComplex = new Complex(this.real,this.imag);
			// newComplex.real += other.value;
			// return newComplex;
			return new Complex(this.real + other.value, this.imag);
		} else if (other instanceof Float) {
			// upcast float to complex
			// var newComplex = new Complex(this.real,this.imag);
			// newComplex.real += other.value;
			// return newComplex;
			return new Complex(this.real + other.value, this.imag);
		} else if (other instanceof Complex) {
			// var newComplex = new Complex(this.real,this.imag);
			// newComplex.real += other.real;
			// newComplex.imag += other.imag;
			// return newComplex;
			return new Complex(this.real + other.real, this.imag + other.imag);
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __radd__(other: any): any {

		return this.__add__(other); // addition is symmetric

	}

	// Subtraction
	public __sub__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			// var newComplex = new Complex(this.real,this.imag);
			// newComplex.real -= other.value;
			// return newComplex;
			return new Complex(this.real - other.value, this.imag);
		} else if (other instanceof Float) {
			// upcast float to complex
			// var newComplex = new Complex(this.real,this.imag);
			// newComplex.real -= other.value;
			// return newComplex;
			return new Complex(this.real - other.value, this.imag);
		} else if (other instanceof Complex) {
			// var newComplex = new Complex(this.real,this.imag);
			// newComplex.real -= other.real;
			// newComplex.imag -= other.imag;
			// return newComplex;
			return new Complex(this.real - other.real, this.imag - other.imag);
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rsub__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			// var newComplex = new Complex(other.value,0);
			// newComplex.real -= other.value; // this was wrong - needed to subtract imag too
			// return newComplex;
			return new Complex(other.value - this.real, -this.imag);
		} else if (other instanceof Float) {
			// upcast float to complex
			// var newComplex = new Complex(other.value,0);
			// newComplex.real -= this.real;
			// newComplex.imag -= this.imag;
			// return newComplex;
			return new Complex(other.value - this.real, -this.imag);
		} else if (other instanceof Complex) {
			// var newComplex = new Complex(other.real,other.imag);
			// newComplex.real -= this.real;
			// newComplex.imag -= this.imag;
			// return newComplex;
			return new Complex(other.real - this.real, other.imag - this.imag);
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Multiplication
	public __mul__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			// var newComplex = new Complex(this.real,this.imag);
			// newComplex.real *= other.value;
			// newComplex.imag *= other.value;
			// return newComplex;
			return new Complex(this.real * other.value, this.imag * other.value);
		} else if (other instanceof Float) {
			// upcast float to complex
			// var newComplex = new Complex(this.real,this.imag);
			// newComplex.real *= other.value;
			// newComplex.imag *= other.value;
			// return newComplex;
			return new Complex(this.real * other.value, this.imag * other.value);
		} else if (other instanceof Complex) {
			// var newComplex = new Complex(this.real,this.imag);
			// newComplex.real = this.real*other.real-this.imag*other.imag;
			// newComplex.imag = this.imag*other.real+this.real*other.imag;
			// return newComplex;
			return new Complex(this.real * other.real - this.imag * other.imag, this.imag * other.real + this.real * other.imag);
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rmul__(other: any): any {

		return this.__mul__(other); // addition is symmetric

	}

	// Floor Division
	public __floordiv__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			// var newComplex = new Complex(0,0);
			// newComplex.real = Math.floor(this.real/other.value);
			// newComplex.imag = Math.floor(this.imag/other.value);
			// return newComplex;
			return new Complex(Math.floor( this.real / other.value ), Math.floor( this.imag / other.value ));
		} else if (other instanceof Float) {
			// upcast float to complex
			// var newComplex = new Complex(0,0);
			// newComplex.real = Math.floor(this.real/other.value);
			// newComplex.imag = Math.floor(this.imag/other.value);
			// return newComplex;
			return new Complex(Math.floor( this.real / other.value ), Math.floor( this.imag / other.value ));
		} else if (other instanceof Complex) {
			var newComplex = new Complex(0,0);
			var den = Math.pow(other.real,2)+Math.pow(other.imag,2);
			newComplex.real = Math.floor((this.real*other.real+this.imag*other.imag)/(den));
			newComplex.imag = Math.floor((this.imag*other.real-this.real*other.imag)/(den));
			return newComplex;
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rfloordiv__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			var newComplex = new Complex(0,0);
			var den = Math.pow(this.real,2)+Math.pow(this.imag,2);
			newComplex.real = Math.floor((other.value*this.real)/(den));
			newComplex.imag = Math.floor((-other.value*this.imag)/(den));
			return newComplex;
		} else if (other instanceof Float) {
			// upcast float to complex
			var newComplex = new Complex(0,0);
			var den = Math.pow(this.real,2)+Math.pow(this.imag,2);
			newComplex.real = Math.floor((other.value*this.real)/(den));
			newComplex.imag = Math.floor((-other.value*this.imag)/(den));
			return newComplex;
		} else if (other instanceof Complex) {
			var newComplex = new Complex(0,0);
			var den = Math.pow(this.real,2)+Math.pow(this.imag,2);
			newComplex.real = Math.floor((other.real*this.real+other.imag*this.imag)/(den));
			newComplex.imag = Math.floor((other.imag*this.real-other.real*this.imag)/(den));
			return newComplex;
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Modulus
	public __mod__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			other = new Complex(other.value,0);
			return this.__sub__(other.__mul__(this.__floordiv__(other))); //remainder of a/b = a - floor(a/b)*b, a = this, b = other
		} else if (other instanceof Float) {
			// upcast float to complex
			other = new Complex(other.value,0);
			return this.__sub__(other.__mul__(this.__floordiv__(other))); //remainder of a/b = a - floor(a/b)*b, a = this, b = other
		} else if (other instanceof Complex) {
			return this.__sub__(other.__mul__(this.__floordiv__(other))); //remainder of a/b = a - floor(a/b)*b, a = this, b = other
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rmod__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			other = new Complex(other.value,0);
			return other.__sub__(this.__mul__(other.__floordiv__(this))); //remainder of a/b = a - floor(a/b)*b, a = other, b = this
		} else if (other instanceof Float) {
			// upcast float to complex
			other = new Complex(other.value,0);
			return other.__sub__(this.__mul__(other.__floordiv__(this))); //remainder of a/b = a - floor(a/b)*b, a = other, b = this
		} else if (other instanceof Complex) {
			return other.__sub__(this.__mul__(other.__floordiv__(this))); //remainder of a/b = a - floor(a/b)*b, a = other, b = this
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Divmod
	public __divmod__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			other = new Complex(other.value,0);
			var quotient: Complex = this.__floordiv__(other);
			var remainder: Complex = this.__sub__(quotient.__mul__(other));
			return [quotient,remainder];
		} else if (other instanceof Float) {
			// upcast float to complex
			other = new Complex(other.value,0);
			var quotient: Complex = this.__floordiv__(other);
			var remainder: Complex = this.__sub__(quotient.__mul__(other));
			return [quotient,remainder];
		} else if (other instanceof Complex) {
			var quotient: Complex = this.__floordiv__(other);
			var remainder: Complex = this.__sub__(quotient.__mul__(other));
			return [quotient,remainder];
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rdivmod__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			other = new Complex(other.value,0);
			var quotient: Complex = other.__floordiv__(this);
			var remainder: Complex = other.__sub__(quotient.__mul__(this));
			return [quotient,remainder];
		} else if (other instanceof Float) {
			// upcast float to complex
			other = new Complex(other.value,0);
			var quotient: Complex = other.__floordiv__(this);
			var remainder: Complex = other.__sub__(quotient.__mul__(this));
			return [quotient,remainder];
		} else if (other instanceof Complex) {
			var quotient: Complex = other.__floordiv__(this);
			var remainder: Complex = other.__sub__(quotient.__mul__(this));
			return [quotient,remainder];
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

}

class Long {

	value: number;

	constructor(value: number) { this.value = value; }
}
/// <reference path="Globals.ts" />
/// <reference path="Log.ts" />

class Integer {

	value: number;

	constructor(value: number) { this.value = value; }

	// Addition
	public __add__(other: any): any {

		if (other instanceof Integer) {
			var newInteger = new Integer(this.value);
			newInteger.value += other.value;
			return newInteger;
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
			var newInteger = new Integer(this.value);
			newInteger.value -= other.value;
			return newInteger;
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
			var newInteger = new Integer(other.value);
			newInteger.value -= this.value;
			return newInteger;
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
			var newInteger = new Integer(this.value);
			newInteger.value *= other.value;
			return newInteger;
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
			var newInteger = new Integer(this.value);
			newInteger.value = Math.floor(newInteger.value/other.value);
			return newInteger;
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
			var newInteger = new Integer(other.value);
			newInteger.value = Math.floor(newInteger.value/this.value);
			return newInteger;
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
			var newFloat = new Float(this.value);
			newFloat.value += other.value;
			return newFloat;
		} else if (other instanceof Float) {
			var newFloat = new Float(this.value);
			newFloat.value += other.value;
			return newFloat;
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
			var newFloat = new Float(this.value);
			newFloat.value -= other.value;
			return newFloat;
		} else if (other instanceof Float) {
			var newFloat = new Float(this.value);
			newFloat.value -= other.value;
			return newFloat;
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rsub__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			var newFloat = new Float(other.value);
			newFloat.value -= this.value;
			return newFloat;
		} else if (other instanceof Float) {
			var newFloat = new Float(other.value);
			newFloat.value -= this.value;
			return newFloat;
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
			var newFloat = new Float(this.value);
			newFloat.value *= other.value;
			return newFloat;
		} else if (other instanceof Float) {
			var newFloat = new Float(this.value);
			newFloat.value *= other.value;
			return newFloat;
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
			var newFloat = new Float(this.value);
			newFloat.value = Math.floor(newFloat.value/other.value);
			return newFloat;
		} else if (other instanceof Float) {
			var newFloat = new Float(this.value);
			newFloat.value = Math.floor(newFloat.value/other.value);
			return newFloat;
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rfloordiv__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			var newFloat = new Float(other.value);
			newFloat.value = Math.floor(newFloat.value/this.value);
			return newFloat;
		} else if (other instanceof Float) {
			var newFloat = new Float(other.value);
			newFloat.value = Math.floor(newFloat.value/this.value);
			return newFloat;
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
			var newComplex = new Complex(this.real,this.imag);
			newComplex.real += other.value;
			return newComplex;
		} else if (other instanceof Float) {
			// upcast float to complex
			var newComplex = new Complex(this.real,this.imag);
			newComplex.real += other.value;
			return newComplex;
		} else if (other instanceof Complex) {
			var newComplex = new Complex(this.real,this.imag);
			newComplex.real += other.real;
			newComplex.imag += other.imag;
			return newComplex;
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
			var newComplex = new Complex(this.real,this.imag);
			newComplex.real -= other.value;
			return newComplex;
		} else if (other instanceof Float) {
			// upcast float to complex
			var newComplex = new Complex(this.real,this.imag);
			newComplex.real -= other.value;
			return newComplex;
		} else if (other instanceof Complex) {
			var newComplex = new Complex(this.real,this.imag);
			newComplex.real -= other.real;
			newComplex.imag -= other.imag;
			return newComplex;
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rsub__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			var newComplex = new Complex(other.value,0);
			newComplex.real -= other.value;
			return newComplex;
		} else if (other instanceof Float) {
			// upcast float to complex
			var newComplex = new Complex(other.value,0);
			newComplex.real -= this.real;
			newComplex.imag -= this.imag;
			return newComplex;
		} else if (other instanceof Complex) {
			var newComplex = new Complex(other.real,other.imag);
			newComplex.real -= this.real;
			newComplex.imag -= this.imag;
			return newComplex;
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Multiplication
	public __mul__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			var newComplex = new Complex(this.real,this.imag);
			newComplex.real *= other.value;
			newComplex.imag *= other.value;
			return newComplex;
		} else if (other instanceof Float) {
			// upcast float to complex
			var newComplex = new Complex(this.real,this.imag);
			newComplex.real *= other.value;
			newComplex.imag *= other.value;
			return newComplex;
		} else if (other instanceof Complex) {
			var newComplex = new Complex(this.real,this.imag);
			newComplex.real = this.real*other.real-this.imag*other.imag;
			newComplex.imag = this.imag*other.real+this.real*other.imag;
			return newComplex;
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
			var newComplex = new Complex(0,0);
			newComplex.real = Math.floor(this.real/other.value);
			newComplex.imag = Math.floor(this.imag/other.value);
			return newComplex;
		} else if (other instanceof Float) {
			// upcast float to complex
			var newComplex = new Complex(0,0);
			newComplex.real = Math.floor(this.real/other.value);
			newComplex.imag = Math.floor(this.imag/other.value);
			return newComplex;
		} else if (other instanceof Complex) {
			var newComplex = new Complex(0,0);
			newComplex.real = Math.floor((this.real*other.real+this.imag*other.imag)/(Math.pow(other.real,2)+Math.pow(other.imag,2)));
			newComplex.imag = Math.floor((this.imag*other.real-this.real*other.imag)/(Math.pow(other.real,2)+Math.pow(other.imag,2)));
			return newComplex;
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rfloordiv__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			var newComplex = new Complex(0,0);
			newComplex.real = Math.floor((other.value*this.real)/(Math.pow(this.real,2)+Math.pow(this.imag,2)));
			newComplex.imag = Math.floor((-other.value*this.imag)/(Math.pow(this.real,2)+Math.pow(this.imag,2)));
			return newComplex;
		} else if (other instanceof Float) {
			// upcast float to complex
			var newComplex = new Complex(0,0);
			newComplex.real = Math.floor((other.value*this.real)/(Math.pow(this.real,2)+Math.pow(this.imag,2)));
			newComplex.imag = Math.floor((-other.value*this.imag)/(Math.pow(this.real,2)+Math.pow(this.imag,2)));
			return newComplex;
		} else if (other instanceof Complex) {
			var newComplex = new Complex(0,0);
			newComplex.real = Math.floor((other.real*this.real+other.imag*this.imag)/(Math.pow(this.real,2)+Math.pow(this.imag,2)));
			newComplex.imag = Math.floor((other.imag*this.real-other.real*this.imag)/(Math.pow(this.real,2)+Math.pow(this.imag,2)));
			return newComplex;
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

}

class Long {

	value: number;

	constructor(value: number) { this.value = value; }
}
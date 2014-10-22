/// <reference path="Globals.ts" />
/// <reference path="Log.ts" />

class Integer {

	value: number;

	constructor(value: number) { this.value = value; }

	public __add__(other: any) {

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

	public __radd__(other: any) {

		if (other instanceof Integer) {
			var newInteger = new Integer(this.value);
			newInteger.value += other.value;
			return newInteger;
		} else if (other instanceof Float) {
			// upcast integer to float
			var newFloat = new Float(this.value);
			newFloat.value += other.value;
			return newFloat;
		} else if (other instanceof Complex) {
			// upcast integer to complex
			var newComplex = new Complex(this.value,0);
			newComplex.real += other.real;
			newComplex.imag += other.imag;
			return newComplex;
		} else if (other instance of Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

}

class Float {

	value: number;

	constructor(value: number) { this.value = value; }

	public __add__(other: any) {

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
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __radd__(other: any) {

		if (other instanceof Integer) {
			var newInteger = new Integer(this.value);
			newInteger.value += other.value;
			return newInteger;
		} else if (other instanceof Float) {
			// upcast integer to float
			var newFloat = new Float(this.value);
			newFloat.value += other.value;
			return newFloat;
		} else if (other instanceof Complex) {
			// upcast integer to complex
			var newComplex = new Complex(this.value,0);
			newComplex.real += other.real;
			newComplex.imag += other.imag;
			return newComplex;
		} else if (other instance of Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

}

class Complex {

	real: number;
	imag: number;

	constructor(real: number, imag: number) { this.real = real; this.imag = imag; }

	public __add__(other: Integer) {
		var newComplex = new Complex(this.real,this.imag);
		newComplex.real += other.value;
		return newComplex;
	}

	public __add__(other: Float) {
		var newComplex = new Complex(this.real,this.imag);
		newComplex.real += other.value;
		return newComplex;
	}

	public __add__(other: Complex) {
		var newComplex = new Complex(this.real,this.imag);
		newComplex.real += other.real;
		newComplex.imag += other.imag;
		return newComplex;
	}

}

class Long {

	value: number;

	constructor(value: number) { this.value = value; }
}
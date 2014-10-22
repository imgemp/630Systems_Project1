/// <reference path="Globals.ts" />
/// <reference path="Log.ts" />

class Integer {

	value: number;

	constructor(value: number) { this.value = value; }

	public __add__(other: Integer) {
		var newInteger = new Integer(this.value);
		newInteger.value += other.value;
		return newInteger;
	}

	public __add__(other: Float) {
		return 'Not Implemented';
	}

	public __add__(other: Complex) {
		return 'Not Implemented';
	}

}

class Float {

	value: number;

	constructor(value: number) { this.value = value; }

	public __add__(other: Integer) {
		var newFloat = new Float(this.value);
		newFloat.value += other.value;
		return newFloat;
	}

	public __add__(other: Float) {
		var newFloat = new Float(this.value);
		newFloat.value += other.value;
		return newFloat;
	}

	public __add__(other: Complex) {
		return 'Not Implemented';
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
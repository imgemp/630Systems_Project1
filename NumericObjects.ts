/// <reference path="Globals.ts" />
/// <reference path="Log.ts" />

class Numeric {

	constructor(){}

}

class Integer extends Numeric {

	value: number;

	constructor(value: number) { super(); this.value = value; }

	// toString
	public __str__(): string {

		return this.value.toString();

	}

	// Addition
	public __add__(other: any): any {

		if (other instanceof Integer) {
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
			if (other.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Integer(Math.floor( this.value / other.value )); }
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
			if (this.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Integer(Math.floor( other.value / this.value )); }
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
			if (other.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Integer(this.value % other.value); }
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
			if (this.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Integer(other.value % this.value); }
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
			if (other.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else {
				var quotient: Integer = this.__floordiv__(other);
				var remainder: Integer = this.__sub__(quotient.__mul__(other));
				return [quotient,remainder];
			}
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
			if (this.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else {
				var quotient: Integer = other.__floordiv__(this);
				var remainder: Integer = other.__sub__(quotient.__mul__(this));
				return [quotient,remainder];
			}
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Power - Missing Ternary Input Version
	public __pow__(other: any): any {

		if (other instanceof Integer) {
			return new Integer(Math.pow( this.value, other.value ));
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rpow__(other: any): any {

		if (other instanceof Integer) {
			return new Integer(Math.pow( other.value, this.value ));
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Bitwise Operations **Only for Integers**

	// Left Bitwise Shift
	public __lshift__(other: any): any {

		if (other instanceof Integer) {
			return new Integer(this.value << other.value);
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rlshift__(other: any): any {

		if (other instanceof Integer) {
			return new Integer(other.value << this.value);
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Right Bitwise Shift
	public __rshift__(other: any): any {

		if (other instanceof Integer) {
			return new Integer(this.value >> other.value);
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rrshift__(other: any): any {

		if (other instanceof Integer) {
			return new Integer(other.value >> this.value);
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Bitwise AND
	public __and__(other: any): any {

		if (other instanceof Integer) {
			return new Integer(this.value & other.value);
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rand__(other: any): any {

		return this.__and__(other); // bitwise and is symmetric

	}

	// Bitwise XOR
	public __xor__(other: any): any {

		if (other instanceof Integer) {
			return new Integer(this.value ^ other.value);
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rxor__(other: any): any {

		return this.__xor__(other); // bitwise xor is symmetric

	}

	// Bitwise OR
	public __or__(other: any): any {

		if (other instanceof Integer) {
			return new Integer(this.value | other.value);
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __ror__(other: any): any {

		return this.__or__(other); // bitwise or is symmetric

	}

	// Division - Assume Classic Mode
	public __div__(other: any): any {

		return this.__floordiv__(other);

	}

	public __rdiv__(other: any): any {

		return this.__rfloordiv__(other);

	}

	// True Division
	public __truediv__(other: any): any {

		if (other instanceof Integer) {
			if (other.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Float( this.value / other.value ); }
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rtruediv__(other: any): any {

		if (other instanceof Integer) {
			if (this.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Float( other.value / this.value ); }
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Negative Literal
	public __neg__(): Integer {

		this.value = -this.value;
		return this;

	}

	// Positive Literal
	public __pos__(): Integer {

		return this;

	}

	// Absolute Value
	public __abs__(): Integer {

		this.value = Math.abs(this.value);
		return this;
	}

	// Inversion
	public __invert__(): Integer {

		return new Integer(~this.value);

	}

	// Complex Conversion
	public __complex__(): Complex {

		return new Complex(this.value,0);

	}

	// Integer Conversion
	public __int__(): Integer {

		return this;

	}

	// Long Conversion
	public __long__(): string {

		return 'NotImplemented';

	}

	// Float Conversion
	public __float__(): Float {

		return new Float(this.value);

	}

	// Octal Conversion
	public __oct__(): string {

		return this.value.toString(8);

	}

	// Hex Conversion
	public __hex__(): string {

		return this.value.toString(16);

	}

	// Index
	public __index__(): Integer {

		return this;

	}

	// Coercion
	public __coerce__(other: any): any {

		if (other instanceof Integer) {
			return [this,other];
		} else if (other instanceof Float) {
			return 'NotImplemented'; // can't downcast float to integer
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

}

class Float extends Numeric {

	value: number;

	constructor(value: number) { super(); this.value = value; }

	// toString
	public __str__(): string {

		return this.value.toString();

	}

	// Addition
	public __add__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			return new Float(this.value + other.value);
		} else if (other instanceof Float) {
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
			return new Float(this.value - other.value);
		} else if (other instanceof Float) {
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
			return new Float(other.value - this.value);
		} else if (other instanceof Float) {
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
			return new Float(this.value * other.value);
		} else if (other instanceof Float) {
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
			if (other.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Float(Math.floor( this.value / other.value )); }
		} else if (other instanceof Float) {
			if (other.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Float(Math.floor( this.value / other.value )); }
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rfloordiv__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			if (this.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Float(Math.floor( other.value / this.value )); }
		} else if (other instanceof Float) {
			if (this.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Float(Math.floor( other.value / this.value )); }
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
			if (other.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Float(this.value % other.value); }
		} else if (other instanceof Float) {
			if (other.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Float(this.value % other.value); }
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rmod__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			if (this.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Float(other.value % this.value); }
		} else if (other instanceof Float) {
			if (this.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Float(other.value % this.value); }
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
			if (other.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else {
				other = new Float(other.value);
				var quotient: Float = this.__floordiv__(other);
				var remainder: Float = this.__sub__(quotient.__mul__(other));
				return [quotient,remainder];
			}
		} else if (other instanceof Float) {
			if (other.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else {
				var quotient: Float = this.__floordiv__(other);
				var remainder: Float = this.__sub__(quotient.__mul__(other));
				return [quotient,remainder];
			}
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rdivmod__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			if (this.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else {
				other = new Float(other.value);
				var quotient: Float = other.__floordiv__(this);
				var remainder: Float = other.__sub__(quotient.__mul__(this));
				return [quotient,remainder];
			}
		} else if (other instanceof Float) {
			if (this.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else {
				var quotient: Float = other.__floordiv__(this);
				var remainder: Float = other.__sub__(quotient.__mul__(this));
				return [quotient,remainder];
			}
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Power - Missing Ternary Input Version
	public __pow__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			return new Float(Math.pow( this.value, other.value ));
		} else if (other instanceof Float) {
			return new Float(Math.pow( this.value, other.value ));
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rpow__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			return new Float(Math.pow( other.value, this.value ));
		} else if (other instanceof Float) {
			return new Float(Math.pow( other.value, this.value ));
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Bitwise Operations **Only for Integers**

	// Left Bitwise Shift
	public __lshift__(other: any): any {

		if (other instanceof Integer) {
			return 'NotImplemented';
		} else if (other instanceof Float) {
			return 'NotImplemented';
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rlshift__(other: any): any {

		if (other instanceof Integer) {
			return 'NotImplemented';
		} else if (other instanceof Float) {
			return 'NotImplemented';
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Right Bitwise Shift
	public __rshift__(other: any): any {

		if (other instanceof Integer) {
			return 'NotImplemented';
		} else if (other instanceof Float) {
			return 'NotImplemented';
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rrshift__(other: any): any {

		if (other instanceof Integer) {
			return 'NotImplemented';
		} else if (other instanceof Float) {
			return 'NotImplemented';
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Bitwise AND
	public __and__(other: any): any {

		if (other instanceof Integer) {
			return 'NotImplemented';
		} else if (other instanceof Float) {
			return 'NotImplemented';
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rand__(other: any): any {

		return this.__and__(other); // bitwise and is symmetric

	}

	// Bitwise XOR
	public __xor__(other: any): any {

		if (other instanceof Integer) {
			return 'NotImplemented';
		} else if (other instanceof Float) {
			return 'NotImplemented';
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rxor__(other: any): any {

		return this.__xor__(other); // bitwise xor is symmetric

	}

	// Bitwise OR
	public __or__(other: any): any {

		if (other instanceof Integer) {
			return 'NotImplemented';
		} else if (other instanceof Float) {
			return 'NotImplemented';
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __ror__(other: any): any {

		return this.__or__(other); // bitwise or is symmetric

	}

	// Division
	public __div__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			if (other.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Float( this.value / other.value ); }
		} else if (other instanceof Float) {
			if (other.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Float( this.value / other.value ); }
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rdiv__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			if (this.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Float( other.value / this.value ); }
		} else if (other instanceof Float) {
			if (this.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Float( other.value / this.value ); }
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// True Division
	public __truediv__(other: any): any {

		return this.__div__(other);

	}

	public __rtruediv__(other: any): any {

		return this.__rdiv__(other);

	}

	// Negative Literal
	public __neg__(): Float {

		this.value = -this.value;
		return this;

	}

	// Positive Literal
	public __pos__(): Float {

		return this;

	}

	// Absolute Value
	public __abs__(): Float {

		this.value = Math.abs(this.value);
		return this;

	}

	// Inversion
	public __invert__(): string {

		return 'NotImplemented';

	}

	// Complex Conversion
	public __complex__(): Complex {

		return new Complex(this.value,0);

	}

	// Integer Conversion
	public __int__(): Integer {

		return new Integer(this.value);

	}

	// Long Conversion
	public __long__(): string {

		return 'NotImplemented';

	}

	// Float Conversion
	public __float__(): Float {

		return this;

	}

	// Octal Conversion
	public __oct__(): string {

		return 'NotImplemented';

	}

	// Hex Conversion
	public __hex__(): string {

		return 'NotImplemented';

	}

	// Index
	public __index__(): string {

		return 'NotImplemented';

	}

	// Coercion
	public __coerce__(other: any): any {

		if (other instanceof Integer) {
			return [this,new Float(other.value)];
		} else if (other instanceof Float) {
			return [this,other];
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

}

class Complex extends Numeric {

	real: number;
	imag: number;

	constructor(real: number, imag: number) { super(); this.real = real; this.imag = imag; }

	// toString
	public __str__(): string {

		return this.real.toString()+' + '+this.imag.toString()+'j';

	}

	// Addition
	public __add__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			return new Complex(this.real + other.value, this.imag);
		} else if (other instanceof Float) {
			// upcast float to complex
			return new Complex(this.real + other.value, this.imag);
		} else if (other instanceof Complex) {
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
			return new Complex(this.real - other.value, this.imag);
		} else if (other instanceof Float) {
			// upcast float to complex
			return new Complex(this.real - other.value, this.imag);
		} else if (other instanceof Complex) {
			return new Complex(this.real - other.real, this.imag - other.imag);
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rsub__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			return new Complex(other.value - this.real, -this.imag);
		} else if (other instanceof Float) {
			// upcast float to complex
			return new Complex(other.value - this.real, -this.imag);
		} else if (other instanceof Complex) {
			return new Complex(other.real - this.real, other.imag - this.imag);
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Multiplication
	public __mul__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			return new Complex(this.real * other.value, this.imag * other.value);
		} else if (other instanceof Float) {
			// upcast float to complex
			return new Complex(this.real * other.value, this.imag * other.value);
		} else if (other instanceof Complex) {
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
			if (other.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Complex(Math.floor( this.real / other.value ), Math.floor( this.imag / other.value )); }
		} else if (other instanceof Float) {
			// upcast float to complex
			if (other.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Complex(Math.floor( this.real / other.value ), Math.floor( this.imag / other.value )); }
		} else if (other instanceof Complex) {
			if ((other.real == 0) && (other.imag == 0)) { return new Err('ZeroDivisionError','throw'); }
			else { 
				var newComplex: Complex = new Complex(0,0);
				var den: number = Math.pow(other.real,2)+Math.pow(other.imag,2);
				newComplex.real = Math.floor((this.real*other.real+this.imag*other.imag)/(den));
				newComplex.imag = Math.floor((this.imag*other.real-this.real*other.imag)/(den));
				return newComplex;
			}
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rfloordiv__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			if ((this.real == 0) && (this.imag == 0)) { return new Err('ZeroDivisionError','throw'); }
			else {
				var newComplex: Complex = new Complex(0,0);
				var den: number = Math.pow(this.real,2)+Math.pow(this.imag,2);
				newComplex.real = Math.floor((other.value*this.real)/(den));
				newComplex.imag = Math.floor((-other.value*this.imag)/(den));
				return newComplex;
			}
		} else if (other instanceof Float) {
			// upcast float to complex
			if ((this.real == 0) && (this.imag == 0)) { return new Err('ZeroDivisionError','throw'); }
			else {
				var newComplex: Complex = new Complex(0,0);
				var den: number = Math.pow(this.real,2)+Math.pow(this.imag,2);
				newComplex.real = Math.floor((other.value*this.real)/(den));
				newComplex.imag = Math.floor((-other.value*this.imag)/(den));
				return newComplex;
			}
		} else if (other instanceof Complex) {
			if ((this.real == 0) && (this.imag == 0)) { return new Err('ZeroDivisionError','throw'); }
			else {
				var newComplex: Complex = new Complex(0,0);
				var den: number = Math.pow(this.real,2)+Math.pow(this.imag,2);
				newComplex.real = Math.floor((other.real*this.real+other.imag*this.imag)/(den));
				newComplex.imag = Math.floor((other.imag*this.real-other.real*this.imag)/(den));
				return newComplex;
			}
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Modulus
	public __mod__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			if (other.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else {
				other = new Complex(other.value,0);
				return this.__sub__(other.__mul__(this.__floordiv__(other))); //remainder of a/b = a - floor(a/b)*b, a = this, b = other
			}
		} else if (other instanceof Float) {
			// upcast float to complex
			if (other.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else {
				other = new Complex(other.value,0);
				return this.__sub__(other.__mul__(this.__floordiv__(other))); //remainder of a/b = a - floor(a/b)*b, a = this, b = other
			}
		} else if (other instanceof Complex) {
			if ((other.real == 0) && (other.imag == 0)) { return new Err('ZeroDivisionError','throw'); }
			else {
				return this.__sub__(other.__mul__(this.__floordiv__(other))); //remainder of a/b = a - floor(a/b)*b, a = this, b = other
			}
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rmod__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			if ((this.real == 0) && (this.imag == 0)) { return new Err('ZeroDivisionError','throw'); }
			else {
				other = new Complex(other.value,0);
				return other.__sub__(this.__mul__(other.__floordiv__(this))); //remainder of a/b = a - floor(a/b)*b, a = other, b = this
			}
		} else if (other instanceof Float) {
			// upcast float to complex
			if ((this.real == 0) && (this.imag == 0)) { return new Err('ZeroDivisionError','throw'); }
			else {
				other = new Complex(other.value,0);
				return other.__sub__(this.__mul__(other.__floordiv__(this))); //remainder of a/b = a - floor(a/b)*b, a = other, b = this
			}
		} else if (other instanceof Complex) {
			if ((this.real == 0) && (this.imag == 0)) { return new Err('ZeroDivisionError','throw'); }
			else {
				return other.__sub__(this.__mul__(other.__floordiv__(this))); //remainder of a/b = a - floor(a/b)*b, a = other, b = this
			}
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Divmod
	public __divmod__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			if (other.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else {
				other = new Complex(other.value,0);
				var quotient: Complex = this.__floordiv__(other);
				var remainder: Complex = this.__sub__(quotient.__mul__(other));
				return [quotient,remainder];
			}
		} else if (other instanceof Float) {
			// upcast float to complex
			if (other.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else {
				other = new Complex(other.value,0);
				var quotient: Complex = this.__floordiv__(other);
				var remainder: Complex = this.__sub__(quotient.__mul__(other));
				return [quotient,remainder];
			}
		} else if (other instanceof Complex) {
			if ((other.real == 0) && (other.imag == 0)) { return new Err('ZeroDivisionError','throw'); }
			else {
				var quotient: Complex = this.__floordiv__(other);
				var remainder: Complex = this.__sub__(quotient.__mul__(other));
				return [quotient,remainder];
			}
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rdivmod__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to float
			if ((this.real == 0) && (this.imag == 0)) { return new Err('ZeroDivisionError','throw'); }
			else {
				other = new Complex(other.value,0);
				var quotient: Complex = other.__floordiv__(this);
				var remainder: Complex = other.__sub__(quotient.__mul__(this));
				return [quotient,remainder];
			}
		} else if (other instanceof Float) {
			// upcast integer to float
			if ((this.real == 0) && (this.imag == 0)) { return new Err('ZeroDivisionError','throw'); }
			else {
				other = new Complex(other.value,0);
				var quotient: Complex = other.__floordiv__(this);
				var remainder: Complex = other.__sub__(quotient.__mul__(this));
				return [quotient,remainder];
			}
		} else if (other instanceof Complex) {
			if ((this.real == 0) && (this.imag == 0)) { return new Err('ZeroDivisionError','throw'); }
			else {
				var quotient: Complex = other.__floordiv__(this);
				var remainder: Complex = other.__sub__(quotient.__mul__(this));
				return [quotient,remainder];
			}
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Cartesian-Polar Transformations
	public cart2pol(cart: Complex): any {

		var r: number = Math.sqrt(Math.pow(cart.real,2)+Math.pow(cart.imag,2));
		var theta: number = Math.atan2(cart.imag,cart.real);
		return [r,theta];

	}

	public pol2cart(r: number, theta: number) {
		
		return new Complex(r*Math.cos(theta),r*Math.sin(theta));

	}

	// Power - Missing Ternary Input Version
	public __pow__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			var this_pol: any = this.cart2pol(this);
			var result_r: number = Math.pow(this_pol[0],other.value);
			var result_theta: number = this_pol[1]*other.value;
			return this.pol2cart(result_r,result_theta);
		} else if (other instanceof Float) {
			// upcast float to complex
			var this_pol: any = this.cart2pol(this);
			var result_r: number = Math.pow(this_pol[0],other.value);
			var result_theta: number = this_pol[1]*other.value;
			return this.pol2cart(result_r,result_theta);
		} else if (other instanceof Complex) {
			var this_pol: any = this.cart2pol(this);
			var result_r: number = Math.pow(this_pol[0],other.real)*Math.exp(-this_pol[1]*other.imag);
			var result_theta: number = Math.log(this_pol[0])*other.imag+this_pol[1]*other.real;
			return this.pol2cart(result_r,result_theta);
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rpow__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			var other_theta: number = 0;
			if (other.value<0) { other_theta = Math.PI; }
			var result_r: number = Math.pow(Math.abs(other.value),this.real)*Math.exp(-other_theta*this.imag);
			var result_theta: number = Math.log(Math.abs(other.value))*this.imag+other_theta*this.real;
			return this.pol2cart(result_r,result_theta);
		} else if (other instanceof Float) {
			// upcast float to complex
			var other_theta: number = 0;
			if (other.value<0) { other_theta = Math.PI; }
			var result_r: number = Math.pow(Math.abs(other.value),this.real)*Math.exp(-other_theta*this.imag);
			var result_theta: number = Math.log(Math.abs(other.value))*this.imag+other_theta*this.real;
			return this.pol2cart(result_r,result_theta);
		} else if (other instanceof Complex) {
			var other_pol: any = this.cart2pol(other);
			var result_r: number = Math.pow(other_pol[0],this.real)*Math.exp(-other_pol[1]*this.imag);
			var result_theta: number = Math.log(other_pol[0])*this.imag+other_pol[1]*this.real;
			return this.pol2cart(result_r,result_theta);
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Bitwise Operations **Only for Integers**

	// Left Bitwise Shift
	public __lshift__(other: any): any {

		if (other instanceof Integer) {
			return 'NotImplemented';
		} else if (other instanceof Float) {
			return 'NotImplemented';
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rlshift__(other: any): any {

		if (other instanceof Integer) {
			return 'NotImplemented';
		} else if (other instanceof Float) {
			return 'NotImplemented';
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Right Bitwise Shift
	public __rshift__(other: any): any {

		if (other instanceof Integer) {
			return 'NotImplemented';
		} else if (other instanceof Float) {
			return 'NotImplemented';
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rrshift__(other: any): any {

		if (other instanceof Integer) {
			return 'NotImplemented';
		} else if (other instanceof Float) {
			return 'NotImplemented';
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// Bitwise AND
	public __and__(other: any): any {

		if (other instanceof Integer) {
			return 'NotImplemented';
		} else if (other instanceof Float) {
			return 'NotImplemented';
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to float
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rand__(other: any): any {

		return this.__and__(other); // bitwise and is symmetric

	}

	// Bitwise XOR
	public __xor__(other: any): any {

		if (other instanceof Integer) {
			return 'NotImplemented';
		} else if (other instanceof Float) {
			return 'NotImplemented';
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rxor__(other: any): any {

		return this.__xor__(other); // bitwise xor is symmetric

	}

	// Bitwise OR
	public __or__(other: any): any {

		if (other instanceof Integer) {
			return 'NotImplemented';
		} else if (other instanceof Float) {
			return 'NotImplemented';
		} else if (other instanceof Complex) {
			return 'NotImplemented'; // can't downcast complex to integer
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __ror__(other: any): any {

		return this.__or__(other); // bitwise or is symmetric

	}

	// Division
	public __div__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			if (other.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Complex( this.real / other.value , this.imag / other.value ); }
		} else if (other instanceof Float) {
			// upcast float to complex
			if (other.value == 0) { return new Err('ZeroDivisionError','throw'); }
			else { return new Complex( this.real / other.value , this.imag / other.value ); }
		} else if (other instanceof Complex) {
			if ((other.real == 0) && (other.imag == 0)) { return new Err('ZeroDivisionError','throw'); }
			else {
				var newComplex: Complex = new Complex(0,0);
				var den: number = Math.pow(other.real,2)+Math.pow(other.imag,2);
				newComplex.real = (this.real*other.real+this.imag*other.imag)/(den);
				newComplex.imag = (this.imag*other.real-this.real*other.imag)/(den);
				return newComplex;
			}
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	public __rdiv__(other: any): any {

		if (other instanceof Integer) {
			// upcast integer to complex
			if ((this.real == 0) && (this.imag == 0)) { return new Err('ZeroDivisionError','throw'); }
			else {
				var newComplex: Complex = new Complex(0,0);
				var den: number = Math.pow(this.real,2)+Math.pow(this.imag,2);
				newComplex.real = (other.value*this.real)/(den);
				newComplex.imag = (-other.value*this.imag)/(den);
				return newComplex;
			}
		} else if (other instanceof Float) {
			// upcast float to complex
			if ((this.real == 0) && (this.imag == 0)) { return new Err('ZeroDivisionError','throw'); }
			else {
				var newComplex: Complex = new Complex(0,0);
				var den: number = Math.pow(this.real,2)+Math.pow(this.imag,2);
				newComplex.real = (other.value*this.real)/(den);
				newComplex.imag = (-other.value*this.imag)/(den);
				return newComplex;
			}
		} else if (other instanceof Complex) {
			if ((this.real == 0) && (this.imag == 0)) { return new Err('ZeroDivisionError','throw'); }
			else {
				var newComplex: Complex = new Complex(0,0);
				var den: number = Math.pow(this.real,2)+Math.pow(this.imag,2);
				newComplex.real = (other.real*this.real+other.imag*this.imag)/(den);
				newComplex.imag = (other.imag*this.real-other.real*this.imag)/(den);
				return newComplex;
			}
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

	// True Division
	public __truediv__(other: any): any {

		return this.__div__(other);

	}

	public __rtruediv__(other: any): any {

		return this.__rdiv__(other);

	}

	// Negative Literal
	public __neg__(): Complex {

		this.real = -this.real;
		this.imag = -this.imag;
		return this;

	}

	// Positive Literal
	public __pos__(): Complex {

		return this;

	}

	// Absolute Value
	public __abs__(): Float {

		return new Float(Math.sqrt( Math.pow( this.real, 2 ) + Math.pow( this.imag, 2 ) ));
	
	}

	// Inversion
	public __invert__(): string {

		return 'NotImplemented';

	}

	// Complex Conversion
	public __complex__(): Complex {

		return this;

	}

	// Integer Conversion
	public __int__(): string {

		return 'NotImplemented';

	}

	// Long Conversion
	public __long__(): string {

		return 'NotImplemented';

	}

	// Float Conversion
	public __float__(): string {

		return 'NotImplemented';

	}

	// Octal Conversion
	public __oct__(): string {

		return 'NotImplemented';

	}

	// Hex Conversion
	public __hex__(): string {

		return 'NotImplemented';

	}

	// Index
	public __index__(): string {

		return 'NotImplemented';

	}

	// Coercion
	public __coerce__(other: any): any {

		if (other instanceof Integer) {
			return [this,new Complex(other.value,0)];
		} else if (other instanceof Float) {
			return [this,new Complex(other.value,0)];
		} else if (other instanceof Complex) {
			return [this,other];
		} else if (other instanceof Long) {
			return 'NotImplemented';
		} else { return 'NotImplemented'; }

	}

}

class Long extends Numeric {

	value: number;

	constructor(value: number) { super(); this.value = value; }
}
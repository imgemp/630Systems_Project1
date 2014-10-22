/// <reference path="Globals.ts" />
/// <reference path="Log.ts" />
var Integer = (function () {
    function Integer(value) {
        this.value = value;
    }
    // Addition
    Integer.prototype.__add__ = function (other) {
        if (other instanceof Integer) {
            var newInteger = new Integer(this.value);
            newInteger.value += other.value;
            return newInteger;
        } else if (other instanceof Float) {
            return 'NotImplemented';
        } else if (other instanceof Complex) {
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Integer.prototype.__radd__ = function (other) {
        return this.__add__(other);
    };

    // Subtraction
    Integer.prototype.__sub__ = function (other) {
        if (other instanceof Integer) {
            var newInteger = new Integer(this.value);
            newInteger.value -= other.value;
            return newInteger;
        } else if (other instanceof Float) {
            return 'NotImplemented';
        } else if (other instanceof Complex) {
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Integer.prototype.__rsub__ = function (other) {
        if (other instanceof Integer) {
            var newInteger = new Integer(other.value);
            newInteger.value -= this.value;
            return newInteger;
        } else if (other instanceof Float) {
            return 'NotImplemented';
        } else if (other instanceof Complex) {
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    // Multiplication
    Integer.prototype.__mul__ = function (other) {
        if (other instanceof Integer) {
            var newInteger = new Integer(this.value);
            newInteger.value *= other.value;
            return newInteger;
        } else if (other instanceof Float) {
            return 'NotImplemented';
        } else if (other instanceof Complex) {
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Integer.prototype.__rmul__ = function (other) {
        return this.__rmul__(other);
    };

    // Floor Division
    Integer.prototype.__floordiv__ = function (other) {
        if (other instanceof Integer) {
            var newInteger = new Integer(this.value);
            newInteger.value = Math.floor(newInteger.value / other.value);
            return newInteger;
        } else if (other instanceof Float) {
            return 'NotImplemented';
        } else if (other instanceof Complex) {
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Integer.prototype.__rfloordiv__ = function (other) {
        if (other instanceof Integer) {
            var newInteger = new Integer(other.value);
            newInteger.value = Math.floor(newInteger.value / this.value);
            return newInteger;
        } else if (other instanceof Float) {
            return 'NotImplemented';
        } else if (other instanceof Complex) {
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };
    return Integer;
})();

var Float = (function () {
    function Float(value) {
        this.value = value;
    }
    // Addition
    Float.prototype.__add__ = function (other) {
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
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Float.prototype.__radd__ = function (other) {
        return this.__add__(other);
    };

    // Subtraction
    Float.prototype.__sub__ = function (other) {
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
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Float.prototype.__rsub__ = function (other) {
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
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    // Multiplication
    Float.prototype.__mul__ = function (other) {
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
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Float.prototype.__rmul__ = function (other) {
        return this.__mul__(other);
    };

    // Floor Division
    Float.prototype.__floordiv__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to float
            var newFloat = new Float(this.value);
            newFloat.value = Math.floor(newFloat.value / other.value);
            return newFloat;
        } else if (other instanceof Float) {
            var newFloat = new Float(this.value);
            newFloat.value = Math.floor(newFloat.value / other.value);
            return newFloat;
        } else if (other instanceof Complex) {
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Float.prototype.__rfloordiv__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to float
            var newFloat = new Float(other.value);
            newFloat.value = Math.floor(newFloat.value / this.value);
            return newFloat;
        } else if (other instanceof Float) {
            var newFloat = new Float(other.value);
            newFloat.value = Math.floor(newFloat.value / this.value);
            return newFloat;
        } else if (other instanceof Complex) {
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };
    return Float;
})();

var Complex = (function () {
    function Complex(real, imag) {
        this.real = real;
        this.imag = imag;
    }
    // Addition
    Complex.prototype.__add__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to complex
            var newComplex = new Complex(this.real, this.imag);
            newComplex.real += other.value;
            return newComplex;
        } else if (other instanceof Float) {
            // upcast float to complex
            var newComplex = new Complex(this.real, this.imag);
            newComplex.real += other.value;
            return newComplex;
        } else if (other instanceof Complex) {
            var newComplex = new Complex(this.real, this.imag);
            newComplex.real += other.real;
            newComplex.imag += other.imag;
            return newComplex;
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Complex.prototype.__radd__ = function (other) {
        return this.__add__(other);
    };

    // Subtraction
    Complex.prototype.__sub__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to complex
            var newComplex = new Complex(this.real, this.imag);
            newComplex.real -= other.value;
            return newComplex;
        } else if (other instanceof Float) {
            // upcast float to complex
            var newComplex = new Complex(this.real, this.imag);
            newComplex.real -= other.value;
            return newComplex;
        } else if (other instanceof Complex) {
            var newComplex = new Complex(this.real, this.imag);
            newComplex.real -= other.real;
            newComplex.imag -= other.imag;
            return newComplex;
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Complex.prototype.__rsub__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to complex
            var newComplex = new Complex(other.value, 0);
            newComplex.real -= other.value;
            return newComplex;
        } else if (other instanceof Float) {
            // upcast float to complex
            var newComplex = new Complex(other.value, 0);
            newComplex.real -= this.real;
            newComplex.imag -= this.imag;
            return newComplex;
        } else if (other instanceof Complex) {
            var newComplex = new Complex(other.real, other.imag);
            newComplex.real -= this.real;
            newComplex.imag -= this.imag;
            return newComplex;
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    // Multiplication
    Complex.prototype.__mul__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to complex
            var newComplex = new Complex(this.real, this.imag);
            newComplex.real *= other.value;
            newComplex.imag *= other.value;
            return newComplex;
        } else if (other instanceof Float) {
            // upcast float to complex
            var newComplex = new Complex(this.real, this.imag);
            newComplex.real *= other.value;
            newComplex.imag *= other.value;
            return newComplex;
        } else if (other instanceof Complex) {
            var newComplex = new Complex(this.real, this.imag);
            newComplex.real = this.real * other.real - this.imag * other.imag;
            newComplex.imag = this.imag * other.real + this.real * other.imag;
            return newComplex;
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Complex.prototype.__rmul__ = function (other) {
        return this.__mul__(other);
    };

    // Floor Division
    Complex.prototype.__floordiv__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to complex
            var newComplex = new Complex(0, 0);
            newComplex.real = Math.floor(this.real / other.value);
            newComplex.imag = Math.floor(this.imag / other.value);
            return newComplex;
        } else if (other instanceof Float) {
            // upcast float to complex
            var newComplex = new Complex(0, 0);
            newComplex.real = Math.floor(this.real / other.value);
            newComplex.imag = Math.floor(this.imag / other.value);
            return newComplex;
        } else if (other instanceof Complex) {
            var newComplex = new Complex(0, 0);
            newComplex.real = Math.floor((this.real * other.real + this.imag * other.imag) / (Math.pow(other.real, 2) + Math.pow(other.imag, 2)));
            newComplex.imag = Math.floor((this.imag * other.real - this.real * other.imag) / (Math.pow(other.real, 2) + Math.pow(other.imag, 2)));
            return newComplex;
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Complex.prototype.__rfloordiv__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to complex
            var newComplex = new Complex(0, 0);
            newComplex.real = Math.floor((other.value * this.real) / (Math.pow(this.real, 2) + Math.pow(this.imag, 2)));
            newComplex.imag = Math.floor((-other.value * this.imag) / (Math.pow(this.real, 2) + Math.pow(this.imag, 2)));
            return newComplex;
        } else if (other instanceof Float) {
            // upcast float to complex
            var newComplex = new Complex(0, 0);
            newComplex.real = Math.floor((other.value * this.real) / (Math.pow(this.real, 2) + Math.pow(this.imag, 2)));
            newComplex.imag = Math.floor((-other.value * this.imag) / (Math.pow(this.real, 2) + Math.pow(this.imag, 2)));
            return newComplex;
        } else if (other instanceof Complex) {
            var newComplex = new Complex(0, 0);
            newComplex.real = Math.floor((other.real * this.real + other.imag * this.imag) / (Math.pow(this.real, 2) + Math.pow(this.imag, 2)));
            newComplex.imag = Math.floor((other.imag * this.real - other.real * this.imag) / (Math.pow(this.real, 2) + Math.pow(this.imag, 2)));
            return newComplex;
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };
    return Complex;
})();

var Long = (function () {
    function Long(value) {
        this.value = value;
    }
    return Long;
})();

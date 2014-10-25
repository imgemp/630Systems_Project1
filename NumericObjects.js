/// <reference path="Globals.ts" />
/// <reference path="Log.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Numeric = (function () {
    function Numeric() {
    }
    return Numeric;
})();

var Integer = (function (_super) {
    __extends(Integer, _super);
    function Integer(value) {
        _super.call(this);
        this.value = value;
    }
    // toString
    Integer.prototype.__str__ = function () {
        return this.value.toString();
    };

    // Addition
    Integer.prototype.__add__ = function (other) {
        if (other instanceof Integer) {
            return new Integer(this.value + other.value);
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
            return new Integer(this.value - other.value);
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
            return new Integer(other.value - this.value);
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
            return new Integer(this.value * other.value);
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
            if (other.value == 0) {
                return new Err('ZeroDivisionError: integer floordiv by zero', 'throw');
            } else {
                return new Integer(Math.floor(this.value / other.value));
            }
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
            if (this.value == 0) {
                throw 'ZeroDivisionError: integer floordiv by zero';
            } else {
                return new Integer(Math.floor(other.value / this.value));
            }
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

    // Modulus
    Integer.prototype.__mod__ = function (other) {
        if (other instanceof Integer) {
            if (other.value == 0) {
                throw 'ZeroDivisionError: integer mod by zero';
            } else {
                return new Integer(this.value % other.value);
            }
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

    Integer.prototype.__rmod__ = function (other) {
        if (other instanceof Integer) {
            if (this.value == 0) {
                throw 'ZeroDivisionError: integer mod by zero';
            } else {
                return new Integer(other.value % this.value);
            }
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

    // Divmod
    Integer.prototype.__divmod__ = function (other) {
        if (other instanceof Integer) {
            if (other.value == 0) {
                throw 'ZeroDivisionError: integer divmod by zero';
            } else {
                var quotient = this.__floordiv__(other);
                var remainder = this.__sub__(quotient.__mul__(other));
                return [quotient, remainder];
            }
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

    Integer.prototype.__rdivmod__ = function (other) {
        if (other instanceof Integer) {
            if (this.value == 0) {
                throw 'ZeroDivisionError: integer divmod by zero';
            } else {
                var quotient = other.__floordiv__(this);
                var remainder = other.__sub__(quotient.__mul__(this));
                return [quotient, remainder];
            }
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

    // Power - Missing Ternary Input Version
    Integer.prototype.__pow__ = function (other) {
        if (other instanceof Integer) {
            return new Integer(Math.pow(this.value, other.value));
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

    Integer.prototype.__rpow__ = function (other) {
        if (other instanceof Integer) {
            return new Integer(Math.pow(other.value, this.value));
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

    // Bitwise Operations **Only for Integers**
    // Left Bitwise Shift
    Integer.prototype.__lshift__ = function (other) {
        if (other instanceof Integer) {
            return new Integer(this.value << other.value);
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

    Integer.prototype.__rlshift__ = function (other) {
        if (other instanceof Integer) {
            return new Integer(other.value << this.value);
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

    // Right Bitwise Shift
    Integer.prototype.__rshift__ = function (other) {
        if (other instanceof Integer) {
            return new Integer(this.value >> other.value);
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

    Integer.prototype.__rrshift__ = function (other) {
        if (other instanceof Integer) {
            return new Integer(other.value >> this.value);
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

    // Bitwise AND
    Integer.prototype.__and__ = function (other) {
        if (other instanceof Integer) {
            return new Integer(this.value & other.value);
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

    Integer.prototype.__rand__ = function (other) {
        return this.__and__(other);
    };

    // Bitwise XOR
    Integer.prototype.__xor__ = function (other) {
        if (other instanceof Integer) {
            return new Integer(this.value ^ other.value);
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

    Integer.prototype.__rxor__ = function (other) {
        return this.__xor__(other);
    };

    // Bitwise OR
    Integer.prototype.__or__ = function (other) {
        if (other instanceof Integer) {
            return new Integer(this.value | other.value);
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

    Integer.prototype.__ror__ = function (other) {
        return this.__or__(other);
    };

    // Division - Assume Classic Mode
    Integer.prototype.__div__ = function (other) {
        return this.__floordiv__(other);
    };

    Integer.prototype.__rdiv__ = function (other) {
        return this.__rfloordiv__(other);
    };

    // True Division
    Integer.prototype.__truediv__ = function (other) {
        if (other instanceof Integer) {
            if (other.value == 0) {
                throw 'ZeroDivisionError: integer truediv by zero';
            } else {
                return new Float(this.value / other.value);
            }
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

    Integer.prototype.__rtruediv__ = function (other) {
        if (other instanceof Integer) {
            if (this.value == 0) {
                throw 'ZeroDivisionError: integer truediv by zero';
            } else {
                return new Float(other.value / this.value);
            }
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

    // Negative Literal
    Integer.prototype.__neg__ = function () {
        this.value = -this.value;
        return this;
    };

    // Positive Literal
    Integer.prototype.__pos__ = function () {
        return this;
    };

    // Absolute Value
    Integer.prototype.__abs__ = function () {
        this.value = Math.abs(this.value);
        return this;
    };

    // Inversion
    Integer.prototype.__invert__ = function () {
        return new Integer(~this.value);
    };

    // Complex Conversion
    Integer.prototype.__complex__ = function () {
        return new Complex(this.value, 0);
    };

    // Integer Conversion
    Integer.prototype.__int__ = function () {
        return this;
    };

    // Long Conversion
    Integer.prototype.__long__ = function () {
        return 'NotImplemented';
    };

    // Float Conversion
    Integer.prototype.__float__ = function () {
        return new Float(this.value);
    };

    // Octal Conversion
    Integer.prototype.__oct__ = function () {
        return this.value.toString(8);
    };

    // Hex Conversion
    Integer.prototype.__hex__ = function () {
        return this.value.toString(16);
    };

    // Index
    Integer.prototype.__index__ = function () {
        return this;
    };

    // Coercion
    Integer.prototype.__coerce__ = function (other) {
        if (other instanceof Integer) {
            return [this, other];
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
})(Numeric);

var Float = (function (_super) {
    __extends(Float, _super);
    function Float(value) {
        _super.call(this);
        this.value = value;
    }
    // toString
    Float.prototype.__str__ = function () {
        return this.value.toString();
    };

    // Addition
    Float.prototype.__add__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to float
            return new Float(this.value + other.value);
        } else if (other instanceof Float) {
            return new Float(this.value + other.value);
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
            return new Float(this.value - other.value);
        } else if (other instanceof Float) {
            return new Float(this.value - other.value);
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
            return new Float(other.value - this.value);
        } else if (other instanceof Float) {
            return new Float(other.value - this.value);
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
            return new Float(this.value * other.value);
        } else if (other instanceof Float) {
            return new Float(this.value * other.value);
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
            if (other.value == 0) {
                throw 'ZeroDivisionError: float floordiv by zero';
            } else {
                return new Float(Math.floor(this.value / other.value));
            }
        } else if (other instanceof Float) {
            if (other.value == 0) {
                throw 'ZeroDivisionError: float floordiv by zero';
            } else {
                return new Float(Math.floor(this.value / other.value));
            }
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
            if (this.value == 0) {
                throw 'ZeroDivisionError: float floordiv by zero';
            } else {
                return new Float(Math.floor(other.value / this.value));
            }
        } else if (other instanceof Float) {
            if (this.value == 0) {
                throw 'ZeroDivisionError: float floordiv by zero';
            } else {
                return new Float(Math.floor(other.value / this.value));
            }
        } else if (other instanceof Complex) {
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    // Modulus
    Float.prototype.__mod__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to float
            if (other.value == 0) {
                throw 'ZeroDivisionError: float mod by zero';
            } else {
                return new Float(this.value % other.value);
            }
        } else if (other instanceof Float) {
            if (other.value == 0) {
                throw 'ZeroDivisionError: float mod by zero';
            } else {
                return new Float(this.value % other.value);
            }
        } else if (other instanceof Complex) {
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Float.prototype.__rmod__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to float
            if (this.value == 0) {
                throw 'ZeroDivisionError: float mod by zero';
            } else {
                return new Float(other.value % this.value);
            }
        } else if (other instanceof Float) {
            if (this.value == 0) {
                throw 'ZeroDivisionError: float mod by zero';
            } else {
                return new Float(other.value % this.value);
            }
        } else if (other instanceof Complex) {
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    // Divmod
    Float.prototype.__divmod__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to float
            if (other.value == 0) {
                throw 'ZeroDivisionError: float divmod by zero';
            } else {
                other = new Float(other.value);
                var quotient = this.__floordiv__(other);
                var remainder = this.__sub__(quotient.__mul__(other));
                return [quotient, remainder];
            }
        } else if (other instanceof Float) {
            if (other.value == 0) {
                throw 'ZeroDivisionError: float divmod by zero';
            } else {
                var quotient = this.__floordiv__(other);
                var remainder = this.__sub__(quotient.__mul__(other));
                return [quotient, remainder];
            }
        } else if (other instanceof Complex) {
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Float.prototype.__rdivmod__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to float
            if (this.value == 0) {
                throw 'ZeroDivisionError: float mod by zero';
            } else {
                other = new Float(other.value);
                var quotient = other.__floordiv__(this);
                var remainder = other.__sub__(quotient.__mul__(this));
                return [quotient, remainder];
            }
        } else if (other instanceof Float) {
            if (this.value == 0) {
                throw 'ZeroDivisionError: float mod by zero';
            } else {
                var quotient = other.__floordiv__(this);
                var remainder = other.__sub__(quotient.__mul__(this));
                return [quotient, remainder];
            }
        } else if (other instanceof Complex) {
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    // Power - Missing Ternary Input Version
    Float.prototype.__pow__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to float
            return new Float(Math.pow(this.value, other.value));
        } else if (other instanceof Float) {
            return new Float(Math.pow(this.value, other.value));
        } else if (other instanceof Complex) {
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Float.prototype.__rpow__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to float
            return new Float(Math.pow(other.value, this.value));
        } else if (other instanceof Float) {
            return new Float(Math.pow(other.value, this.value));
        } else if (other instanceof Complex) {
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    // Bitwise Operations **Only for Integers**
    // Left Bitwise Shift
    Float.prototype.__lshift__ = function (other) {
        if (other instanceof Integer) {
            return 'NotImplemented';
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

    Float.prototype.__rlshift__ = function (other) {
        if (other instanceof Integer) {
            return 'NotImplemented';
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

    // Right Bitwise Shift
    Float.prototype.__rshift__ = function (other) {
        if (other instanceof Integer) {
            return 'NotImplemented';
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

    Float.prototype.__rrshift__ = function (other) {
        if (other instanceof Integer) {
            return 'NotImplemented';
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

    // Bitwise AND
    Float.prototype.__and__ = function (other) {
        if (other instanceof Integer) {
            return 'NotImplemented';
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

    Float.prototype.__rand__ = function (other) {
        return this.__and__(other);
    };

    // Bitwise XOR
    Float.prototype.__xor__ = function (other) {
        if (other instanceof Integer) {
            return 'NotImplemented';
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

    Float.prototype.__rxor__ = function (other) {
        return this.__xor__(other);
    };

    // Bitwise OR
    Float.prototype.__or__ = function (other) {
        if (other instanceof Integer) {
            return 'NotImplemented';
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

    Float.prototype.__ror__ = function (other) {
        return this.__or__(other);
    };

    // Division
    Float.prototype.__div__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to float
            if (other.value == 0) {
                throw 'ZeroDivisionError: float div by zero';
            } else {
                return new Float(this.value / other.value);
            }
        } else if (other instanceof Float) {
            if (other.value == 0) {
                throw 'ZeroDivisionError: float div by zero';
            } else {
                return new Float(this.value / other.value);
            }
        } else if (other instanceof Complex) {
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Float.prototype.__rdiv__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to float
            if (this.value == 0) {
                throw 'ZeroDivisionError: float div by zero';
            } else {
                return new Float(other.value / this.value);
            }
        } else if (other instanceof Float) {
            if (this.value == 0) {
                throw 'ZeroDivisionError: float div by zero';
            } else {
                return new Float(other.value / this.value);
            }
        } else if (other instanceof Complex) {
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    // True Division
    Float.prototype.__truediv__ = function (other) {
        return this.__div__(other);
    };

    Float.prototype.__rtruediv__ = function (other) {
        return this.__rdiv__(other);
    };

    // Negative Literal
    Float.prototype.__neg__ = function () {
        this.value = -this.value;
        return this;
    };

    // Positive Literal
    Float.prototype.__pos__ = function () {
        return this;
    };

    // Absolute Value
    Float.prototype.__abs__ = function () {
        this.value = Math.abs(this.value);
        return this;
    };

    // Inversion
    Float.prototype.__invert__ = function () {
        return 'NotImplemented';
    };

    // Complex Conversion
    Float.prototype.__complex__ = function () {
        return new Complex(this.value, 0);
    };

    // Integer Conversion
    Float.prototype.__int__ = function () {
        return new Integer(this.value);
    };

    // Long Conversion
    Float.prototype.__long__ = function () {
        return 'NotImplemented';
    };

    // Float Conversion
    Float.prototype.__float__ = function () {
        return this;
    };

    // Octal Conversion
    Float.prototype.__oct__ = function () {
        return 'NotImplemented';
    };

    // Hex Conversion
    Float.prototype.__hex__ = function () {
        return 'NotImplemented';
    };

    // Index
    Float.prototype.__index__ = function () {
        return 'NotImplemented';
    };

    // Coercion
    Float.prototype.__coerce__ = function (other) {
        if (other instanceof Integer) {
            return [this, new Float(other.value)];
        } else if (other instanceof Float) {
            return [this, other];
        } else if (other instanceof Complex) {
            return 'NotImplemented';
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };
    return Float;
})(Numeric);

var Complex = (function (_super) {
    __extends(Complex, _super);
    function Complex(real, imag) {
        _super.call(this);
        this.real = real;
        this.imag = imag;
    }
    // toString
    Complex.prototype.__str__ = function () {
        return this.real.toString() + ' + ' + this.imag.toString() + 'j';
    };

    // Addition
    Complex.prototype.__add__ = function (other) {
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
            return new Complex(this.real - other.value, this.imag);
        } else if (other instanceof Float) {
            // upcast float to complex
            return new Complex(this.real - other.value, this.imag);
        } else if (other instanceof Complex) {
            return new Complex(this.real - other.real, this.imag - other.imag);
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Complex.prototype.__rsub__ = function (other) {
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
        } else {
            return 'NotImplemented';
        }
    };

    // Multiplication
    Complex.prototype.__mul__ = function (other) {
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
            if (other.value == 0) {
                throw 'ZeroDivisionError: complex floordiv by zero';
            } else {
                return new Complex(Math.floor(this.real / other.value), Math.floor(this.imag / other.value));
            }
        } else if (other instanceof Float) {
            // upcast float to complex
            if (other.value == 0) {
                throw 'ZeroDivisionError: complex floordiv by zero';
            } else {
                return new Complex(Math.floor(this.real / other.value), Math.floor(this.imag / other.value));
            }
        } else if (other instanceof Complex) {
            if ((other.real == 0) && (other.imag == 0)) {
                throw 'ZeroDivisionError: complex floordiv by zero';
            } else {
                var newComplex = new Complex(0, 0);
                var den = Math.pow(other.real, 2) + Math.pow(other.imag, 2);
                newComplex.real = Math.floor((this.real * other.real + this.imag * other.imag) / (den));
                newComplex.imag = Math.floor((this.imag * other.real - this.real * other.imag) / (den));
                return newComplex;
            }
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Complex.prototype.__rfloordiv__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to complex
            if ((this.real == 0) && (this.imag == 0)) {
                throw 'ZeroDivisionError: complex floordiv by zero';
            } else {
                var newComplex = new Complex(0, 0);
                var den = Math.pow(this.real, 2) + Math.pow(this.imag, 2);
                newComplex.real = Math.floor((other.value * this.real) / (den));
                newComplex.imag = Math.floor((-other.value * this.imag) / (den));
                return newComplex;
            }
        } else if (other instanceof Float) {
            // upcast float to complex
            if ((this.real == 0) && (this.imag == 0)) {
                throw 'ZeroDivisionError: complex floordiv by zero';
            } else {
                var newComplex = new Complex(0, 0);
                var den = Math.pow(this.real, 2) + Math.pow(this.imag, 2);
                newComplex.real = Math.floor((other.value * this.real) / (den));
                newComplex.imag = Math.floor((-other.value * this.imag) / (den));
                return newComplex;
            }
        } else if (other instanceof Complex) {
            if ((this.real == 0) && (this.imag == 0)) {
                throw 'ZeroDivisionError: complex floordiv by zero';
            } else {
                var newComplex = new Complex(0, 0);
                var den = Math.pow(this.real, 2) + Math.pow(this.imag, 2);
                newComplex.real = Math.floor((other.real * this.real + other.imag * this.imag) / (den));
                newComplex.imag = Math.floor((other.imag * this.real - other.real * this.imag) / (den));
                return newComplex;
            }
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    // Modulus
    Complex.prototype.__mod__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to complex
            if (other.value == 0) {
                throw 'ZeroDivisionError: complex mod by zero';
            } else {
                other = new Complex(other.value, 0);
                return this.__sub__(other.__mul__(this.__floordiv__(other)));
            }
        } else if (other instanceof Float) {
            // upcast float to complex
            if (other.value == 0) {
                throw 'ZeroDivisionError: complex mod by zero';
            } else {
                other = new Complex(other.value, 0);
                return this.__sub__(other.__mul__(this.__floordiv__(other)));
            }
        } else if (other instanceof Complex) {
            if ((other.real == 0) && (other.imag == 0)) {
                throw 'ZeroDivisionError: complex mod by zero';
            } else {
                return this.__sub__(other.__mul__(this.__floordiv__(other)));
            }
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Complex.prototype.__rmod__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to complex
            if ((this.real == 0) && (this.imag == 0)) {
                throw 'ZeroDivisionError: complex mod by zero';
            } else {
                other = new Complex(other.value, 0);
                return other.__sub__(this.__mul__(other.__floordiv__(this)));
            }
        } else if (other instanceof Float) {
            // upcast float to complex
            if ((this.real == 0) && (this.imag == 0)) {
                throw 'ZeroDivisionError: complex mod by zero';
            } else {
                other = new Complex(other.value, 0);
                return other.__sub__(this.__mul__(other.__floordiv__(this)));
            }
        } else if (other instanceof Complex) {
            if ((this.real == 0) && (this.imag == 0)) {
                throw 'ZeroDivisionError: complex mod by zero';
            } else {
                return other.__sub__(this.__mul__(other.__floordiv__(this)));
            }
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    // Cartesian-Polar Transformations
    Complex.prototype.cart2pol = function (cart) {
        var r = Math.sqrt(Math.pow(cart.real, 2) + Math.pow(cart.imag, 2));
        var theta = Math.atan2(cart.imag, cart.real);
        return [r, theta];
    };

    Complex.prototype.pol2cart = function (r, theta) {
        var tan_theta = Math.tan(theta);
        var sign = 1;
        if ((theta < Math.PI / 2) || (theta > Math.PI / 2)) {
            sign = -1;
        }
        var real_part = sign * r / Math.sqrt(1 + Math.pow(tan_theta, 2));
        var imag_part = real_part * tan_theta;
        return new Complex(real_part, imag_part);
    };

    // Power - Missing Ternary Input Version
    Complex.prototype.__pow__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to complex
            var this_pol = this.cart2pol(this);
            var result_r = this_pol[0];
            var result_theta = this_pol[1] * other.value;
            return this.pol2cart(result_r, result_theta);
        } else if (other instanceof Float) {
            // upcast float to complex
            var this_pol = this.cart2pol(this);
            var result_r = this_pol[0];
            var result_theta = this_pol[1] * other.value;
            return this.pol2cart(result_r, result_theta);
        } else if (other instanceof Complex) {
            var this_pol = this.cart2pol(this);
            var result_r = this_pol[0] * Math.exp(-this_pol[1] * other.imag);
            var result_theta = this_pol[1] * other.real;
            return this.pol2cart(result_r, result_theta);
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Complex.prototype.__rpow__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to complex
            var other_theta = 0;
            if (other.value < 0) {
                other_theta = Math.PI;
            }
            var result_r = Math.abs(other.value) * Math.exp(-other_theta * this.imag);
            var result_theta = other_theta * this.real;
            return this.pol2cart(result_r, result_theta);
        } else if (other instanceof Float) {
            // upcast float to complex
            var other_theta = 0;
            if (other.value < 0) {
                other_theta = Math.PI;
            }
            var result_r = Math.abs(other.value) * Math.exp(-other_theta * this.imag);
            var result_theta = other_theta * this.real;
            return this.pol2cart(result_r, result_theta);
        } else if (other instanceof Complex) {
            var other_pol = this.cart2pol(other);
            var result_r = other_pol[0] * Math.exp(-other_pol[1] * this.imag);
            var result_theta = other_pol[1] * this.real;
            return this.pol2cart(result_r, result_theta);
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    // Bitwise Operations **Only for Integers**
    // Left Bitwise Shift
    Complex.prototype.__lshift__ = function (other) {
        if (other instanceof Integer) {
            return 'NotImplemented';
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

    Complex.prototype.__rlshift__ = function (other) {
        if (other instanceof Integer) {
            return 'NotImplemented';
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

    // Right Bitwise Shift
    Complex.prototype.__rshift__ = function (other) {
        if (other instanceof Integer) {
            return 'NotImplemented';
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

    Complex.prototype.__rrshift__ = function (other) {
        if (other instanceof Integer) {
            return 'NotImplemented';
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

    // Bitwise AND
    Complex.prototype.__and__ = function (other) {
        if (other instanceof Integer) {
            return 'NotImplemented';
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

    Complex.prototype.__rand__ = function (other) {
        return this.__and__(other);
    };

    // Bitwise XOR
    Complex.prototype.__xor__ = function (other) {
        if (other instanceof Integer) {
            return 'NotImplemented';
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

    Complex.prototype.__rxor__ = function (other) {
        return this.__xor__(other);
    };

    // Bitwise OR
    Complex.prototype.__or__ = function (other) {
        if (other instanceof Integer) {
            return 'NotImplemented';
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

    Complex.prototype.__ror__ = function (other) {
        return this.__or__(other);
    };

    // Division
    Complex.prototype.__div__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to complex
            if (other.value == 0) {
                throw 'ZeroDivisionError: complex div by zero';
            } else {
                return new Complex(this.real / other.value, this.imag / other.value);
            }
        } else if (other instanceof Float) {
            // upcast float to complex
            if (other.value == 0) {
                throw 'ZeroDivisionError: complex div by zero';
            } else {
                return new Complex(this.real / other.value, this.imag / other.value);
            }
        } else if (other instanceof Complex) {
            if ((other.real == 0) && (other.imag == 0)) {
                throw 'ZeroDivisionError: complex div by zero';
            } else {
                var newComplex = new Complex(0, 0);
                var den = Math.pow(other.real, 2) + Math.pow(other.imag, 2);
                newComplex.real = (this.real * other.real + this.imag * other.imag) / (den);
                newComplex.imag = (this.imag * other.real - this.real * other.imag) / (den);
                return newComplex;
            }
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    Complex.prototype.__rdiv__ = function (other) {
        if (other instanceof Integer) {
            // upcast integer to complex
            if ((this.real == 0) && (this.imag == 0)) {
                throw 'ZeroDivisionError: complex div by zero';
            } else {
                var newComplex = new Complex(0, 0);
                var den = Math.pow(this.real, 2) + Math.pow(this.imag, 2);
                newComplex.real = (other.value * this.real) / (den);
                newComplex.imag = (-other.value * this.imag) / (den);
                return newComplex;
            }
        } else if (other instanceof Float) {
            // upcast float to complex
            if ((this.real == 0) && (this.imag == 0)) {
                throw 'ZeroDivisionError: complex div by zero';
            } else {
                var newComplex = new Complex(0, 0);
                var den = Math.pow(this.real, 2) + Math.pow(this.imag, 2);
                newComplex.real = (other.value * this.real) / (den);
                newComplex.imag = (-other.value * this.imag) / (den);
                return newComplex;
            }
        } else if (other instanceof Complex) {
            if ((this.real == 0) && (this.imag == 0)) {
                throw 'ZeroDivisionError: complex div by zero';
            } else {
                var newComplex = new Complex(0, 0);
                var den = Math.pow(this.real, 2) + Math.pow(this.imag, 2);
                newComplex.real = (other.real * this.real + other.imag * this.imag) / (den);
                newComplex.imag = (other.imag * this.real - other.real * this.imag) / (den);
                return newComplex;
            }
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };

    // True Division
    Complex.prototype.__truediv__ = function (other) {
        return this.__div__(other);
    };

    Complex.prototype.__rtruediv__ = function (other) {
        return this.__rdiv__(other);
    };

    // Negative Literal
    Complex.prototype.__neg__ = function () {
        this.real = -this.real;
        this.imag = -this.imag;
        return this;
    };

    // Positive Literal
    Complex.prototype.__pos__ = function () {
        return this;
    };

    // Absolute Value
    Complex.prototype.__abs__ = function () {
        return new Float(Math.sqrt(Math.pow(this.real, 2) + Math.pow(this.imag, 2)));
    };

    // Inversion
    Complex.prototype.__invert__ = function () {
        return 'NotImplemented';
    };

    // Complex Conversion
    Complex.prototype.__complex__ = function () {
        return this;
    };

    // Integer Conversion
    Complex.prototype.__int__ = function () {
        return 'NotImplemented';
    };

    // Long Conversion
    Complex.prototype.__long__ = function () {
        return 'NotImplemented';
    };

    // Float Conversion
    Complex.prototype.__float__ = function () {
        return 'NotImplemented';
    };

    // Octal Conversion
    Complex.prototype.__oct__ = function () {
        return 'NotImplemented';
    };

    // Hex Conversion
    Complex.prototype.__hex__ = function () {
        return 'NotImplemented';
    };

    // Index
    Complex.prototype.__index__ = function () {
        return 'NotImplemented';
    };

    // Coercion
    Complex.prototype.__coerce__ = function (other) {
        if (other instanceof Integer) {
            return [this, new Complex(other.value, 0)];
        } else if (other instanceof Float) {
            return [this, new Complex(other.value, 0)];
        } else if (other instanceof Complex) {
            return [this, other];
        } else if (other instanceof Long) {
            return 'NotImplemented';
        } else {
            return 'NotImplemented';
        }
    };
    return Complex;
})(Numeric);

var Long = (function (_super) {
    __extends(Long, _super);
    function Long(value) {
        _super.call(this);
        this.value = value;
    }
    return Long;
})(Numeric);

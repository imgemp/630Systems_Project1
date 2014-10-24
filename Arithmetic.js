/// <reference path="Globals.ts" />
/// <reference path="Log.ts" />
/// <reference path="NumericObjects.ts" />
// Addition
function add(x_this, y_other) {
    var err = 'add(' + x_this.constructor.name + ',' + y_other.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__add__(y_other);
        if (result == 'NotImplemented') {
            result = y_other.__radd__(x_this);
        }
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        try  {
            return x_this + y_other;
        } catch (err) {
            throw err;
        }
    }
}

// Subtraction
function sub(x_this, y_other) {
    var err = 'sub(' + x_this.constructor.name + ',' + y_other.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__sub__(y_other);
        if (result == 'NotImplemented') {
            result = y_other.__rsub__(x_this);
        }
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        try  {
            return x_this - y_other;
        } catch (err) {
            throw err;
        }
    }
}

// Multiplication
function mul(x_this, y_other) {
    var err = 'mul(' + x_this.constructor.name + ',' + y_other.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__mul__(y_other);
        if (result == 'NotImplemented') {
            result = y_other.__rmul__(x_this);
        }
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        try  {
            return x_this * y_other;
        } catch (err) {
            throw err;
        }
    }
}

// Floor Division
function floordiv(x_this, y_other) {
    var err = 'floordiv(' + x_this.constructor.name + ',' + y_other.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__floordiv__(y_other);
        if (result == 'NotImplemented') {
            result = y_other.__rfloordiv__(x_this);
        }
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        try  {
            return Math.floor(x_this / y_other);
        } catch (err) {
            throw err;
        }
    }
}

// Modulus
function mod(x_this, y_other) {
    var err = 'mod(' + x_this.constructor.name + ',' + y_other.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__mod__(y_other);
        if (result == 'NotImplemented') {
            result = y_other.__rmod__(x_this);
        }
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        try  {
            return x_this % y_other;
        } catch (err) {
            throw err;
        }
    }
}

// Divmod
function divmod(x_this, y_other) {
    var err = 'divmod(' + x_this.constructor.name + ',' + y_other.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__divmod__(y_other);
        if (result == 'NotImplemented') {
            result = y_other.__rdivmod__(x_this);
        }
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        try  {
            var quotient = Math.floor(x_this / y_other);
            var remainder = x_this - quotient * y_other;
            return [quotient, remainder];
        } catch (err) {
            throw err;
        }
    }
}

// Power - Missing Ternary Input Version
function pow(x_this, y_other) {
    var err = 'pow(' + x_this.constructor.name + ',' + y_other.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__pow__(y_other);
        if (result == 'NotImplemented') {
            result = y_other.__rpow__(x_this);
        }
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        try  {
            return Math.pow(x_this, y_other);
        } catch (err) {
            throw err;
        }
    }
}

// Bitwise Operations **Only for Integers**
// Left Bitwise Shift
function lshift(x_this, y_other) {
    var err = 'lshift(' + x_this.constructor.name + ',' + y_other.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__lshift__(y_other);
        if (result == 'NotImplemented') {
            result = y_other.__rlshift__(x_this);
        }
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        try  {
            return x_this << y_other;
        } catch (err) {
            throw err;
        }
    }
}

// Right Bitwise Shift
function rshift(x_this, y_other) {
    var err = 'rshift(' + x_this.constructor.name + ',' + y_other.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__rshift__(y_other);
        if (result == 'NotImplemented') {
            result = y_other.__rrshift__(x_this);
        }
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        try  {
            return x_this >> y_other;
        } catch (err) {
            throw err;
        }
    }
}

// Bitwise AND
function and(x_this, y_other) {
    var err = 'and(' + x_this.constructor.name + ',' + y_other.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__and__(y_other);
        if (result == 'NotImplemented') {
            result = y_other.__rand__(x_this);
        }
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        try  {
            return x_this & y_other;
        } catch (err) {
            throw err;
        }
    }
}

// Bitwise XOR
function xor(x_this, y_other) {
    var err = 'xor(' + x_this.constructor.name + ',' + y_other.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__xor__(y_other);
        if (result == 'NotImplemented') {
            result = y_other.__rxor__(x_this);
        }
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        try  {
            return x_this ^ y_other;
        } catch (err) {
            throw err;
        }
    }
}

// Bitwise OR
function or(x_this, y_other) {
    var err = 'or(' + x_this.constructor.name + ',' + y_other.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__or__(y_other);
        if (result == 'NotImplemented') {
            result = y_other.__ror__(x_this);
        }
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        try  {
            return x_this | y_other;
        } catch (err) {
            throw err;
        }
    }
}

// Division - Assume Classic Mode
function div(x_this, y_other) {
    var err = 'div(' + x_this.constructor.name + ',' + y_other.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__div__(y_other);
        if (result == 'NotImplemented') {
            result = y_other.__rdiv__(x_this);
        }
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        try  {
            return x_this / y_other;
        } catch (err) {
            throw err;
        }
    }
}

// True Division
function truediv(x_this, y_other) {
    var err = 'truediv(' + x_this.constructor.name + ',' + y_other.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__truediv__(y_other);
        if (result == 'NotImplemented') {
            result = y_other.__rtruediv__(x_this);
        }
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        try  {
            return x_this / y_other;
        } catch (err) {
            throw err;
        }
    }
}

// Negative Literal
function neg(x_this) {
    var err = 'neg(' + x_this.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__neg__();
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        try  {
            return -x_this;
        } catch (err) {
            throw err;
        }
    }
}

// Positive Literal
function pos(x_this) {
    var err = 'pos(' + x_this.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__pos__();
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        try  {
            return x_this;
        } catch (err) {
            throw err;
        }
    }
}

// Absolute Value
function abs(x_this) {
    var err = 'abs(' + x_this.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__abs__();
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        try  {
            return Math.abs(x_this);
        } catch (err) {
            throw err;
        }
    }
}

// Inversion
function invert(x_this) {
    var err = 'invert(' + x_this.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__invert__();
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        try  {
            return ~x_this;
        } catch (err) {
            throw err;
        }
    }
}

// Complex Conversion
function complex(x_this) {
    var err = 'complex(' + x_this.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__complex__();
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        throw err;
    }
}

// Integer Conversion
function int(x_this) {
    var err = 'int(' + x_this.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__int__();
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        throw err;
    }
}

// Long Conversion
function long(x_this) {
    var err = 'long(' + x_this.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__long__();
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        throw err;
    }
}

// Float Conversion
function float(x_this) {
    var err = 'float(' + x_this.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__float__();
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        throw err;
    }
}

// Octal Conversion
function oct(x_this) {
    var err = 'oct(' + x_this.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__oct__();
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        try  {
            return x_this.toString(8);
        } catch (err) {
            throw err;
        }
    }
}

// Hex Conversion
function hex(x_this) {
    var err = 'hex(' + x_this.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__hex__();
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        try  {
            return x_this.toString(16);
        } catch (err) {
            throw err;
        }
    }
}

// Index
function index(x_this) {
    var err = 'index(' + x_this.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__index__();
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        throw err;
    }
}

// Coercion
function coerce(x_this, y_other) {
    var err = 'coerce(' + x_this.constructor.name + ',' + y_other.constructor.name + ') NotImplemented';
    var result;
    if (x_this instanceof Numeric) {
        result = x_this.__coerce__(y_other);
        if (result == 'NotImplemented') {
            throw err;
        } else {
            return result;
        }
    } else {
        if (typeof (x_this) == 'number') {
            try  {
                return [x_this, y_other + 0];
            } catch (err) {
                throw err;
            }
        } else if (typeof (x_this) == 'string') {
            try  {
                return [x_this, y_other + ''];
            } catch (err) {
                throw err;
            }
        } else if (typeof (x_this) == 'boolean') {
            try  {
                return [x_this, y_other && true];
            } catch (err) {
                throw err;
            }
        } else {
            throw err;
        }
    }
}

var test = add(1, 2, 3);

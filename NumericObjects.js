/// <reference path="Globals.ts" />
/// <reference path="Log.ts" />
var Integer = (function () {
    function Integer(value) {
        this.value = value;
    }
    Integer.prototype.__add__ = function (other) {
        var newInteger = new Integer(this.value);
        newInteger.value += other.value;
        return newInteger;
    };

    Integer.prototype.__add__ = function (other) {
        return 'Not Implemented';
    };

    Integer.prototype.__add__ = function (other) {
        return 'Not Implemented';
    };
    return Integer;
})();

var Float = (function () {
    function Float(value) {
        this.value = value;
    }
    Float.prototype.__add__ = function (other) {
        var newFloat = new Float(this.value);
        newFloat.value += other.value;
        return newFloat;
    };

    Float.prototype.__add__ = function (other) {
        var newFloat = new Float(this.value);
        newFloat.value += other.value;
        return newFloat;
    };

    Float.prototype.__add__ = function (other) {
        return 'Not Implemented';
    };
    return Float;
})();

var Complex = (function () {
    function Complex(real, imag) {
        this.real = real;
        this.imag = imag;
    }
    Complex.prototype.__add__ = function (other) {
        var newComplex = new Complex(this.real, this.imag);
        newComplex.real += other.value;
        return newComplex;
    };

    Complex.prototype.__add__ = function (other) {
        var newComplex = new Complex(this.real, this.imag);
        newComplex.real += other.value;
        return newComplex;
    };

    Complex.prototype.__add__ = function (other) {
        var newComplex = new Complex(this.real, this.imag);
        newComplex.real += other.real;
        newComplex.imag += other.imag;
        return newComplex;
    };
    return Complex;
})();

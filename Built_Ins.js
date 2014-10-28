/// <reference path="NumericObjects.ts" />
// Will yield the value associated with a numeric object or just returns the object
function getValue(object) {
    if (object instanceof Numeric) {
        if (object instanceof Complex) {
            return object.real;
        } else {
            return object.value;
        }
    } else {
        return object;
    }
}

// Extracts the relevant arguments
function getArgNames(func) {
    var reg = /\(([\s\S]*?)\)/;
    var args = reg.exec(func);
    if (args) {
        var arg_names = args[1].split(',').map(Function.prototype.call, String.prototype.trim);
        return arg_names;
    } else {
        return [];
    }
}

//iterable check
function all() {
    throw 'Built-in Not Implemented';
}

//iterable check
function any() {
    throw 'Built-in Not Implemented';
}
function basestring() {
    throw 'Built-in Not Implemented';
}
function bin(x) {
    if (x instanceof Integer) {
        return x.toString(2);
    }
}
function bool(x) {
    var xVal = x || false;
    if (xVal != false) {
        if (xVal == 'None' || xVal == '' || xVal == undefined || xVal == 0) {
            xVal = false;
        } else {
            xVal = true;
        }
    }
    return xVal;
}
function bytearray() {
    throw 'Built-in Not Implemented';
}
function callable(obj) {
    throw 'Built-in Not Implemented';
}
function chr(i) {
    if (i <= 255 && i >= 0) {
        return String.fromCharCode(i);
    } else {
        throw "ValueError";
    }
}
function classmethod(func) {
    throw 'Built-in Not Implemented';
}
function cmp(x, y) {
    if (x === y) {
        return 0;
    } else if (x > y) {
        return -1;
    } else if (x > y) {
        return 1;
    }
}
function compile() {
    throw 'Built-in Not Implemented';
}
function delattr(obj, attrName) {
    delete obj.attrName;
}
function dict(iter) {
    throw 'Built-in Not Implemented';
}
function dir(obj) {
    throw 'Built-in Not Implemented';
}
function enumerate(seq, start) {
    start = 0;
    throw 'Built-in Not Implemented';
}
function eval1(express) {
    throw 'Built-in Not Implemented';
}
function execfile(fileName) {
    throw 'Built-in Not Implemented';
}
function file(name) {
    throw 'Built-in Not Implemented';
}

//iterable
function filter(funct, iter) {
    throw 'Built-in Not Implemented';
}
function format(value, format) {
    var format = format || '';
    if (format == '') {
        value.str();
    }
    if (format == 'fill') {
        throw 'Built-in Not Implemented';
    }
    if (format == 'align') {
        throw 'Built-in Not Implemented';
    }
    if (format == 'sign') {
        throw 'Built-in Not Implemented';
    }
    if (format == 'width') {
        throw 'Built-in Not Implemented';
    }
    if (format == 'precision') {
        throw 'Built-in Not Implemented';
    }
    if (format == 'type') {
        throw 'Built-in Not Implemented';
    }
}

//iterable
function frozenset(iterable) {
    throw 'Built-in Not Implemented';
}
function getattr(obj, attrName, dfault) {
    var dflt = dfault || false;
    if (obj.attrName != null) {
        return obj.attrName;
    } else if (dflt != false) {
        return dflt;
    } else {
        throw "AttributeError";
    }
}
function func_globals() {
    throw 'Built-in Not Implemented';
}
function hashattr(obj, name) {
    try  {
        getattr(obj, name);
    } catch (err) {
        return false;
    }
    return true;
}
function hash(obj) {
    throw 'Built-in Not Implemented';
}
function help(obj) {
    throw 'Built-in Not Implemented';
}
function id(obj) {
    throw 'Built-in Not Implemented';
}
function input() {
    throw 'Built-in Not Implemented';
}
function isinstance() {
    throw 'Built-in Not Implemented';
}
function issubclass() {
    throw 'Built-in Not Implemented';
}
function iter() {
    throw 'Built-in Not Implemented';
}
function len(s) {
    return s.length;
}
function list() {
    throw 'Built-in Not Implemented';
}
function locals() {
    throw 'Built-in Not Implemented';
}
function map() {
    throw 'Built-in Not Implemented';
}
function max(arg1, arg2) {
    //not entirely correct
    return Math.max(arg1, arg2);
}
function memoryview() {
    throw 'Built-in Not Implemented';
}
function min(arg1, arg2) {
    //not entirely correct
    return Math.min(arg1, arg2);
}
function next(iter) {
    throw 'Built-in Not Implemented';
}
function object() {
    return new Object;
}
function open1(name) {
    throw 'Built-in Not Implemented';
}
function ord(c) {
    if (c.length > 1) {
        return "TypeError";
    } else {
        return c.charCodeAt(0);
    }
}
function print1() {
    throw 'Built-in Not Implemented';
}
function property() {
    throw 'Built-in Not Implemented';
}
function range(stop, start, step) {
    var start = start || 0;
    var step = step || 1;
    throw 'Built-in Not Implemented';
}
function raw_input() {
    throw 'Built-in Not Implemented';
}

//iterable
function reduce() {
    throw 'Built-in Not Implemented';
}
function reload() {
    throw 'Built-in Not Implemented';
}
function repr() {
    throw 'Built-in Not Implemented';
}
function reversed() {
    throw 'Built-in Not Implemented';
}
function round(num, ndigits) {
    return Math.round(num);
}
function set() {
    throw 'Built-in Not Implemented';
}
function setattr(obj, name, value) {
    obj.name = value;
}
function slice(start, stop, step) {
    throw 'Built-in Not Implemented';
}
function sorted() {
    throw 'Built-in Not Implemented';
}
function staticmethod() {
    throw 'Built-in Not Implemented';
}

// Takes in an object and returns its string representation
function str(object) {
    var err;
    var result = '';
    if (object !== null) {
        if ((object.hasOwnProperty('length')) && (typeof object !== 'string')) {
            result += '[';
            for (var i = 0; i < object.length; i++) {
                try  {
                    err = 'str(' + object[i].constructor.name + ') NotImplemented';
                } catch (err) {
                    err = 'Object not defined.';
                }
                if (object[i] instanceof Numeric) {
                    result += str(object[i]) + ',';
                    if (result == 'NotImplemented') {
                        throw err;
                    }
                } else {
                    if ((object[i] !== undefined) && (object[i] !== null)) {
                        try  {
                            return str(object[i]);
                        } catch (err) {
                            throw err;
                        }
                    }
                }
            }
            result = result.substring(0, result.length - 1);
            result += ']';
            return result;
        } else {
            try  {
                err = 'str(' + object.constructor.name + ') NotImplemented';
            } catch (err) {
                err = 'Object not defined.';
            }
            if (object instanceof Numeric) {
                result = object.__str__();
                if (result == 'NotImplemented') {
                    throw err;
                } else {
                    return result;
                }
            } else {
                if ((object !== undefined) && (object !== null)) {
                    try  {
                        return object.toString();
                    } catch (err) {
                        throw err;
                    }
                }
            }
        }
    } else {
        return 'null';
    }
}

//iterable
function sum() {
    throw 'Built-in Not Implemented';
}
function super1() {
    throw 'Built-in Not Implemented';
}
function tuple() {
    throw 'Built-in Not Implemented';
}
function type() {
    throw 'Built-in Not Implemented';
}
function unichar(i) {
    return String.fromCharCode(i);
}
function unicode() {
    throw 'Built-in Not Implemented';
}
function vars() {
    throw 'Built-in Not Implemented';
}
function xrange() {
    throw 'Built-in Not Implemented';
}
function zip() {
    throw 'Built-in Not Implemented';
}
function _import_() {
    throw 'Built-in Not Implemented';
}

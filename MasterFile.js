/// <reference path="node.d.ts" />
function readNull(bytecode, ptr, level) {
    console.log(Array(level).join('\t') + 'Null');
    var obj = null;
    return [ptr, obj];
}

function readNone(bytecode, ptr, level) {
    console.log(Array(level).join('\t') + 'None');
    var obj = 'None';
    return [ptr, obj];
}

function readFalse(bytecode, ptr, level) {
    console.log(Array(level).join('\t') + 'False');
    var obj = false;
    return [ptr, obj];
}

function readTrue(bytecode, ptr, level) {
    console.log(Array(level).join('\t') + 'True');
    var obj = true;
    return [ptr, obj];
}

function readStopIter(bytecode, ptr, level) {
    console.log(Array(level).join('\t') + 'StopIteration');
    var obj = 'StopIteration';
    return [ptr, obj];
}

function readEllipsis(bytecode, ptr, level) {
    console.log(Array(level).join('\t') + 'Ellipsis');
    var obj = 'Ellipsis';
    return [ptr, obj];
}

function readInt32(bytecode, ptr, level) {
    var obj = bytecode.readUInt32LE(ptr);
    console.log(Array(level).join('\t') + obj);
    return [ptr + 4, obj];
}

function readInt64(bytecode, ptr, level) {
    console.log('Int64 Not implemented yet!');
    var obj = 'Int64 Not implemented yet!';
    return [ptr + 8, obj];
}

function readFloat32(bytecode, ptr, level) {
    console.log('Float32 Not implemented yet!');
    var obj = 'Float32 Not implemented yet!';
    return [ptr + 4, obj];
}

function readFloat64(bytecode, ptr, level) {
    console.log('Float64 Not implemented yet!');
    var obj = 'Float64 Not implemented yet!';
    return [ptr + 8, obj];
}

function readComplex32(bytecode, ptr, level) {
    console.log('Complex32 Not implemented yet!');
    var obj = 'Complex32 Not implemented yet!';
    return [ptr + 4, obj];
}

function readComplex64(bytecode, ptr, level) {
    console.log('Complex64 Not implemented yet!');
    var obj = 'Complex64 Not implemented yet!';
    return [ptr + 8, obj];
}

function readLong(bytecode, ptr, level) {
    console.log('Long Not implemented yet!');
    var obj = 'Long Not implemented yet!';
    return [ptr + 4, obj];
}

function readString(bytecode, ptr, level) {
    var obj = '';
    var size = bytecode.readUInt32LE(ptr);
    for (var j = 0; j < size; j++) {
        obj = obj + bytecode.toString('ascii', ptr + 4 + j, ptr + 4 + j + 1);
    }
    console.log(Array(level).join('\t') + obj);
    return [ptr + 4 + size, obj];
}

function readStringInterned(bytecode, ptr, level) {
    var obj = '';
    var size = bytecode.readUInt32LE(ptr);
    for (var j = 0; j < size; j++) {
        obj = obj + bytecode.toString('ascii', ptr + 4 + j, ptr + 4 + j + 1);
    }
    console.log(Array(level).join('\t') + '(interned)' + obj);
    byteObject.interned_list.push(obj);
    return [ptr + 4 + size, obj];
}

function readStringRef(bytecode, ptr, level) {
    var obj = bytecode.readUInt32LE(ptr);
    console.log(Array(level).join('\t') + 'ref to interned string in position ' + obj);
    return [ptr + 4, obj];
}

function readUnicode(bytecode, ptr, level) {
    var obj = '';
    var size = bytecode.readUInt32LE(ptr);
    for (var j = 0; j < size; j++) {
        obj = obj + bytecode.toString('utf8', ptr + 4 + j, ptr + 4 + j + 1);
    }
    console.log(Array(level).join('\t') + obj);
    return [ptr + 4 + size, obj];
}

function readDict(bytecode, ptr, level) {
    console.log('readDict Not implemented yet! You are screwed');
    var obj = 'readDict Not implemented yet! You are screwed';
    return [ptr + 4, obj];
}

function readTuple(bytecode, ptr, level) {
    var obj = [];
    var prefix = Array(level).join('\t');
    var nobjs = bytecode.readUInt32LE(ptr);
    process.stdout.write(' (' + String(nobjs) + ')\n');
    level = level + 1;
    ptr = ptr + 4;
    for (var j = 0; j < nobjs; j++) {
        var type = bytecode.toString('ascii', ptr, ptr + 1);
        if (type in readByType) {
            var out = readByType[type](bytecode, ptr + 1, level);
            ptr = out[0];
            obj[j] = out[1];
        } else {
            ptr = ptr + 1;
        }
    }
    return [ptr, obj];
}

// Interprets and returns a CodeObject
function readCodeObject(bytecode, ptr, level) {
    console.log(Array(level).join('\t') + 'code object:');
    var obj = new CodeObject();
    var out = [];

    level = level + 1;
    var prefix = Array(level).join('\t');

    // Read Argcount
    obj.argcount = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;
    console.log(prefix + 'argcount:\n' + prefix + String(obj.argcount));

    // Read Nlocals
    obj.nlocals = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;
    console.log(prefix + 'nlocals:\n' + prefix + String(obj.nlocals));

    // Read Stacksize
    obj.stacksize = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;
    console.log(prefix + 'stacksize:\n' + prefix + String(obj.stacksize));

    // Read Flags
    obj.flags = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;
    console.log(prefix + 'flags:\n' + prefix + String(obj.flags));

    var type = bytecode.toString('ascii', ptr, ptr + 1);
    ptr = ptr + 1; // should be 's'
    var codelen = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;

    // Start Reading Op Codes
    obj.code = [];
    console.log(prefix + 'code: (' + String(codelen) + ')');
    var colon = ': ';
    if (codelen > 9) {
        colon = ':  ';
    }
    var ptr0 = ptr;
    while (ptr < ptr0 + codelen) {
        if (ptr - ptr0 > 9) {
            colon = ': ';
        }
        var opcode = bytecode.readUInt8(ptr);
        var logout = '\t' + String(ptr - ptr0) + colon + String(opcode);
        if (opcode >= 90) {
            var arg1 = bytecode.readUInt8(ptr + 1);
            var arg2 = bytecode.readUInt8(ptr + 2);
            if (opcode > 99) {
                logout = logout + ' (' + String(arg1) + ',' + String(arg2) + ')';
            } else {
                logout = logout + '  (' + String(arg1) + ',' + String(arg2) + ')';
            }
            ptr = ptr + 3;
            obj.code.push(opcode);
            obj.code.push(arg1);
            obj.code.push(arg2);
        } else {
            ptr = ptr + 1;
            obj.code.push(opcode);
        }
        console.log(prefix + logout);
    }

    // Start Reading Tuple of Constants
    process.stdout.write(prefix + 'consts:');
    out = readTuple(bytecode, ptr + 1, level);
    ptr = out[0];
    obj.consts = out[1];

    // Start Reading Tuple of Names
    process.stdout.write(prefix + 'names:');
    out = readTuple(bytecode, ptr + 1, level);
    ptr = out[0];
    obj.names = out[1];

    // Start Reading Tuple of Variable Names
    process.stdout.write(prefix + 'varnames:');
    out = readTuple(bytecode, ptr + 1, level);
    ptr = out[0];
    obj.varnames = out[1];

    // Start Reading Tuple of Free Variables
    process.stdout.write(prefix + 'freevars:');
    out = readTuple(bytecode, ptr + 1, level);
    ptr = out[0];
    obj.freevars = out[1];

    // Start Reading Tuple of Variables Used in Nested Functions
    process.stdout.write(prefix + 'cellvars:');
    out = readTuple(bytecode, ptr + 1, level);
    ptr = out[0];
    obj.cellvars = out[1];

    // Read Filename
    console.log(prefix + 'filename:');
    type = bytecode.toString('ascii', ptr, ptr + 1);
    if (type in readByType) {
        out = readByType[type](bytecode, ptr + 1, level);
        ptr = out[0];
        obj.filename = out[1];
    } else {
        ptr = ptr + 1;
    }

    // Read Function Name
    console.log(prefix + 'name:');
    type = bytecode.toString('ascii', ptr, ptr + 1);
    if (type in readByType) {
        out = readByType[type](bytecode, ptr + 1, level);
        ptr = out[0];
        obj.name = out[1];
    } else {
        ptr = ptr + 1;
    }

    // Read First Line Number
    console.log(prefix + 'firstlineno:');
    out = readByType['i'](bytecode, ptr, level);
    ptr = out[0];
    obj.firstlineno = out[1];

    // Read Line Number Tab: http://nedbatchelder.com/blog/200804/wicked_hack_python_bytecode_tracing.html
    obj.lnotab = [];
    ptr = ptr + 1; // Skipping the 's' byte
    var npairs = bytecode.readUInt32LE(ptr) / 2;
    ptr = ptr + 4;
    console.log(prefix + 'lnotab: (' + String(npairs) + ')');
    for (var j = 0; j < npairs; j++) {
        var byteDelta = bytecode.readUInt8(ptr);
        ptr = ptr + 1;
        var lineDelta = bytecode.readUInt8(ptr);
        ptr = ptr + 1;
        console.log(prefix + '('.concat(String(byteDelta), ',', String(lineDelta), ')'));
        obj.lnotab.push([byteDelta, lineDelta]);
    }

    return [ptr, obj];
}

// Implemented bytecode functions in a CodeObject class
var CodeObject = (function () {
    function CodeObject() {
        this.argcount = undefined;
        this.nlocals = undefined;
        this.stacksize = undefined;
        this.flags = undefined;
        this.code = undefined;
        this.consts = undefined;
        this.names = undefined;
        this.varnames = undefined;
        this.freevars = undefined;
        this.cellvars = undefined;
        this.filename = undefined;
        this.name = undefined;
        this.firstlineno = undefined;
        this.lnotab = undefined;
        this.returnedValue = undefined;
        this.pc = 0;
    }
    CodeObject.prototype.STOP_CODE = function () {
        //do nothing
        this.pc += 1;
    };
    CodeObject.prototype.POP_TOP = function () {
        return Stack.pop();
    };
    CodeObject.prototype.ROT_TWO = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS1);
        this.pc += 1;
    };
    CodeObject.prototype.ROT_THREE = function () {
        var TOS = Stack.pop();
        var TOS2 = Stack.pop();
        var TOS3 = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS3);
        Stack.push(TOS2);
        this.pc += 1;
    };
    CodeObject.prototype.DUP_TOP = function () {
        var TOS = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS);
        this.pc += 1;
    };
    CodeObject.prototype.ROT_FOUR = function () {
        var TOS = Stack.pop();
        var TOS2 = Stack.pop();
        var TOS3 = Stack.pop();
        var TOS4 = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS4);
        Stack.push(TOS3);
        Stack.push(TOS2);
        this.pc += 1;
    };
    CodeObject.prototype.NOP = function () {
        this.pc += 1;
    };
    CodeObject.prototype.UNARY_POSITIVE = function () {
        var TOS = Stack.pop();
        TOS = +TOS;
        Stack.push(TOS);
        this.pc += 1;
    };
    CodeObject.prototype.UNARY_NEGATIVE = function () {
        var TOS = Stack.pop();
        TOS = -TOS;
        Stack.push(TOS);
        this.pc += 1;
    };
    CodeObject.prototype.UNARY_NOT = function () {
        var TOS = Stack.pop();
        TOS = !TOS;
        Stack.push(TOS);
        this.pc += 1;
    };
    CodeObject.prototype.UNARY_CONVERT = function () {
        var TOS = Stack.pop();
        TOS = String(TOS); // Not completely accurate
        Stack.push(TOS);
        this.pc += 1;
    };
    CodeObject.prototype.UNARY_INVERT = function () {
        var TOS = Stack.pop();
        TOS = ~TOS;
        Stack.push(TOS);
        this.pc += 1;
    };
    CodeObject.prototype.BINARY_POWER = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        TOS = Math.pow(TOS1, TOS);
        Stack.push(TOS);
        this.pc += 1;
    };

    //implements TOS = TOS1 * TOS
    CodeObject.prototype.BINARY_MULTIPLY = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 * TOS);
        this.pc += 1;
    };

    //implements TOS = TOS1/TOS (without from_future_import division)
    CodeObject.prototype.BINARY_DIVIDE = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();

        //*** need to make this so floors ints & longs but gives approx with floats or complex ***/
        Stack.push(TOS1 / TOS);
        this.pc += 1;
    };

    //implements TOS = TOS1 % TOS
    CodeObject.prototype.BINARY_MODULO = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 % TOS);
        this.pc += 1;
    };

    //implemsnts TOS = TOS1 + TOS
    CodeObject.prototype.BINARY_ADD = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 + TOS);
        this.pc += 1;
    };

    //implements TOS = TOS1 - TOS
    CodeObject.prototype.BINARY_SUBTRACT = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 - TOS);
        this.pc += 1;
    };

    //implements TOS = TOS1[TOS]
    CodeObject.prototype.BINARY_SUBSCR = function () {
        this.pc += 1;
    };

    //implements TOS = TOS1 // TOS
    CodeObject.prototype.BINARY_FLOOR_DIVIDE = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(Math.floor(TOS1 / TOS));
        this.pc += 1;
    };

    //implements TOS = TOS1/TOS (with from_future_import division)
    CodeObject.prototype.BINARY_TRUE_DIVIDE = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 / TOS);
        this.pc += 1;
    };

    //DIFFERENCE OF THESE FROM BINARY?
    CodeObject.prototype.INPLACE_FLOOR_DIVIDE = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(Math.floor(TOS1 / TOS));
        this.pc += 1;
    };

    //with from_future_import division
    CodeObject.prototype.INPLACE_TRUE_DIVIDE = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 / TOS);
        this.pc += 1;
    };
    CodeObject.prototype.SLICE_0 = function () {
        this.pc += 1;
    };
    CodeObject.prototype.SLICE_1 = function () {
    };
    CodeObject.prototype.SLICE_2 = function () {
    };
    CodeObject.prototype.SLICE_3 = function () {
    };
    CodeObject.prototype.STORE_SLICE_0 = function () {
        this.pc += 1;
    };
    CodeObject.prototype.STORE_SLICE_1 = function () {
    };
    CodeObject.prototype.STORE_SLICE_2 = function () {
    };
    CodeObject.prototype.STORE_SLICE_3 = function () {
    };
    CodeObject.prototype.DELETE_SLICE_0 = function () {
        this.pc += 1;
    };
    CodeObject.prototype.DELETE_SLICE_1 = function () {
    };
    CodeObject.prototype.DELETE_SLICE_2 = function () {
    };
    CodeObject.prototype.DELETE_SLICE_3 = function () {
    };
    CodeObject.prototype.STORE_MAP = function () {
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_ADD = function () {
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_SUBTRACT = function () {
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_MULTIPY = function () {
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_DIVIDE = function () {
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_MODULO = function () {
        this.pc += 1;
    };
    CodeObject.prototype.STORE_SUBSCR = function () {
        this.pc += 1;
    };
    CodeObject.prototype.DELETE_SUBSCR = function () {
        this.pc += 1;
    };
    CodeObject.prototype.BINARY_LSHIFT = function () {
        this.pc += 1;
    };
    CodeObject.prototype.BINARY_RSHIFT = function () {
        this.pc += 1;
    };
    CodeObject.prototype.BINARY_AND = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push((TOS1 && TOS));
        this.pc += 1;
    };
    CodeObject.prototype.BINARY_XOR = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push((TOS1 ? 1 : 0) ^ (TOS ? 1 : 0));
        this.pc += 1;
    };
    CodeObject.prototype.BINARY_OR = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push((TOS1 || TOS));
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_POWER = function () {
        this.pc += 1;
    };
    CodeObject.prototype.GET_ITER = function () {
        // Objects already iterable?
        this.pc += 1;
    };
    CodeObject.prototype.PRINT_EXPR = function () {
        this.pc += 1;
    };
    CodeObject.prototype.PRINT_ITEM = function () {
        var TOS = Stack.pop();
        console.log('LOGGED TO CONSOLE: --------------------- ' + TOS);
        this.pc += 1;
    };
    CodeObject.prototype.PRINT_NEWLINE = function () {
        console.log('LOGGED TO CONSOLE: --------------------- '); // or process.stdout.write('\n');
        this.pc += 1;
    };
    CodeObject.prototype.PRINT_ITEM_TO = function () {
        this.pc += 1;
    };
    CodeObject.prototype.PRINT_NEWLINE_TO = function () {
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_LSHIFT = function () {
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_RSHIFT = function () {
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_AND = function () {
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_XOR = function () {
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_OR = function () {
        this.pc += 1;
    };
    CodeObject.prototype.BREAK_LOOP = function () {
        this.pc += 1;
    };
    CodeObject.prototype.WITH_CLEANUP = function () {
        this.pc += 1;
    };
    CodeObject.prototype.LOAD_LOCALS = function () {
        this.pc += 1;
    };

    // Returns TOS to the caller function
    CodeObject.prototype.RETURN_VALUE = function () {
        this.returnedValue = Stack.pop();
        this.pc += 1;
    };

    // Implements 'from module import *'
    CodeObject.prototype.IMPORT_STAR = function () {
        this.pc += 1;
    };
    CodeObject.prototype.EXEC_STMT = function () {
        this.pc += 1;
    };
    CodeObject.prototype.YIELD_VALUE = function () {
        this.pc += 1;
    };
    CodeObject.prototype.POP_BLOCK = function () {
        this.pc += 1;
    };
    CodeObject.prototype.END_FINALLY = function () {
        this.pc += 1;
    };

    // Creates a new class object
    CodeObject.prototype.BUILD_CLASS = function () {
        //methods dictionary
        var TOS = Stack.pop();

        //tuple lf the names for base classes
        var TOS1 = Stack.pop();

        //the class name
        var TOS2 = Stack.pop();
        this.pc += 1;
    };

    // Opcodes from here have an argument
    CodeObject.prototype.STORE_NAME = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var name = Stack.pop();
        this.names[index] = name;
        this.pc += 3;
    };
    CodeObject.prototype.DELETE_NAME = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.names[index] = null;
        this.pc += 3;
    };
    CodeObject.prototype.UNPACK_SEQUENCE = function () {
        var numItems = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();
        for (var i = numItems - 1; i >= 0; i--) {
            Stack.push(TOS[i]);
        }
        this.pc += 3;
    };
    CodeObject.prototype.FOR_ITER = function () {
        var incrCounter = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();
        var newVal = TOS.next();
        Stack.push(TOS);
        Stack.push(newVal);
        this.pc += 3;
    };
    CodeObject.prototype.LIST_APPEND = function () {
        var value = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.STORE_ATTR = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.DELETE_ATTR = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.STORE_GLOBAL = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.DELETE_GLOBAL = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.DUP_TOPX = function () {
        var numItemsDup = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.LOAD_CONST = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        Stack.push(this.consts[index]);
        this.pc += 3;
    };
    CodeObject.prototype.LOAD_NAME = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        Stack.push(this.names[index]);
        this.pc += 3;
    };
    CodeObject.prototype.BUILD_TUPLE = function () {
        var numItems = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.BUILD_LIST = function () {
        var numItems = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.BUILD_SET = function () {
        var numItems = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.BUILD_MAP = function () {
        var numnumEntries = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.LOAD_ATTR = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.COMPARE_OP = function () {
        var opname = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.IMPORT_NAME = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.IMPORT_FROM = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.JUMP_FORWARD = function () {
        var delta = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += delta + 3;
    };
    CodeObject.prototype.JUMP_IF_FALSE_OR_POP = function () {
        var target = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();
        if (!TOS) {
            this.pc = target;
            Stack.push(TOS);
        } else {
            this.pc += 3;
        }
    };
    CodeObject.prototype.JUMP_IF_TRUE_OR_POP = function () {
        var target = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();
        if (TOS) {
            this.pc = target;
            Stack.push(TOS);
        } else {
            this.pc += 3;
        }
    };
    CodeObject.prototype.JUMP_ABSOLUTE = function () {
        var target = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc = target;
    };
    CodeObject.prototype.POP_JUMP_IF_FALSE = function () {
        var target = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();
        if (!TOS) {
            this.pc = target;
        } else {
            this.pc += 3;
        }
    };
    CodeObject.prototype.POP_JUMP_IF_TRUE = function () {
        var target = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();
        console.log(TOS);
        if (TOS) {
            this.pc = target;
        } else {
            this.pc += 3;
        }
    };
    CodeObject.prototype.LOAD_GLOBAL = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.CONTINUE_LOOP = function () {
        //start of loop(absolute)
        var start = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.SETUP_LOOP = function () {
        //target address(relative)
        var addr = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.SETUP_EXCEPT = function () {
        //target address(relative)
        var addr = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.SETUP_FINALLY = function () {
        //target address(relative)
        var addr = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.LOAD_FAST = function () {
        //local variable number
        var varNum = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        Stack.push(this.varnames[varNum]);
        this.pc += 3;
    };
    CodeObject.prototype.STORE_FAST = function () {
        var varNum = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.varnames[varNum] = Stack.pop();
        this.pc += 3;
    };
    CodeObject.prototype.DELETE_FAST = function () {
        var varNum = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.RAISE_VARARGS = function () {
        //number of raise arguments(1,2 or 3)
        var numArg = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };

    /* CALL_FUNCTION_XXX opcodes defined below depend on this definition */
    CodeObject.prototype.CALL_FUNCTION = function () {
        // Parse Operand Bytecode
        // argc is the operand from the bytecode (low bit = number of positional args, high bit = number of keyword args)
        var numArgs = this.code[this.pc + 1];
        var numKwargs = this.code[this.pc + 2];

        // Retrieve arguments from Stack and add to varnames
        var args = [];
        var kwargs = [];
        for (var i = 0; i < numKwargs; i++) {
            var val = Stack.pop();
            kwargs[i] = [Stack.pop(), val];
        }
        for (i = 0; i < numArgs; i++) {
            args[numArgs - 1 - i] = Stack.pop();
        }
        var function_object = Stack.pop();

        // Replace function object's variable names with arguments from Stack & default arguments
        var varnamesOriginal = function_object.func_code.varnames.slice(0);
        function_object.func_code.varnames = [];
        var argcount = function_object.func_code.argcount;

        for (var i = 0; i < numKwargs; i++) {
            function_object.func_code.varnames[kwargs[i][0]] = kwargs[i][1];
        }

        //Fill up remaining variable names using the positional arguments
        var counter = 0;
        for (i = 0; i < argcount; i++) {
            if ((function_object.func_code.varnames[i] == undefined) && (counter < args.length)) {
                function_object.func_code.varnames[i] = args[counter];
                counter += 1;
            }
        }

        // Get default values for any unspecified variable left
        counter = function_object.func_defaults.length;
        for (i = argcount; i >= 0; i--) {
            if (function_object.func_code.varnames[i - 1] == undefined) {
                function_object.func_code.varnames[i - 1] = function_object.func_defaults[counter - 1];
                counter -= 1;
            }
        }

        while (function_object.func_code.pc < function_object.func_code.code.length) {
            //op code
            var opcode = function_object.func_code.code[function_object.func_code.pc];

            // call opcode
            console.log(OpCodeList[opcode]);
            function_object.func_code[OpCodeList[opcode]]();
            console.log(Stack);
        }

        // Reset varnames
        function_object.func_code.varnames = varnamesOriginal.slice(0);

        // Push the return value onto the stack (could be a None? value)
        Stack.push(function_object.func_code.returnedValue);

        // Reset function object's counter
        function_object.func_code.pc = 0;

        // Increment parent's program counter
        this.pc += 3;
    };
    CodeObject.prototype.MAKE_FUNCTION = function () {
        //number of defaults found below TOS
        var argc = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var code_object = Stack.pop();
        var defaults = [];
        for (var i = 0; i < argc; i++) {
            defaults[i] = Stack.pop();
        }
        var newFunction = new FunctionObject(code_object, defaults);
        Stack.push(newFunction);
        this.pc += 3;
    };
    CodeObject.prototype.BUILD_SLICE = function () {
        var numItems = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.MAKE_CLOSURE = function () {
        var numFreeVars = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.LOAD_CLOSURE = function () {
        //load free variable from closure
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.LOAD_DEREF = function () {
        //load and deference from closure cell
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };

    //Stores TOS into the cell contained in slot i of the cell and free variable storage.
    CodeObject.prototype.STORE_DEREF = function () {
        //store into cell
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();
        this.cellvars[index] = TOS;
        this.freevars[index] = TOS;
        this.pc += 3;
    };

    /* The next 3 opcodes must be contiguous and satisfy
    (CALL_FUNCTION_VAR - CALL_FUNCTION) & 3 == 1  */
    CodeObject.prototype.CALL_FUNCTION_VAR = function () {
        //number args + (number kwargs<<8)
        var argc = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.CALL_FUNCTION_KW = function () {
        //number args + (number kwargs<<8)
        var argc = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.CALL_FUNCTION_VAR_KW = function () {
        //number args + (number kwargs<<8)
        var argc = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };

    CodeObject.prototype.SETUP_WITH = function () {
        var delta = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };

    /* Support for opargs more than 16 bits long */
    CodeObject.prototype.EXTENDED_ARG = function () {
        var ext = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };

    /***** have to determine what type of arguments these take *****/
    CodeObject.prototype.SET_ADD = function () {
        this.pc += 3;
    };
    CodeObject.prototype.MAP_ADD = function () {
        this.pc += 3;
    };
    return CodeObject;
})();

// Defines class for a function object
var FunctionObject = (function () {
    function FunctionObject(code_object, defaults) {
        this.func_code = code_object;
        this.func_defaults = defaults;
    }
    return FunctionObject;
})();

/** Parses given bytecode object whose first 8 bytes are expected to be
the magic number(Python verison) and a timestamp for the file **/
function parseBytecode(bytecode) {
    var len = bytecode.length;

    var magic_number = '';
    for (var j = 0; j < 4; j++) {
        magic_number = magic_number + String(bytecode.readUInt8(j));
    }
    console.log('magic number: ' + magic_number);
    byteObject.magic_number = magic_number;

    var time_stamp = '';
    for (j = 4; j < 8; j++) {
        time_stamp = time_stamp + String(bytecode.readUInt8(j));
    }
    console.log('time stamp: ' + time_stamp);
    byteObject.time_stamp = time_stamp;

    // Check Magic Number Against Python 2.7 (03f3 0d0a)
    var my_version = '32431310';
    for (var j = 0; j < 4; j++) {
        if (magic_number[j] != my_version[j]) {
            console.log('Not right version!');
            return false;
        }
    }

    // Initialize Interned List
    byteObject.interned_list = [];

    // Start Parsing Bytecode by type
    var ptr = 8;
    while (ptr < len) {
        var type = bytecode.toString('ascii', ptr, ptr + 1);
        if (type in readByType) {
            var out = readByType[type](bytecode, ptr + 1, 1);
            ptr = out[0];
            byteObject.code_object = out[1];
        } else {
            ptr = ptr + 1;
        }
    }

    return true;
}

// Function to execute the op code commands in code object
function execBytecode() {
    while (byteObject.code_object.pc < byteObject.code_object.code.length) {
        // Retrieve only the op code
        var opcode = byteObject.code_object.code[byteObject.code_object.pc];
        console.log(OpCodeList[opcode]);
        byteObject.code_object[OpCodeList[opcode]]();
        console.log(Stack);
    }
}

// First function called to parse and exectute bytecode
function interpretBytecode(bytecode) {
    // Parse Bytecode and Return Op Codes:
    if (parseBytecode(bytecode)) {
        console.log(byteObject.interned_list);

        // Execute the initial opcodes in the code object
        execBytecode();
    }
}

// Initalize the stack object
var Stack = [];

// Initalize object to store information of various types
var byteObject = {};

// Dictionary of potential types to be read
var readByType = {};
readByType['0'] = readNull;
readByType['N'] = readNone;
readByType['F'] = readFalse;
readByType['T'] = readTrue;
readByType['S'] = readStopIter;
readByType['.'] = readEllipsis;
readByType['i'] = readInt32;
readByType['I'] = readInt64;
readByType['f'] = readFloat32;
readByType['g'] = readFloat64;
readByType['x'] = readComplex32;
readByType['y'] = readComplex64;
readByType['l'] = readLong;
readByType['s'] = readString;
readByType['t'] = readStringInterned;
readByType['R'] = readStringRef;
readByType['u'] = readUnicode;
readByType['('] = readTuple;
readByType['['] = readTuple;
readByType['{'] = readDict;
readByType['>'] = readTuple;
readByType['c'] = readCodeObject;

// Enum list of all opcodes
var OpCodeList;
(function (OpCodeList) {
    OpCodeList[OpCodeList["STOP_CODE"] = 0] = "STOP_CODE";
    OpCodeList[OpCodeList["POP_TOP"] = 1] = "POP_TOP";
    OpCodeList[OpCodeList["ROT_TWO"] = 2] = "ROT_TWO";
    OpCodeList[OpCodeList["ROT_THREE"] = 3] = "ROT_THREE";
    OpCodeList[OpCodeList["DUP_TOP"] = 4] = "DUP_TOP";
    OpCodeList[OpCodeList["ROT_FOUR"] = 5] = "ROT_FOUR";
    OpCodeList[OpCodeList["NOP"] = 9] = "NOP";
    OpCodeList[OpCodeList["UNARY_POSITIVE"] = 10] = "UNARY_POSITIVE";
    OpCodeList[OpCodeList["UNARY_NEGATIVE"] = 11] = "UNARY_NEGATIVE";
    OpCodeList[OpCodeList["UNARY_NOT"] = 12] = "UNARY_NOT";
    OpCodeList[OpCodeList["UNARY_CONVERT"] = 13] = "UNARY_CONVERT";
    OpCodeList[OpCodeList["UNARY_INVERT"] = 15] = "UNARY_INVERT";
    OpCodeList[OpCodeList["BINARY_POWER"] = 19] = "BINARY_POWER";
    OpCodeList[OpCodeList["BINARY_MULTIPLY"] = 20] = "BINARY_MULTIPLY";
    OpCodeList[OpCodeList["BINARY_DIVIDE"] = 21] = "BINARY_DIVIDE";
    OpCodeList[OpCodeList["BINARY_MODULO"] = 22] = "BINARY_MODULO";
    OpCodeList[OpCodeList["BINARY_ADD"] = 23] = "BINARY_ADD";
    OpCodeList[OpCodeList["BINARY_SUBTRACT"] = 24] = "BINARY_SUBTRACT";
    OpCodeList[OpCodeList["BINARY_SUBSCR"] = 25] = "BINARY_SUBSCR";
    OpCodeList[OpCodeList["BINARY_FLOOR_DIVIDE"] = 26] = "BINARY_FLOOR_DIVIDE";
    OpCodeList[OpCodeList["BINARY_TRUE_DIVIDE"] = 27] = "BINARY_TRUE_DIVIDE";
    OpCodeList[OpCodeList["INPLACE_FLOOR_DIVIDE"] = 28] = "INPLACE_FLOOR_DIVIDE";
    OpCodeList[OpCodeList["INPLACE_TRUE_DIVIDE"] = 29] = "INPLACE_TRUE_DIVIDE";
    OpCodeList[OpCodeList["SLICE_0"] = 30] = "SLICE_0";
    OpCodeList[OpCodeList["SLICE_1"] = 31] = "SLICE_1";
    OpCodeList[OpCodeList["SLICE_2"] = 32] = "SLICE_2";
    OpCodeList[OpCodeList["SLICE_3"] = 33] = "SLICE_3";
    OpCodeList[OpCodeList["STORE_SLICE_0"] = 40] = "STORE_SLICE_0";
    OpCodeList[OpCodeList["STORE_SLICE_1"] = 41] = "STORE_SLICE_1";
    OpCodeList[OpCodeList["STORE_SLICE_2"] = 42] = "STORE_SLICE_2";
    OpCodeList[OpCodeList["STORE_SLICE_3"] = 43] = "STORE_SLICE_3";
    OpCodeList[OpCodeList["DELETE_SLICE_0"] = 50] = "DELETE_SLICE_0";
    OpCodeList[OpCodeList["DELETE_SLICE_1"] = 51] = "DELETE_SLICE_1";
    OpCodeList[OpCodeList["DELETE_SLICE_2"] = 52] = "DELETE_SLICE_2";
    OpCodeList[OpCodeList["DELETE_SLICE_3"] = 53] = "DELETE_SLICE_3";
    OpCodeList[OpCodeList["STORE_MAP"] = 54] = "STORE_MAP";
    OpCodeList[OpCodeList["INPLACE_ADD"] = 55] = "INPLACE_ADD";
    OpCodeList[OpCodeList["INPLACE_SUBTRACT"] = 56] = "INPLACE_SUBTRACT";
    OpCodeList[OpCodeList["INPLACE_MULTIPY"] = 57] = "INPLACE_MULTIPY";
    OpCodeList[OpCodeList["INPLACE_DIVIDE"] = 58] = "INPLACE_DIVIDE";
    OpCodeList[OpCodeList["INPLACE_MODULO"] = 59] = "INPLACE_MODULO";
    OpCodeList[OpCodeList["STORE_SUBSCR"] = 60] = "STORE_SUBSCR";
    OpCodeList[OpCodeList["DELETE_SUBSCR"] = 61] = "DELETE_SUBSCR";
    OpCodeList[OpCodeList["BINARY_LSHIFT"] = 62] = "BINARY_LSHIFT";
    OpCodeList[OpCodeList["BINARY_RSHIFT"] = 63] = "BINARY_RSHIFT";
    OpCodeList[OpCodeList["BINARY_AND"] = 64] = "BINARY_AND";
    OpCodeList[OpCodeList["BINARY_XOR"] = 65] = "BINARY_XOR";
    OpCodeList[OpCodeList["BINARY_OR"] = 66] = "BINARY_OR";
    OpCodeList[OpCodeList["INPLACE_POWER"] = 67] = "INPLACE_POWER";
    OpCodeList[OpCodeList["GET_ITER"] = 68] = "GET_ITER";
    OpCodeList[OpCodeList["PRINT_EXPR"] = 70] = "PRINT_EXPR";
    OpCodeList[OpCodeList["PRINT_ITEM"] = 71] = "PRINT_ITEM";
    OpCodeList[OpCodeList["PRINT_NEWLINE"] = 72] = "PRINT_NEWLINE";
    OpCodeList[OpCodeList["RINT_ITEM_TO"] = 73] = "RINT_ITEM_TO";
    OpCodeList[OpCodeList["PRINT_NEWLINE_TO"] = 74] = "PRINT_NEWLINE_TO";
    OpCodeList[OpCodeList["INPLACE_LSHIFT"] = 75] = "INPLACE_LSHIFT";
    OpCodeList[OpCodeList["INPLACE_RSHIFT"] = 76] = "INPLACE_RSHIFT";
    OpCodeList[OpCodeList["INPLACE_AND"] = 77] = "INPLACE_AND";
    OpCodeList[OpCodeList["INPLACE_XOR"] = 78] = "INPLACE_XOR";
    OpCodeList[OpCodeList["INPLACE_OR"] = 79] = "INPLACE_OR";
    OpCodeList[OpCodeList["BREAK_LOOP"] = 80] = "BREAK_LOOP";
    OpCodeList[OpCodeList["WITH_CLEANUP"] = 81] = "WITH_CLEANUP";
    OpCodeList[OpCodeList["LOAD_LOCALS"] = 82] = "LOAD_LOCALS";
    OpCodeList[OpCodeList["RETURN_VALUE"] = 83] = "RETURN_VALUE";
    OpCodeList[OpCodeList["IMPORT_STAR"] = 84] = "IMPORT_STAR";
    OpCodeList[OpCodeList["EXEC_STMT"] = 85] = "EXEC_STMT";
    OpCodeList[OpCodeList["YIELD_VALUE"] = 86] = "YIELD_VALUE";
    OpCodeList[OpCodeList["POP_BLOCK"] = 87] = "POP_BLOCK";
    OpCodeList[OpCodeList["END_FINALLY"] = 88] = "END_FINALLY";
    OpCodeList[OpCodeList["BUILD_CLASS"] = 89] = "BUILD_CLASS";

    //Opcodes from here have an argument HAVE_ARGUMENT 90
    OpCodeList[OpCodeList["STORE_NAME"] = 90] = "STORE_NAME";
    OpCodeList[OpCodeList["DELETE_NAME"] = 91] = "DELETE_NAME";
    OpCodeList[OpCodeList["UNPACK_SEQUENCE"] = 92] = "UNPACK_SEQUENCE";
    OpCodeList[OpCodeList["FOR_ITER"] = 93] = "FOR_ITER";
    OpCodeList[OpCodeList["LIST_APPEND"] = 94] = "LIST_APPEND";
    OpCodeList[OpCodeList["STORE_ATTR"] = 95] = "STORE_ATTR";
    OpCodeList[OpCodeList["DELETE_ATTR"] = 96] = "DELETE_ATTR";
    OpCodeList[OpCodeList["STORE_GLOBAL"] = 97] = "STORE_GLOBAL";
    OpCodeList[OpCodeList["DELETE_GLOBAL"] = 98] = "DELETE_GLOBAL";
    OpCodeList[OpCodeList["DUP_TOPX"] = 99] = "DUP_TOPX";
    OpCodeList[OpCodeList["LOAD_CONST"] = 100] = "LOAD_CONST";
    OpCodeList[OpCodeList["LOAD_NAME"] = 101] = "LOAD_NAME";
    OpCodeList[OpCodeList["BUILD_TUPLE"] = 102] = "BUILD_TUPLE";
    OpCodeList[OpCodeList["BUILD_LIST"] = 103] = "BUILD_LIST";
    OpCodeList[OpCodeList["BUILD_SET"] = 104] = "BUILD_SET";
    OpCodeList[OpCodeList["BUILD_MAP"] = 105] = "BUILD_MAP";
    OpCodeList[OpCodeList["LOAD_ATTR"] = 106] = "LOAD_ATTR";
    OpCodeList[OpCodeList["COMPARE_OP"] = 107] = "COMPARE_OP";
    OpCodeList[OpCodeList["IMPORT_NAME"] = 108] = "IMPORT_NAME";
    OpCodeList[OpCodeList["IMPORT_FROM"] = 109] = "IMPORT_FROM";
    OpCodeList[OpCodeList["JUMP_FORWARD"] = 110] = "JUMP_FORWARD";
    OpCodeList[OpCodeList["JUMP_IF_FALSE_OR_POP"] = 111] = "JUMP_IF_FALSE_OR_POP";
    OpCodeList[OpCodeList["JUMP_IF_TRUE_OR_POP"] = 112] = "JUMP_IF_TRUE_OR_POP";
    OpCodeList[OpCodeList["JUMP_ABSOLUTE"] = 113] = "JUMP_ABSOLUTE";
    OpCodeList[OpCodeList["POP_JUMP_IF_FALSE"] = 114] = "POP_JUMP_IF_FALSE";
    OpCodeList[OpCodeList["POP_JUMP_IF_TRUE"] = 115] = "POP_JUMP_IF_TRUE";
    OpCodeList[OpCodeList["LOAD_GLOBAL"] = 116] = "LOAD_GLOBAL";
    OpCodeList[OpCodeList["CONTINUE_LOOP"] = 119] = "CONTINUE_LOOP";
    OpCodeList[OpCodeList["SETUP_LOOP"] = 120] = "SETUP_LOOP";
    OpCodeList[OpCodeList["SETUP_EXCEPT"] = 121] = "SETUP_EXCEPT";
    OpCodeList[OpCodeList["SETUP_FINALLY"] = 122] = "SETUP_FINALLY";
    OpCodeList[OpCodeList["LOAD_FAST"] = 124] = "LOAD_FAST";
    OpCodeList[OpCodeList["STORE_FAST"] = 125] = "STORE_FAST";
    OpCodeList[OpCodeList["DELETE_FAST"] = 126] = "DELETE_FAST";
    OpCodeList[OpCodeList["RAISE_VARARGS"] = 130] = "RAISE_VARARGS";

    /* CALL_FUNCTION_XXX opcodes defined below depend on this definition */
    OpCodeList[OpCodeList["CALL_FUNCTION"] = 131] = "CALL_FUNCTION";
    OpCodeList[OpCodeList["MAKE_FUNCTION"] = 132] = "MAKE_FUNCTION";
    OpCodeList[OpCodeList["BUILD_SLICE"] = 133] = "BUILD_SLICE";
    OpCodeList[OpCodeList["MAKE_CLOSURE"] = 134] = "MAKE_CLOSURE";
    OpCodeList[OpCodeList["LOAD_CLOSURE"] = 135] = "LOAD_CLOSURE";
    OpCodeList[OpCodeList["LOAD_DEREF"] = 136] = "LOAD_DEREF";
    OpCodeList[OpCodeList["STORE_DEREF"] = 137] = "STORE_DEREF";

    /* The next 3 opcodes must be contiguous and satisfy
    (CALL_FUNCTION_VAR - CALL_FUNCTION) & 3 == 1  */
    OpCodeList[OpCodeList["CALL_FUNCTION_VAR"] = 140] = "CALL_FUNCTION_VAR";
    OpCodeList[OpCodeList["CALL_FUNCTION_KW"] = 141] = "CALL_FUNCTION_KW";
    OpCodeList[OpCodeList["CALL_FUNCTION_VAR_KW"] = 142] = "CALL_FUNCTION_VAR_KW";
    OpCodeList[OpCodeList["SETUP_WITH"] = 143] = "SETUP_WITH";

    /* Support for opargs more than 16 bits long */
    OpCodeList[OpCodeList["EXTENDED_ARG"] = 145] = "EXTENDED_ARG";
    OpCodeList[OpCodeList["SET_ADD"] = 146] = "SET_ADD";
    OpCodeList[OpCodeList["MAP_ADD"] = 147] = "MAP_ADD";
})(OpCodeList || (OpCodeList = {}));
;

// Main function to read in file
var fs = require('fs');
fs.readFile(process.argv[2], function doneReading(err, bytecode) {
    if (err)
        throw err;
    interpretBytecode(bytecode);
});

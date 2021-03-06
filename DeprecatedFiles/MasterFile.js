/// <reference path="node.d.ts" />
function readNull(bytecode, ptr, level) {
    printToOutput(Array(level).join('\t') + 'Null');
    var obj = null;
    return [ptr, obj];
}

function readNone(bytecode, ptr, level) {
    printToOutput(Array(level).join('\t') + 'None');
    var obj = null;
    return [ptr, obj];
}

function readFalse(bytecode, ptr, level) {
    printToOutput(Array(level).join('\t') + 'False');
    var obj = false;
    return [ptr, obj];
}

function readTrue(bytecode, ptr, level) {
    printToOutput(Array(level).join('\t') + 'True');
    var obj = true;
    return [ptr, obj];
}

function readStopIter(bytecode, ptr, level) {
    printToOutput(Array(level).join('\t') + 'StopIteration');
    var obj = 'StopIteration';
    return [ptr, obj];
}

function readEllipsis(bytecode, ptr, level) {
    printToOutput(Array(level).join('\t') + 'Ellipsis');
    var obj = 'Ellipsis';
    return [ptr, obj];
}

function readInt32(bytecode, ptr, level) {
    var obj = bytecode.readInt32LE(ptr);
    printToOutput(Array(level).join('\t') + obj);
    return [ptr + 4, obj];
}

function readInt64(bytecode, ptr, level) {
    printToOutput('Int64 Not implemented yet!');
    var obj = 'Int64 Not implemented yet!';
    return [ptr + 8, obj];
}

function readFloat32(bytecode, ptr, level) {
    var obj = bytecode.readFloatLE(ptr);
    printToOutput(Array(level).join('\t') + obj);
    return [ptr + 4, obj];
}

function readFloat64(bytecode, ptr, level) {
    var obj = bytecode.readDoubleLE(ptr);
    printToOutput(Array(level).join('\t') + obj);
    return [ptr + 8, obj];
}

var Complex = (function () {
    function Complex(real, imag) {
        this.real = real;
        this.imag = imag;
    }
    return Complex;
})();

function readComplex32(bytecode, ptr, level) {
    var real = bytecode.readFloatLE(ptr);
    var imag = bytecode.readFloatLE(ptr + 4);
    printToOutput('complex32');
    printToOutput('real=' + real);
    printToOutput('imag=' + imag);
    var obj = new Complex(real, imag);
    return [ptr + 8, obj];
}

function readComplex64(bytecode, ptr, level) {
    var real = bytecode.readDoubleLE(ptr);
    var imag = bytecode.readDoubleLE(ptr + 8);
    printToOutput('complex64');
    printToOutput('real=' + real);
    printToOutput('imag=' + imag);
    var obj = new Complex(real, imag);
    return [ptr + 16, obj];
}

function readLong(bytecode, ptr, level) {
    printToOutput('Long Not implemented yet!');
    var obj = 'Long Not implemented yet!';
    return [ptr + 4, obj];
}

function readString(bytecode, ptr, level) {
    var obj = '';
    var size = bytecode.readUInt32LE(ptr);
    for (var j = 0; j < size; j++) {
        obj = obj + bytecode.toString('ascii', ptr + 4 + j, ptr + 4 + j + 1);
    }
    printToOutput(Array(level).join('\t') + obj);
    return [ptr + 4 + size, obj];
}

function readStringInterned(bytecode, ptr, level) {
    var obj = '';
    var size = bytecode.readUInt32LE(ptr);
    for (var j = 0; j < size; j++) {
        obj = obj + bytecode.toString('ascii', ptr + 4 + j, ptr + 4 + j + 1);
    }
    printToOutput(Array(level).join('\t') + '(interned)' + obj);
    byteObject.interned_list.push(obj);
    return [ptr + 4 + size, obj];
}

function readStringRef(bytecode, ptr, level) {
    var index = bytecode.readUInt32LE(ptr);
    var obj = new internedString(index);
    printToOutput(Array(level).join('\t') + 'ref to interned string in position ' + obj.index);
    return [ptr + 4, obj];
}

function readUnicode(bytecode, ptr, level) {
    var obj = '';
    var size = bytecode.readUInt32LE(ptr);
    for (var j = 0; j < size; j++) {
        obj = obj + bytecode.toString('utf8', ptr + 4 + j, ptr + 4 + j + 1);
    }
    printToOutput(Array(level).join('\t') + obj);
    return [ptr + 4 + size, obj];
}

function readDict(bytecode, ptr, level) {
    var obj = {};
    var prefix = Array(level).join('\t');
    level = level + 1;
    var key_type = bytecode.toString('ascii', ptr, ptr + 1);
    var out = readByType[key_type](bytecode, ptr + 1, level);
    ptr = out[0];
    var key = out[1];
    while (key != null) {
        var val_type = bytecode.toString('ascii', ptr, ptr + 1);
        var out = readByType[val_type](bytecode, ptr + 1, level);
        ptr = out[0];
        var val = out[1];
        obj[key] = val;
        var key_type = bytecode.toString('ascii', ptr, ptr + 1);
        var out = readByType[key_type](bytecode, ptr + 1, level);
        ptr = out[0];
        var key = out[1];
    }
    return [ptr, obj];
}

function readTuple(bytecode, ptr, level) {
    var obj = [];
    var prefix = Array(level).join('\t');
    var nobjs = bytecode.readUInt32LE(ptr);
    printToOutput(' (' + String(nobjs) + ')');
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
    printToOutput(Array(level).join('\t') + 'code object:');
    var obj = new CodeObject();
    var out = [];

    level = level + 1;
    var prefix = Array(level).join('\t');

    // Read Argcount
    obj.argcount = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;
    printToOutput(prefix + 'argcount:\n' + prefix + String(obj.argcount));

    // Read Nlocals
    obj.nlocals = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;
    printToOutput(prefix + 'nlocals:\n' + prefix + String(obj.nlocals));

    // Read Stacksize
    obj.stacksize = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;
    printToOutput(prefix + 'stacksize:\n' + prefix + String(obj.stacksize));

    // Read Flags
    obj.flags = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;
    printToOutput(prefix + 'flags:\n' + prefix + String(obj.flags));

    var type = bytecode.toString('ascii', ptr, ptr + 1);
    ptr = ptr + 1; // should be 's'
    var codelen = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;

    // Start Reading Op Codes
    obj.code = [];
    printToOutput(prefix + 'code: (' + String(codelen) + ')');
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
        printToOutput(prefix + logout);
    }

    // Start Reading Tuple of Constants
    printToOutput(prefix + 'consts:', true);
    out = readTuple(bytecode, ptr + 1, level);
    ptr = out[0];
    obj.consts = out[1];

    // Start Reading Tuple of Names
    printToOutput(prefix + 'names:', true);
    out = readTuple(bytecode, ptr + 1, level);
    ptr = out[0];
    obj.names = out[1];

    // Start Reading Tuple of Variable Names
    printToOutput(prefix + 'varnames:', true);
    out = readTuple(bytecode, ptr + 1, level);
    ptr = out[0];
    obj.varnames = out[1];

    // Start Reading Tuple of Free Variables
    printToOutput(prefix + 'freevars:', true);
    out = readTuple(bytecode, ptr + 1, level);
    ptr = out[0];
    obj.freevars = out[1];

    // Start Reading Tuple of Variables Used in Nested Functions
    printToOutput(prefix + 'cellvars:', true);
    out = readTuple(bytecode, ptr + 1, level);
    ptr = out[0];
    obj.cellvars = out[1];

    // Read Filename
    printToOutput(prefix + 'filename:');
    type = bytecode.toString('ascii', ptr, ptr + 1);
    if (type in readByType) {
        out = readByType[type](bytecode, ptr + 1, level);
        ptr = out[0];
        obj.filename = out[1];
    } else {
        ptr = ptr + 1;
    }

    // Read Function Name
    printToOutput(prefix + 'name:');
    type = bytecode.toString('ascii', ptr, ptr + 1);
    if (type in readByType) {
        out = readByType[type](bytecode, ptr + 1, level);
        ptr = out[0];
        obj.name = out[1];
    } else {
        ptr = ptr + 1;
    }

    // Read First Line Number
    printToOutput(prefix + 'firstlineno:');
    out = readByType['i'](bytecode, ptr, level);
    ptr = out[0];
    obj.firstlineno = out[1];

    // Read Line Number Tab: http://nedbatchelder.com/blog/200804/wicked_hack_python_bytecode_tracing.html
    obj.lnotab = [];
    ptr = ptr + 1; // Skipping the 's' byte
    var npairs = bytecode.readUInt32LE(ptr) / 2;
    ptr = ptr + 4;
    printToOutput(prefix + 'lnotab: (' + String(npairs) + ')');
    for (var j = 0; j < npairs; j++) {
        var byteDelta = bytecode.readUInt8(ptr);
        ptr = ptr + 1;
        var lineDelta = bytecode.readUInt8(ptr);
        ptr = ptr + 1;
        printToOutput(prefix + '('.concat(String(byteDelta), ',', String(lineDelta), ')'));
        obj.lnotab.push([byteDelta, lineDelta]);
    }

    return [ptr, obj];
}

var Block = (function () {
    function Block(delta, start) {
        this.delta = delta;
        this.start = start;
        this.end = start + delta - 1;
    }
    return Block;
})();

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
        this.self = {};
        this.BlockStack = [];
    }
    CodeObject.prototype.STOP_CODE = function () {
        //do nothing
        this.pc += 1;
    };
    CodeObject.prototype.POP_TOP = function () {
        Stack.pop();
        this.pc += 1;
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
        TOS = TOS.toString(); // Not completely accurate
        Stack.push(TOS);
        this.pc += 1;
    };
    CodeObject.prototype.UNARY_INVERT = function () {
        var TOS = Stack.pop();
        TOS = ~TOS; //python does not invert complex numbers
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
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1[TOS]);
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

    // Implements TOS[:] = TOS1
    CodeObject.prototype.SLICE_0 = function () {
        var TOS = Stack.pop();
        Stack.push(TOS.slice(0, TOS.length));
        this.pc += 1;
    };

    //Implements TOS1[TOS:] = TOS2
    CodeObject.prototype.SLICE_1 = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1.slice(TOS, TOS1.length));
        this.pc += 1;
    };
    CodeObject.prototype.SLICE_2 = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1.slice(0, TOS));
        this.pc += 1;
    };
    CodeObject.prototype.SLICE_3 = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        var TOS2 = Stack.pop();
        Stack.push(TOS2.slice(TOS1, TOS));
        this.pc += 1;
    };
    CodeObject.prototype.STORE_SLICE_0 = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        for (var i = 0; i < TOS.length; i++) {
            TOS[i] = TOS1[i];
        }
        Stack.push(TOS);
        this.pc += 1;
    };
    CodeObject.prototype.STORE_SLICE_1 = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        var TOS2 = Stack.pop();
        for (var i = TOS; i < TOS1.length; i++) {
            TOS1[i] = TOS2[i - TOS];
        }
        Stack.push(TOS1);
        this.pc += 1;
    };
    CodeObject.prototype.STORE_SLICE_2 = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        var TOS2 = Stack.pop();
        for (var i = 0; i < TOS; i++) {
            TOS1[i] = TOS2[i];
        }
        Stack.push(TOS1);
        this.pc += 1;
    };
    CodeObject.prototype.STORE_SLICE_3 = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        var TOS2 = Stack.pop();
        var TOS3 = Stack.pop();
        for (var i = TOS1; i < TOS; i++) {
            TOS2[i] = TOS3[i - TOS1];
        }
        Stack.push(TOS2);
        this.pc += 1;
    };
    CodeObject.prototype.DELETE_SLICE_0 = function () {
        var TOS = Stack.pop();
        TOS.splice(0, TOS.length);
        Stack.push(TOS);
        this.pc += 1;
    };
    CodeObject.prototype.DELETE_SLICE_1 = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        TOS1.splice(TOS, TOS1.length);
        Stack.push(TOS1);
        this.pc += 1;
    };
    CodeObject.prototype.DELETE_SLICE_2 = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        TOS1.splice(0, TOS);
        Stack.push(TOS1);
        this.pc += 1;
    };
    CodeObject.prototype.DELETE_SLICE_3 = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        var TOS2 = Stack.pop();
        TOS2.splice(TOS1, TOS);
        Stack.push(TOS2);
        this.pc += 1;
    };
    CodeObject.prototype.STORE_MAP = function () {
        var val = Stack.pop();
        var key = Stack.pop();
        var dic = Stack.pop();
        dic[key] = val;
        Stack.push(dic);
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_ADD = function () {
        Stack.push(Stack.pop() + Stack.pop());
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_SUBTRACT = function () {
        Stack.push(Stack.pop() - Stack.pop());
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_MULTIPY = function () {
        Stack.push(Stack.pop() * Stack.pop());
        this.pc += 1;
    };

    //without from_future_import division
    CodeObject.prototype.INPLACE_DIVIDE = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();

        //*** need to make this so floors ints & longs but gives approx with floats or complex ***/
        Stack.push(TOS1 / TOS);
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_MODULO = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 % TOS);
        this.pc += 1;
    };
    CodeObject.prototype.STORE_SUBSCR = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        var TOS2 = Stack.pop();
        TOS1[TOS] = TOS2;
        this.pc += 1;
    };
    CodeObject.prototype.DELETE_SUBSCR = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        delete TOS1[TOS];
        this.pc += 1;
    };
    CodeObject.prototype.BINARY_LSHIFT = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 << TOS);
        this.pc += 1;
    };
    CodeObject.prototype.BINARY_RSHIFT = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 >> TOS);
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
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        TOS = Math.pow(TOS1, TOS);
        Stack.push(TOS);
        this.pc += 1;
    };
    CodeObject.prototype.GET_ITER = function () {
        var TOS = Stack.pop();
        var TOS = TOS.iter();
        Stack.push(TOS);
        this.pc += 1;
    };
    CodeObject.prototype.PRINT_EXPR = function () {
        var TOS = Stack.pop();
        if (isVerbose) {
            printToOutput('LOGGED TO CONSOLE: --------------------- ' + TOS, false);
        } else {
            printToOutput(TOS, true, true);
        }
        this.pc += 1;
    };
    CodeObject.prototype.PRINT_ITEM = function () {
        var TOS = Stack.pop();
        if (TOS instanceof internedString) {
            TOS = byteObject.interned_list[TOS.index];
        }
        if (isVerbose) {
            printToOutput('LOGGED TO CONSOLE: --------------------- ' + TOS, false);
        } else {
            printToOutput(TOS, true, true);
        }
        this.pc += 1;
    };
    CodeObject.prototype.PRINT_NEWLINE = function () {
        if (isVerbose) {
            printToOutput('LOGGED TO CONSOLE: --------------------- ', false);
        } else {
            printToOutput('\n', true, true);
        }
        this.pc += 1;
    };
    CodeObject.prototype.PRINT_ITEM_TO = function () {
        if (isVerbose) {
            printToOutput('NOT WORKING - SHOULD PRINT TO FILE: --------------------- ', false);
        } else {
            printToOutput('<PRINT_ITEM_TO> NOT FUNCTIONAL', true, true);
        }
        this.pc += 1;
    };
    CodeObject.prototype.PRINT_NEWLINE_TO = function () {
        if (isVerbose) {
            printToOutput('NOT WORKING - SHOULD PRINT NEWLINE TO FILE: --------------------- ', false);
        } else {
            printToOutput('<PRINT_NEWLINE_TO> NOT FUNCTIONAL', true, true);
        }
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_LSHIFT = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 << TOS);
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_RSHIFT = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 >> TOS);
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_AND = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push((TOS1 && TOS));
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_XOR = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push((TOS1 ? 1 : 0) ^ (TOS ? 1 : 0));
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_OR = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push((TOS1 || TOS));
        this.pc += 1;
    };
    CodeObject.prototype.BREAK_LOOP = function () {
        //move the program to the end of the block by going ahead the size of the block
        var block = this.BlockStack.pop();
        this.pc = block.end;
        this.BlockStack.push(block);
    };
    CodeObject.prototype.WITH_CLEANUP = function () {
        this.pc += 1;
    };
    CodeObject.prototype.LOAD_LOCALS = function () {
        var locals = {};
        for (var i = 0; i < this.names.length; i++) {
            var name = this.names[i];
            if (typeof name === 'string') {
                locals[name] = null;
            } else if (name instanceof internedString) {
                locals[byteObject.interned_list[name.index]] = null;
            } else if (name instanceof FunctionObject) {
                locals[name.func_name] = name;
            } else
                printToOutput('problems with LOAD_LOCALS');
        }
        Stack.push(locals);
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
        this.BlockStack.pop();
        this.pc += 1;
    };
    CodeObject.prototype.END_FINALLY = function () {
        this.pc += 1;
    };

    // Creates a new class object
    CodeObject.prototype.BUILD_CLASS = function () {
        //methods dictionary
        var TOS = Stack.pop();

        //tuple of the names for base classes
        var TOS1 = Stack.pop();

        //the class name
        var TOS2 = Stack.pop();
        var newClass = new classObject(TOS2, TOS1, TOS);
        Stack.push(newClass);
        this.pc += 1;
    };

    /****** Opcodes from here have an argument obtained by accessing the byte code ******/
    CodeObject.prototype.STORE_NAME = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var name = Stack.pop();
        this.names[index] = name;
        this.pc += 3;
    };
    CodeObject.prototype.DELETE_NAME = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.names.splice(index, 1);
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

        //if(!(TOS instanceof Iterator)){
        //     if(TOS instanceof Array || TOS instanceof String){
        //         TOS = new Iterator(0, TOS.length);
        //     }else if(TOS instanceof Object){
        //         TOS = new Iterator(0, TOS.size);
        //     }
        // }
        var newVal = TOS.next();
        if (newVal != -1) {
            Stack.push(TOS);
            Stack.push(newVal);
            this.pc += 3;
        } else {
            this.pc += incrCounter + 3;
        }
    };
    CodeObject.prototype.LIST_APPEND = function () {
        var value = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];

        this.pc += 3;
    };
    CodeObject.prototype.STORE_ATTR = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        var attr = this.names[index];
        if (attr instanceof internedString) {
            attr = byteObject.interned_list[attr.index];
        }
        if (TOS == 'self') {
            this.self[attr] = TOS1;
        } else {
            TOS[attr] = TOS1;
        }
        this.pc += 3;
    };
    CodeObject.prototype.DELETE_ATTR = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();
        delete TOS[this.names[index]];
        this.pc += 3;
    };
    CodeObject.prototype.STORE_GLOBAL = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var name = Stack.pop();
        this.names[index] = name;
        this.pc += 3;
    };
    CodeObject.prototype.DELETE_GLOBAL = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.names.splice(index, 1);
        this.pc += 3;
    };
    CodeObject.prototype.DUP_TOPX = function () {
        var numItemsDup = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var dupItems = [];
        if (numItemsDup <= 5) {
            for (var i = 0; i < numItemsDup; i++) {
                dupItems[i] = Stack.pop();
            }
            for (i = numItemsDup; i >= 0; i--) {
                Stack.push(dupItems[i]);
                Stack.push(dupItems[i]);
            }
        } else {
            printToOutput('Warning: Number of items to duplicate is greater than 5.');
        }
        this.pc += 3;
    };
    CodeObject.prototype.LOAD_CONST = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        Stack.push(this.consts[index]);
        this.pc += 3;
    };
    CodeObject.prototype.LOAD_NAME = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var name = this.names[index];
        if (name instanceof internedString) {
            Stack.push(byteObject.interned_list[name.index]);
        } else {
            Stack.push(name);
        }
        this.pc += 3;
    };
    CodeObject.prototype.BUILD_TUPLE = function () {
        var numItems = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var tuple = [];
        for (var i = 0; i < numItems; i++) {
            tuple[i] = Stack.pop();
        }
        Stack.push(tuple);
        this.pc += 3;
    };
    CodeObject.prototype.BUILD_LIST = function () {
        var numItems = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var list = [];
        for (var i = 0; i < numItems; i++) {
            list[i] = Stack.pop();
        }
        Stack.push(list);
        this.pc += 3;
    };
    CodeObject.prototype.BUILD_SET = function () {
        var numItems = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.BUILD_MAP = function () {
        var numnumEntries = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        Stack.push({}); // ignoring num entries for now - javascript doesn't presize anything
        this.pc += 3;
    };
    CodeObject.prototype.LOAD_ATTR = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var attr = this.names[index];
        printToOutput('attr=' + attr);
        if (attr instanceof internedString) {
            attr = byteObject.interned_list[attr.index];
            printToOutput('interned version=' + attr);
        }
        var TOS = Stack.pop();
        printToOutput('TOS=' + TOS);
        if (TOS == 'self') {
            Stack.push(this.self[attr]);
        } else if (TOS instanceof classObject) {
            Stack.push(TOS.methods[attr]);
        } else {
            Stack.push(TOS[attr]);
        }
        this.pc += 3;
    };
    CodeObject.prototype.COMPARE_OP = function () {
        var opname = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var cmp_op = ['<', '<=', '==', '!=', '>', '>=', 'in', 'not in', 'is', 'is not', 'exception match', 'BAD'];
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        if (cmp_op[opname] == '<') {
            Stack.push(TOS1 < TOS);
        }
        if (cmp_op[opname] == '<=') {
            Stack.push(TOS1 <= TOS);
        }
        if (cmp_op[opname] == '==') {
            Stack.push(TOS1 == TOS);
        }
        if (cmp_op[opname] == '!=') {
            Stack.push(TOS1 != TOS);
        }
        if (cmp_op[opname] == '>') {
            Stack.push(TOS1 > TOS);
        }
        if (cmp_op[opname] == '<=') {
            Stack.push(TOS1 >= TOS);
        }
        if (cmp_op[opname] == 'in') {
            Stack.push(TOS1 in TOS);
        }
        if (cmp_op[opname] == 'not in') {
            Stack.push(!(TOS1 in TOS));
        }
        if (cmp_op[opname] == 'is') {
            Stack.push(TOS1 == TOS);
        }
        if (cmp_op[opname] == 'is not') {
            Stack.push(TOS1 != TOS);
        }
        if (cmp_op[opname] == 'exception match') {
            Stack.push(TOS1 == TOS);
        }
        if (cmp_op[opname] == 'BAD') {
            Stack.push(TOS1 == TOS);
        }
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
        printToOutput(TOS);
        if (TOS) {
            this.pc = target;
        } else {
            this.pc += 3;
        }
    };
    CodeObject.prototype.LOAD_GLOBAL = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        Stack.push(this.names[index]);
        this.pc += 3;
    };
    CodeObject.prototype.CONTINUE_LOOP = function () {
        //start of loop(absolute)
        var start = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc = start;
    };
    CodeObject.prototype.SETUP_LOOP = function () {
        //pushes block of size delta bytes
        var delta = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var start = this.pc + 3;
        var block = new Block(delta, start);
        this.BlockStack.push(block);
        this.pc += 3;
    };
    CodeObject.prototype.SETUP_EXCEPT = function () {
        //target address(relative)
        var delta = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var start = this.pc + 3;
        var block = new Block(delta, start);
        this.BlockStack.push(block);
        this.pc += 3;
    };
    CodeObject.prototype.SETUP_FINALLY = function () {
        //target address(relative)
        var delta = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var start = this.pc + 3;
        var block = new Block(delta, start);
        this.BlockStack.push(block);
        this.pc += 3;
    };
    CodeObject.prototype.LOAD_FAST = function () {
        //local variable number
        var varNum = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var item = this.varnames[varNum];
        if (item instanceof internedString) {
            Stack.push(byteObject.interned_list[item.index]);
        } else {
            Stack.push(item);
        }
        this.pc += 3;
    };
    CodeObject.prototype.STORE_FAST = function () {
        var varNum = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.varnames[varNum] = Stack.pop();
        this.pc += 3;
    };
    CodeObject.prototype.DELETE_FAST = function () {
        var varNum = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        delete this.varnames[varNum];
        this.pc += 3;
    };
    CodeObject.prototype.RAISE_VARARGS = function () {
        //number of raise arguments(1,2 or 3)
        var numArg = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var args = [];
        for (var i = 0; i < numArg; i++) {
            args[i] = Stack.pop();
        }
        if (numArg == 0) {
            throw 'Exception Error';
        }
        if (numArg == 1) {
            throw 'Exception Error: ' + args[0].toString();
        }
        if (numArg == 2) {
            throw 'Exception Error: ' + args[0].toString() + ', Parameters: ' + args[1].toString();
        }
        if (numArg == 3) {
            throw 'Exception Error: ' + args[0].toString() + ', Parameters: ' + args[1].toString() + ', Traceback: ' + args[2].toString();
        }
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
        var isClass = (function_object instanceof classObject);
        if (isClass) {
            var class_object = function_object;
            for (var methodKey in class_object.methods) {
                var method = class_object.methods[methodKey];
                if (method instanceof FunctionObject) {
                    method.func_code.self = class_object.self;
                }
            }
            function_object = class_object.methods['__init__'];
        }

        // Replace function object's variable names with arguments from Stack & default arguments
        var varnamesOriginal = function_object.func_code.varnames.slice(0);
        printToOutput(varnamesOriginal);
        function_object.func_code.varnames = [];
        var argcount = function_object.func_code.argcount;

        for (var i = 0; i < numKwargs; i++) {
            var key = kwargs[i][0];
            if (key instanceof internedString) {
                key = byteObject.interned_list[key.index];
            }
            printToOutput('key=' + key);

            // find key in varnames and set it equal to kwargs[i][1]
            var keyFound = false;
            for (var j = 0; j < varnamesOriginal.length; j++) {
                var varnamesKey = varnamesOriginal[j];
                if (varnamesKey instanceof internedString) {
                    varnamesKey = byteObject.interned_list[varnamesKey.index];
                }
                printToOutput('varnames key=' + varnamesKey);
                if ((key == varnamesKey) && (!keyFound)) {
                    function_object.func_code.varnames[j] = kwargs[i][1];
                    printToOutput('setting kwarg in varnames');
                    keyFound = true;
                }
            }
        }

        // printToOutput(function_object.func_code.varnames);
        // If it's a class object, put 'self' in position zero
        if (isClass) {
            function_object.func_code.varnames[0] = 'self';
        }

        //Fill up remaining variable names using the positional arguments
        var counter = 0;
        for (i = 0; i < argcount; i++) {
            if ((function_object.func_code.varnames[i] == undefined) && (counter < args.length)) {
                function_object.func_code.varnames[i] = args[counter];
                counter += 1;
            }
        }

        // printToOutput(function_object.func_code.varnames);
        // Get default values for any unspecified variable left
        counter = function_object.func_defaults.length;
        for (i = argcount - 1; i >= 0; i--) {
            if ((function_object.func_code.varnames[i] == undefined) && (counter > 0)) {
                function_object.func_code.varnames[i] = function_object.func_defaults[counter - 1];
                counter -= 1;
            }
        }

        for (i = 0; i < varnamesOriginal.length; i++) {
            if (function_object.func_code.varnames[i] == undefined) {
                function_object.func_code.varnames[i] = varnamesOriginal[i];
            }
        }

        while (function_object.func_code.pc < function_object.func_code.code.length) {
            // op code
            var opcode = function_object.func_code.code[function_object.func_code.pc];

            // call opcode
            printToOutput(OpCodeList[opcode]);
            function_object.func_code[OpCodeList[opcode]]();
            printToOutput(Stack.toString());
        }

        // Update class objects self field with that found in function_object.func_code.self
        if (isClass) {
            for (var key2 in function_object.func_code.self) {
                printToOutput('func_code.self key: ' + function_object.func_code.self[key2]);
            }
            for (var key3 in class_object.self) {
                printToOutput('class_object.self key: ' + class_object.self[key3]);
            }

            // printToOutput('func_code.self='+function_object.func_code.self);
            // printToOutput('class_object.self='+class_object.self);
            // class_object.self = function_object.func_code.self;
            Stack.push(class_object);
        }

        // Reset varnames
        function_object.func_code.varnames = varnamesOriginal.slice(0);

        // Push the return value onto the stack (could be a None? value)
        if (!(function_object.func_code.returnedValue === null)) {
            Stack.push(function_object.func_code.returnedValue);
        }

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
        var funName = code_object.name;
        if (funName instanceof internedString) {
            newFunction.func_name = byteObject.interned_list[funName.index];
        } else {
            newFunction.func_name = funName;
        }
        if (code_object.consts.length > 0) {
            var doc_string = code_object.consts[0];
            if (typeof doc_string == 'string' || doc_string instanceof String) {
                newFunction.func_doc = doc_string; // not fool proof but better than nothing
            }
        }
        Stack.push(newFunction);
        this.pc += 3;
    };
    CodeObject.prototype.BUILD_SLICE = function () {
        var numItems = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        if (numItems == 2) {
            Stack.push([TOS1, TOS]);
        }
        if (numItems == 3) {
            Stack.push([Stack.pop(), TOS1, TOS]);
        }
        this.pc += 3;
    };
    CodeObject.prototype.MAKE_CLOSURE = function () {
        // creates a new function object sets its freevars
        var argc = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var code_object = Stack.pop();
        var cells = Stack.pop();
        var defaults = [];
        for (var i = 0; i < argc; i++) {
            defaults[i] = Stack.pop();
        }
        var newFunction = new FunctionObject(code_object, defaults);
        newFunction.func_closure = cells; // don't know what this is for
        for (i = 0; i < cells.length; i++) {
            newFunction.func_code.freevars[i] = cells[i];
        }
        Stack.push(newFunction);
        this.pc += 3;
    };
    CodeObject.prototype.LOAD_CLOSURE = function () {
        //load from cellvars
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        if (index < this.cellvars.length) {
            Stack.push(this.cellvars[index]);
        } else {
            Stack.push(this.freevars[this.cellvars.length - index]);
        }
        this.pc += 3;
    };
    CodeObject.prototype.LOAD_DEREF = function () {
        //load from freevars
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        Stack.push(this.freevars[index]);
        this.pc += 3;
    };

    //Stores TOS into the cell contained in slot i of the cell and free variable storage.
    CodeObject.prototype.STORE_DEREF = function () {
        //store in cellvars
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();
        this.cellvars[index] = TOS;
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

// Defines class object
var classObject = (function () {
    // maybe add a 'self' property here to hold all the variables? should default to this.self = {} + methods should have func_globals set to self
    function classObject(name, bases, methods) {
        this.name = name;
        this.bases = bases;
        this.methods = methods;
        this.self = {};
    }
    return classObject;
})();

// Defines class for a function object
var FunctionObject = (function () {
    function FunctionObject(code_object, defaults) {
        this.func_code = code_object;
        this.func_defaults = defaults;
    }
    return FunctionObject;
})();

var internedString = (function () {
    function internedString(index) {
        this.index = index;
    }
    return internedString;
})();

//Iterator object implemented to use for Python iterators
var Iterator = (function () {
    //pass in the bounds
    function Iterator(low, high) {
        this.curIndex = low;
        this.high = high;
    }
    //returns itself
    Iterator.prototype.iter = function () {
        return this;
    };

    //returns next element or StopIteration if nothing is left
    Iterator.prototype.next = function () {
        if (this.curIndex > this.high) {
            //stop iteration
            return -1;
        } else {
            this.curIndex += 1;
            return (this.curIndex - 1);
        }
    };
    return Iterator;
})();

/** Parses given bytecode object whose first 8 bytes are expected to be
the magic number(Python verison) and a timestamp for the file **/
function parseBytecode(bytecode) {
    var len = bytecode.length;

    var magic_number = '';
    for (var j = 0; j < 4; j++) {
        magic_number = magic_number + String(bytecode.readUInt8(j));
    }
    printToOutput('magic number: ' + magic_number);
    byteObject.magic_number = magic_number;

    var time_stamp = '';
    for (j = 4; j < 8; j++) {
        time_stamp = time_stamp + String(bytecode.readUInt8(j));
    }
    printToOutput('time stamp: ' + time_stamp);
    byteObject.time_stamp = time_stamp;

    // Check Magic Number Against Python 2.7 (03f3 0d0a)
    var my_version = '32431310';
    for (var j = 0; j < 4; j++) {
        if (magic_number[j] != my_version[j]) {
            printToOutput('Not right version!');
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
        printToOutput(OpCodeList[opcode]);
        byteObject.code_object[OpCodeList[opcode]]();
        printToOutput(Stack.toString());
    }
}

// First function called to parse and exectute bytecode
function interpretBytecode(bytecode) {
    // Parse Bytecode and Return Op Codes:
    if (parseBytecode(bytecode)) {
        printToOutput('internedList = ' + byteObject.interned_list.toString());

        // Execute the initial opcodes in the code object
        execBytecode();
    }
}

function printToOutput(input, skipReturn, isProgram) {
    var output = input.toString();
    var skipReturn = skipReturn || false;
    var isProgram = isProgram || false;
    if (isVerbose || isProgram) {
        if (!skipReturn) {
            output += '\n';
        }
        document.getElementById("logOut").value += output;
        // process.stdout.write(output);
    }
}

// Assume verbose output requested
var isVerbose = true;

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

// Enum list of Python built-in functions
// enum Built_Ins {
//     abs,
//     all,
//     any = 'any',
//     basestring = 'basestring',
//     bin = 'bin',
//     bool = 'bool',
//     bytearray = 'bytearray',
//     callable = 'callable',
//     chr = 'chr',
//     classmethod = 'classmethod',
//     cmp = 'cmp',
//     compile = 'compile',
//     complex = 'complex',
//     delattr = "delattr",
//     dict = 'dict',
//     dir = 'dir',
//     divmod = 'divmod',
//     enumerate = 'enumerate',
//     eval = 'eval',
//     execfile = 'execfile',
//     file = 'file',
//     filter = 'filter',
//     float = 'float',
//     format = 'format',
//     frozenset = 'frozenset',
//     getattr = 'getattr',
//     func_globals = 'func_globals',
//     hashattr = 'hashattr',
//     hash = 'hash',
//     help = 'help',
//     hex = 'hex',
//     id = 'id',
//     input = 'input',
//     int = 'int',
//     isinstance = 'isinstance',
//     issubclass = 'issubclass',
//     iter = 'iter',
//     len = 'len',
//     list = 'list',
//     locals = 'locals',
//     long = 'long',
//     map = 'map',
//     max = 'max',
//     memoryview = 'memoryview',
//     min = 'min',
//     next = 'next',
//     object = 'object',
//     oct = 'oct',
//     open = 'open',
//     ord = 'ord',
//     pow = 'pow',
//     print = 'print',
//     property = 'property',
//     range = 'range',
//     raw_input = 'raw_input',
//     reduce = 'reduce',
//     reload = 'reload',
//     repr = 'repr',
//     reversed = 'reversed',
//     round = 'round',
//     set = 'set',
//     setattr = 'setattr',
//     slice = 'slice',
//     sorted = 'sorted',
//     staticmethod = 'staticmethod',
//     str = 'str',
//     sum = 'sum',
//     super = 'super',
//     tuple = 'tuple',
//     type = 'type',
//     unichar = 'unichar',
//     unicode = 'unicode',
//     vars = 'vars',
//     xrange = 'xrange',
//     zip = 'zip',
//     _import_ = '_import_',
//     apply = 'apply',
//     buffer = 'buffer',
//     coerce = 'coerce',
//     intern = 'intern'
// }
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
// var fs = require('fs');
// fs.readFile(process.argv[2], function doneReading(err, bytecode) {
//     if (err)
//         throw err;
//     interpretBytecode(bytecode);
// });

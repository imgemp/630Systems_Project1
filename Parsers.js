/// <reference path="Globals.ts" />
/// <reference path="BytecodeObjects.ts" />
/// <reference path="NumericObjects.ts" />
/// <reference path="Log.ts" />
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
    var val = bytecode.readInt32LE(ptr);
    var obj = new Integer(val);
    printToOutput(Array(level).join('\t') + val);
    return [ptr + 4, obj];
}

function readInt64(bytecode, ptr, level) {
    var low = bytecode.readInt32LE(ptr);
    var high = bytecode.readInt32LE(ptr + 4);
    var val = low + Math.pow(2, 32) * high;
    var obj = new Integer(val);
    printToOutput(Array(level).join('\t') + val);
    return [ptr + 8, obj];
}

function readFloat32(bytecode, ptr, level) {
    var val = bytecode.readFloatLE(ptr);
    var obj = new Float(val);
    printToOutput(Array(level).join('\t') + val);
    return [ptr + 4, obj];
}

function readFloat64(bytecode, ptr, level) {
    var val = bytecode.readDoubleLE(ptr);
    var obj = new Float(val);
    printToOutput(Array(level).join('\t') + val);
    return [ptr + 8, obj];
}

function readComplex32(bytecode, ptr, level) {
    var real = bytecode.readFloatLE(ptr);
    var imag = bytecode.readFloatLE(ptr + 4);
    var obj = new Complex(real, imag);
    return [ptr + 8, obj];
}

function readComplex64(bytecode, ptr, level) {
    var real = bytecode.readDoubleLE(ptr);
    var imag = bytecode.readDoubleLE(ptr + 8);
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
    printToOutput(prefix + 'flags:\n' + prefix + obj.flags.toString(16));

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

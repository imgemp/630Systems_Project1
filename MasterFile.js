/// <reference path="node.d.ts" />
function readNull(bytecode, ptr, level) {
    console.log(Array(level).join('\t') + 'Null');
    return ptr;
}

function readNone(bytecode, ptr, level) {
    console.log(Array(level).join('\t') + 'None');
    return ptr;
}

function readFalse(bytecode, ptr, level) {
    console.log(Array(level).join('\t') + 'False');
    return ptr;
}

function readTrue(bytecode, ptr, level) {
    console.log(Array(level).join('\t') + 'True');
    return ptr;
}

function readStopIter(bytecode, ptr, level) {
    console.log(Array(level).join('\t') + 'StopIteration');
    return ptr;
}

function readEllipsis(bytecode, ptr, level) {
    console.log(Array(level).join('\t') + 'Ellipsis');
    return ptr;
}

function readInt32(bytecode, ptr, level) {
    var result = undefined;
    result = bytecode.readUInt32LE(ptr);
    console.log(Array(level).join('\t') + result);
    return ptr + 4;
}

function readInt64(bytecode, ptr, level) {
    console.log('Int64 Not implemented yet!');
    return ptr + 8;
}

function readFloat32(bytecode, ptr, level) {
    console.log('Float32 Not implemented yet!');
    return ptr + 4;
}

function readFloat64(bytecode, ptr, level) {
    console.log('Float64 Not implemented yet!');
    return ptr + 8;
}

function readComplex32(bytecode, ptr, level) {
    console.log('Complex32 Not implemented yet!');
    return ptr + 4;
}

function readComplex64(bytecode, ptr, level) {
    console.log('Complex64 Not implemented yet!');
    return ptr + 8;
}

function readLong(bytecode, ptr, level) {
    console.log('Long Not implemented yet!');
    return ptr + 4;
}

function readString(bytecode, ptr, level) {
    var result = '';
    var size = bytecode.readUInt32LE(ptr);
    for (var j = 0; j < size; j++) {
        result = result + bytecode.toString('utf8', ptr + 4 + j, ptr + 4 + j + 1);
    }
    console.log(Array(level).join('\t') + result);
    return ptr + 4 + size;
}

function readStringInterned(bytecode, ptr, level) {
    var result = '';
    var size = bytecode.readUInt32LE(ptr);
    for (var j = 0; j < size; j++) {
        result = result + bytecode.toString('utf8', ptr + 4 + j, ptr + 4 + j + 1);
    }
    console.log(Array(level).join('\t') + result);
    return ptr + 4 + size;
}

function readStringRef(bytecode, ptr, level) {
    console.log(Array(level).join('\t') + 'ref to interned string in position ' + bytecode.readUInt32LE(ptr));
    return ptr + 4;
}

function readUnicode(bytecode, ptr, level) {
    var result = '';
    var size = bytecode.readUInt32LE(ptr);
    for (var j = 0; j < size; j++) {
        result = result + bytecode.toString('utf8', ptr + 4 + j, ptr + 4 + j + 1);
    }
    console.log(Array(level).join('\t') + result);
    return ptr + 4 + size;
}

function readDict(bytecode, ptr, level) {
    console.log('readDict Not implemented yet! You are screwed');
    return ptr + 4;
}

function readTuple(bytecode, ptr, level) {
    var prefix = Array(level).join('\t');
    var nobjs = bytecode.readUInt32LE(ptr);
    process.stdout.write(' (' + String(nobjs) + ')\n');
    level = level + 1;
    ptr = ptr + 4;
    for (var j = 0; j < nobjs; j++) {
        var type = bytecode.toString('ascii', ptr, ptr + 1);
        if (type in readByType) {
            ptr = readByType[type](bytecode, ptr + 1, level);
        } else {
            ptr = ptr + 1;
        }
    }
    return ptr;
}

function readCodeObject(bytecode, ptr, level) {
    console.log(Array(level).join('\t') + 'code object:');

    level = level + 1;
    var prefix = Array(level).join('\t');

    var argcount = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;
    console.log(prefix + 'argcount:\n' + prefix + String(argcount));

    var nlocals = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;
    console.log(prefix + 'nlocals:\n' + prefix + String(nlocals));

    var stacksize = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;
    console.log(prefix + 'stacksize:\n' + prefix + String(stacksize));

    var flags = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;
    console.log(prefix + 'flags:\n' + prefix + String(flags));

    var type = bytecode.toString('utf8', ptr, ptr + 1);
    ptr = ptr + 1; // should be 's'
    var codelen = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;

    // Start Reading Op Codes
    console.log(prefix + 'code: (' + String(codelen) + ')');
    var ptr0 = ptr;
    while (ptr < ptr0 + codelen) {
        var opcode = bytecode.readUInt8(ptr);
        var logout = '\t' + String(ptr - ptr0) + ': ' + String(opcode);
        if (opcode > 90) {
            var arg = bytecode.readUInt8(ptr + 1);
            logout = logout + ' (' + String(arg) + ')';
            ptr = ptr + 2;
        } else {
            ptr = ptr + 1;
        }
        console.log(prefix + logout);
    }

    // Start Reading Tuple of Constants
    process.stdout.write(prefix + 'consts:');
    ptr = readTuple(bytecode, ptr + 1, level);

    // Start Reading Tuple of Names
    process.stdout.write(prefix + 'names:');
    ptr = readTuple(bytecode, ptr + 1, level);

    // Start Reading Tuple of Variable Names
    process.stdout.write(prefix + 'varnames:');
    ptr = readTuple(bytecode, ptr + 1, level);

    // Start Reading Tuple of Free Variables
    process.stdout.write(prefix + 'freevars:');
    ptr = readTuple(bytecode, ptr + 1, level);

    // Start Reading Tuple of Variables Used in Nested Functions
    process.stdout.write(prefix + 'cellvars:');
    ptr = readTuple(bytecode, ptr + 1, level);

    // Read Filename
    console.log(prefix + 'filename:');
    type = bytecode.toString('utf8', ptr, ptr + 1);
    if (type in readByType) {
        ptr = readByType[type](bytecode, ptr + 1, level);
    } else {
        ptr = ptr + 1;
    }

    // Read Function Name
    console.log(prefix + 'name:');
    type = bytecode.toString('utf8', ptr, ptr + 1);
    if (type in readByType) {
        ptr = readByType[type](bytecode, ptr + 1, level);
    } else {
        ptr = ptr + 1;
    }

    // Read First Line Number
    console.log(prefix + 'firstlineno:');
    ptr = readByType['i'](bytecode, ptr, level);

    // Read Line Number Tab: http://nedbatchelder.com/blog/200804/wicked_hack_python_bytecode_tracing.html
    ptr = ptr + 1; // skipping the 's' byte
    var npairs = bytecode.readUInt32LE(ptr) / 2;
    ptr = ptr + 4;
    console.log(prefix + 'lnotab: (' + String(npairs) + ')');
    for (var j = 0; j < npairs; j++) {
        var byteDelta = bytecode.readUInt8(ptr);
        ptr = ptr + 1;
        var lineDelta = bytecode.readUInt8(ptr);
        ptr = ptr + 1;
        console.log(prefix + '('.concat(String(byteDelta), ',', String(lineDelta), ')'));
    }

    return ptr;
}

function parseBytecode(bytecode) {
    var len = bytecode.length;

    var magic_number = '';
    var time_stamp = '';
    for (var j = 0; j < 4; j++) {
        magic_number = magic_number + String(bytecode.readUInt8(j));
    }
    for (j = 4; j < 8; j++) {
        time_stamp = time_stamp + String(bytecode.readUInt8(j));
    }

    console.log('magic number: ' + magic_number);
    console.log('time stamp: ' + time_stamp);

    // Check Magic Number Against Python 2.7 (03f3 0d0a)
    var my_version = '32431310';
    for (var j = 0; j < 4; j++) {
        if (magic_number[j] != my_version[j]) {
            console.log('Not right version!');
            // exit program
        }
    }

    // Start Parsing Bytecode
    var ptr = 8;
    while (ptr < len) {
        var type = bytecode.toString('utf8', ptr, ptr + 1);
        if (type in readByType) {
            ptr = readByType[type](bytecode, ptr + 1, 1);
        } else {
            ptr = ptr + 1;
        }
    }
}

function interpretBytecode(bytecode) {
    // Parse Bytecode and Return Op Codes
    parseBytecode(bytecode);
    // Execute Op Codes
}

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

var fs = require('fs');
fs.readFile('foo2.pyc', function doneReading(err, bytecode) {
    if (err)
        throw err;
    interpretBytecode(bytecode);
});

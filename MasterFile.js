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
        obj = obj + bytecode.toString('utf8', ptr + 4 + j, ptr + 4 + j + 1);
    }
    console.log(Array(level).join('\t') + obj);
    return [ptr + 4 + size, obj];
}

function readStringInterned(bytecode, ptr, level) {
    var obj = '';
    var size = bytecode.readUInt32LE(ptr);
    for (var j = 0; j < size; j++) {
        obj = obj + bytecode.toString('utf8', ptr + 4 + j, ptr + 4 + j + 1);
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

function readCodeObject(bytecode, ptr, level) {
    console.log(Array(level).join('\t') + 'code object:');
    var obj = {};
    var out = [];

    level = level + 1;
    var prefix = Array(level).join('\t');

    obj.argcount = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;
    console.log(prefix + 'argcount:\n' + prefix + String(obj.argcount));

    obj.nlocals = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;
    console.log(prefix + 'nlocals:\n' + prefix + String(obj.nlocals));

    obj.stacksize = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;
    console.log(prefix + 'stacksize:\n' + prefix + String(obj.stacksize));

    obj.flags = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;
    console.log(prefix + 'flags:\n' + prefix + String(obj.flags));

    var type = bytecode.toString('utf8', ptr, ptr + 1);
    ptr = ptr + 1; // should be 's'
    var codelen = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;

    // Start Reading Op Codes
    obj.code = [];
    console.log(prefix + 'code: (' + String(codelen) + ')');
    var ptr0 = ptr;
    while (ptr < ptr0 + codelen) {
        var opcode = bytecode.readUInt8(ptr);
        var logout = '\t' + String(ptr - ptr0) + ': ' + String(opcode);
        if (opcode >= 90) {
            var arg = bytecode.readUInt8(ptr + 1);
            logout = logout + ' (' + String(arg) + ')';
            ptr = ptr + 2;
            obj.code.push([opcode, arg]);
        } else {
            ptr = ptr + 1;
            obj.code.push([opcode, null]);
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
    type = bytecode.toString('utf8', ptr, ptr + 1);
    if (type in readByType) {
        out = readByType[type](bytecode, ptr + 1, level);
        ptr = out[0];
        obj.filename = out[1];
    } else {
        ptr = ptr + 1;
    }

    // Read Function Name
    console.log(prefix + 'name:');
    type = bytecode.toString('utf8', ptr, ptr + 1);
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
        obj.lnotab.push([byteDelta, lineDelta]);
    }

    return [ptr, obj];
}

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
            // exit program
        }
    }

    // Initialize Interned List
    byteObject.interned_list = [];

    // Start Parsing Bytecode
    var ptr = 8;
    while (ptr < len) {
        var type = bytecode.toString('utf8', ptr, ptr + 1);
        if (type in readByType) {
            var out = readByType[type](bytecode, ptr + 1, 1);
            ptr = out[0];
            byteObject.code_object = out[1];
        } else {
            ptr = ptr + 1;
        }
    }
}

function interpretBytecode(bytecode) {
    // Parse Bytecode and Return Op Codes:
    // http://daeken.com/2010-02-20_Python_Marshal_Format.html
    // http://nedbatchelder.com/blog/200804/the_structure_of_pyc_files.html
    // var byteObject:any = {};
    parseBytecode(bytecode);

    // console.log(byteObject);
    // console.log(byteObject.code_object.code);
    // console.log(byteObject.code_object.code[0]);
    // console.log(byteObject.code_object.consts[0]);
    console.log(byteObject.interned_list);
    // Execute Op Codes
}
class Main{

var byteObject = {};

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
}
var main:Main = new Main();

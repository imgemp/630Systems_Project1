/// <reference path="node.d.ts" />
var readByType = {};
readByType['i'] = readInt32;
readByType['I'] = "readInt64";
readByType['f'] = "readFloat32";
readByType['g'] = "readFloat64";
readByType['x'] = "readComplex32";
readByType['y'] = "readComplex64";
readByType['l'] = "readLong";
readByType['s'] = readString;
readByType['t'] = readStringInterned;
readByType['R'] = "readStringRef";
readByType['u'] = "readUnicode";
readByType['('] = parseCollection;

function readInt32(bytecode, i, logout) {
    var result = undefined;
    result = bytecode.slice(i, i + 4).readUInt32LE(0);
    console.log(logout.concat(result));
    return i + 4;
}

function readString(bytecode, i, logout) {
    var result = [];
    var size = bytecode.slice(i, i + 4).readUInt32LE(0);
    for (var j = 0; j < size; j++) {
        result[i] = String.fromCharCode(bytecode.slice(i + 4 + j, i + 4 + j + 1).readUInt8(0));
        console.log(logout.concat(result[i]));
    }
    return i + 4 + size;
}

function readStringInterned(bytecode, i, logout) {
    var result = [];
    var size = bytecode.slice(i, i + 4).readUInt32LE(0);
    for (var j = 0; j < size; j++) {
        result[i] = String.fromCharCode(bytecode.slice(i + 4 + j, i + 4 + j + 1).readUInt8(0));
        console.log(logout.concat(result[i]));
    }
    return i + 4 + size;
}

var fs = require('fs');
fs.readFile('foo.pyc', function doneReading(err, bytecode) {
    if (err)
        throw err;
    interpretBytecode(bytecode);
});

function interpretBytecode(bytecode) {
    // Parse Bytecode and Return Op Codes
    parseBytecode(bytecode);
    // Execute Op Codes
}

function parseBytecode(bytecode) {
    var len = bytecode.length;

    var magic_number = bytecode.slice(0, 4);
    var time_stamp = bytecode.slice(4, 8);

    console.log('magic number: '.concat(String(magic_number)));
    console.log('time stamp: '.concat(String(time_stamp)));

    // Check Magic Number Against Python 2.7 (03f3 0d0a)
    var my_version = [3, 243, 13, 10];
    for (var i = 0; i < 4; i++) {
        if (magic_number.readUInt8(i) != my_version[i]) {
            console.log('Not right version!');
            // exit program
        }
    }

    // Find First Code Object - "c"
    i = 0;
    while (String.fromCharCode(bytecode.slice(8 + 4 * i, 12 + 4 * i).readUInt8(0)) != 'c') {
        i = i + 1;
        if (i > 100) {
            return;
        }
    }
    i = 8 + 4 * i + 1;
    console.log('Code Object ---------------');

    // Parse Code Object Fields
    var argcount = bytecode.slice(i, i + 4).readUInt32LE(0);
    var nlocals = bytecode.slice(i + 4, i + 8).readUInt32LE(0);
    var stacksize = bytecode.slice(i + 8, i + 12).readUInt32LE(0);
    var flags = bytecode.slice(i + 12, i + 16).readUInt32LE(0);

    console.log('argcount: '.concat(String(argcount)));
    console.log('nlocals: '.concat(String(nlocals)));
    console.log('stacksize: '.concat(String(stacksize)));
    console.log('flags: '.concat(String(flags)));

    // Skip 5 Bytes - figure out why later
    i = i + 16 + 5;

    // Start Reading Op Codes
    console.log('code:');
    var i0 = i;
    var opcode = undefined;
    var arg = undefined;
    var logout = '';
    while (opcode != 83) {
        opcode = bytecode.slice(i, i + 1).readUInt8(0);
        logout = String(i - i0).concat(': ', String(opcode));
        if (opcode > 90) {
            arg = bytecode.slice(i, i + 2).readUInt8(1);
            logout = logout.concat(' (', String(arg), ')');
            i = i + 2;
        } else {
            i = i + 1;
        }
        console.log(logout);
    }

    // Start Reading Constants
    console.log('constants:');
    logout = '';
    console.log(i);
    while (i < len) {
        if (String.fromCharCode(bytecode.slice(i, i + 1).readUInt8(0)) == '(') {
            console.log('(');
            logout = logout.concat('\t');
            i = parseCollection(bytecode, i, logout);
        }
        console.log(i);
    }
}

function parseCollection(bytecode, i, logout) {
    var nobjs = bytecode.slice(i, i + 4).readUInt32LE(0);
    i = i + 4;
    for (var j = 0; j < nobjs; j++) {
        var type = String.fromCharCode(bytecode.slice(i, i + 1).readUInt8(0));
        console.log(type);
        if (type in readByType) {
            i = readByType[type](bytecode, i + 1, logout);
        } else {
            i = i + 1;
        }
    }
    return i;
}
// associative arrays: array = {}; array['fun1'] = foo1; array['fun2'] = foo2;
// console.log(String(i-30).concat(": ".concat(String(String.fromCharCode(data.slice(i,i+1).readUInt8(0))),data.slice(i,i+1).readUInt8(0))));

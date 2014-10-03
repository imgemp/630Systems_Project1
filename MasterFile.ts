/// <reference path="node.d.ts" />

function readNull(bytecode:NodeBuffer,ptr:number,level:number) {
    console.log(Array(level).join('\t')+'Null');
    var byteObject = null;
    return [ptr,byteObject];
}

function readNone(bytecode:NodeBuffer,ptr:number,level:number) {
    console.log(Array(level).join('\t')+'None');
    var byteObject = 'None';
    return [ptr,byteObject];
}

function readFalse(bytecode:NodeBuffer,ptr:number,level:number) {
    console.log(Array(level).join('\t')+'False');
    var byteObject = false;
    return [ptr,byteObject];
}

function readTrue(bytecode:NodeBuffer,ptr:number,level:number) {
    console.log(Array(level).join('\t')+'True');
    var byteObject = true;
    return [ptr,byteObject];
}

function readStopIter(bytecode:NodeBuffer,ptr:number,level:number) {
    console.log(Array(level).join('\t')+'StopIteration');
    var byteObject = 'StopIteration';
    return [ptr,byteObject];
}

function readEllipsis(bytecode:NodeBuffer,ptr:number,level:number) {
    console.log(Array(level).join('\t')+'Ellipsis');
    var byteObject = 'Ellipsis';
    return [ptr,byteObject];
}

function readInt32(bytecode:NodeBuffer,ptr:number,level:number) {
    var result = bytecode.readUInt32LE(ptr);
    console.log(Array(level).join('\t')+result);
    return [ptr+4,result];
}

function readInt64(bytecode:NodeBuffer,ptr:number,level:number) {
    console.log('Int64 Not implemented yet!');
    var byteObject = 'Int64 Not implemented yet!';
    return [ptr+8,byteObject];
}

function readFloat32(bytecode:NodeBuffer,ptr:number,level:number) {
    console.log('Float32 Not implemented yet!');
    var byteObject = 'Float32 Not implemented yet!';
    return [ptr+4,byteObject];
}

function readFloat64(bytecode:NodeBuffer,ptr:number,level:number) {
    console.log('Float64 Not implemented yet!');
    var byteObject = 'Float64 Not implemented yet!';
    return [ptr+8,byteObject];
}

function readComplex32(bytecode:NodeBuffer,ptr:number,level:number) {
    console.log('Complex32 Not implemented yet!');
    var byteObject = 'Complex32 Not implemented yet!';
    return [ptr+4,byteObject];
}

function readComplex64(bytecode:NodeBuffer,ptr:number,level:number) {
    console.log('Complex64 Not implemented yet!');
    var byteObject = 'Complex64 Not implemented yet!';
    return [ptr+8,byteObject];
}

function readLong(bytecode:NodeBuffer,ptr:number,level:number) {
    console.log('Long Not implemented yet!');
    var byteObject = 'Long Not implemented yet!';
    return [ptr+4,byteObject];
}

function readString(bytecode:NodeBuffer,ptr:number,level:number) {
    var result = '';
    var size = bytecode.readUInt32LE(ptr);
    for (var j=0; j<size; j++) {
        result = result+bytecode.toString('utf8',ptr+4+j,ptr+4+j+1);
    }
    console.log(Array(level).join('\t')+result);
    return [ptr+4+size,result];
}

function readStringInterned(bytecode:NodeBuffer,ptr:number,level:number) {
    var result = '';
    var size = bytecode.readUInt32LE(ptr);
    for (var j=0; j<size; j++) {
        result = result+bytecode.toString('utf8',ptr+4+j,ptr+4+j+1);
    }
    console.log(Array(level).join('\t')+result);
    return [ptr+4+size,result];
}

function readStringRef(bytecode:NodeBuffer,ptr:number,level:number) {
    var result = bytecode.readUInt32LE(ptr);
    console.log(Array(level).join('\t')+'ref to interned string in position '+result);
    return [ptr+4,result];
}

function readUnicode(bytecode:NodeBuffer,ptr:number,level:number) {
    var result = '';
    var size = bytecode.readUInt32LE(ptr);
    for (var j=0; j<size; j++) {
        result = result+bytecode.toString('utf8',ptr+4+j,ptr+4+j+1);
    }
    console.log(Array(level).join('\t')+result);
    return [ptr+4+size,result];
}

function readDict(bytecode:NodeBuffer,ptr:number,level:number) {
    console.log('readDict Not implemented yet! You are screwed');
    var byteObject = 'readDict Not implemented yet! You are screwed';
    return [ptr+4,byteObject];
}

function readTuple(bytecode:NodeBuffer,ptr:number,level:number) {
    var byteObject = [];
    var prefix = Array(level).join('\t');
    var nobjs = bytecode.readUInt32LE(ptr);
    process.stdout.write(' ('+String(nobjs)+')\n');
    level = level + 1;
    ptr = ptr + 4;
    for (var j=0; j<nobjs; j++) {
        var type = bytecode.toString('ascii',ptr,ptr+1);
        if (type in readByType) {
            var out = readByType[type](bytecode,ptr+1,level);
            ptr = out[0]; byteObject[j] = out[1];
        } else { ptr = ptr + 1; }
    }
    return [ptr,byteObject];
}

function readCodeObject(bytecode:NodeBuffer,ptr:number,level:number) {

    console.log(Array(level).join('\t')+'code object:');
    var byteObject:any = {};
    var out = [];

    level = level + 1;
    var prefix = Array(level).join('\t');

    byteObject.argcount = bytecode.readUInt32LE(ptr); ptr=ptr+4;
    console.log(prefix+'argcount:\n'+prefix+String(byteObject.argcount));

    byteObject.nlocals = bytecode.readUInt32LE(ptr); ptr=ptr+4;
    console.log(prefix+'nlocals:\n'+prefix+String(byteObject.nlocals));

    byteObject.stacksize = bytecode.readUInt32LE(ptr); ptr=ptr+4;
    console.log(prefix+'stacksize:\n'+prefix+String(byteObject.stacksize));

    byteObject.flags = bytecode.readUInt32LE(ptr); ptr=ptr+4;
    console.log(prefix+'flags:\n'+prefix+String(byteObject.flags));

    var type = bytecode.toString('utf8',ptr,ptr+1); ptr=ptr+1; // should be 's'
    var codelen = bytecode.readUInt32LE(ptr); ptr=ptr+4;

    // Start Reading Op Codes
    byteObject.code = [];
    console.log(prefix+'code: ('+String(codelen)+')');
    var ptr0 = ptr;
    while (ptr<ptr0+codelen) {
        var opcode = bytecode.readUInt8(ptr);
        var logout = '\t'+String(ptr-ptr0)+': '+String(opcode);
        if (opcode > 90) {
            var arg = bytecode.readUInt8(ptr+1);
            logout = logout+' ('+String(arg)+')';
            ptr = ptr + 2;
            byteObject.code.push([opcode,arg]);
        } else {
            ptr = ptr + 1;
            byteObject.code.push([opcode,null]);
        }
        console.log(prefix+logout);
    }

    // Start Reading Tuple of Constants
    process.stdout.write(prefix+'consts:');
    out = readTuple(bytecode,ptr+1,level);
    ptr = out[0]; byteObject.consts = out[1];

    // Start Reading Tuple of Names
    process.stdout.write(prefix+'names:');
    out = readTuple(bytecode,ptr+1,level);
    ptr = out[0]; byteObject.names = out[1];

    // Start Reading Tuple of Variable Names
    process.stdout.write(prefix+'varnames:');
    out = readTuple(bytecode,ptr+1,level);
    ptr = out[0]; byteObject.varnames = out[1];

    // Start Reading Tuple of Free Variables
    process.stdout.write(prefix+'freevars:');
    out = readTuple(bytecode,ptr+1,level);
    ptr = out[0]; byteObject.freevars = out[1];

    // Start Reading Tuple of Variables Used in Nested Functions
    process.stdout.write(prefix+'cellvars:');
    out = readTuple(bytecode,ptr+1,level);
    ptr = out[0]; byteObject.cellvars = out[1];

    // Read Filename
    console.log(prefix+'filename:');
    type = bytecode.toString('utf8',ptr,ptr+1);
    if (type in readByType) {
        out = readByType[type](bytecode,ptr+1,level);
        ptr = out[0]; byteObject.filename = out[1];
    } else { ptr = ptr + 1; }

    // Read Function Name
    console.log(prefix+'name:');
    type = bytecode.toString('utf8',ptr,ptr+1);
    if (type in readByType) {
        out = readByType[type](bytecode,ptr+1,level);
        ptr = out[0]; byteObject.name = out[1];
    } else { ptr = ptr + 1; }

    // Read First Line Number
    console.log(prefix+'firstlineno:');
    out = readByType['i'](bytecode,ptr,level);
    ptr = out[0]; byteObject.firstlineno = out[1];

    // Read Line Number Tab: http://nedbatchelder.com/blog/200804/wicked_hack_python_bytecode_tracing.html
    byteObject.lnotab = [];
    ptr = ptr + 1; // skipping the 's' byte
    var npairs = bytecode.readUInt32LE(ptr)/2; ptr=ptr+4;
    console.log(prefix+'lnotab: ('+String(npairs)+')');
    for (var j=0; j<npairs; j++) {
        var byteDelta = bytecode.readUInt8(ptr); ptr=ptr+1;
        var lineDelta = bytecode.readUInt8(ptr); ptr=ptr+1;
        console.log(prefix+'('.concat(String(byteDelta),',',String(lineDelta),')'));
        byteObject.lnotab.push((byteDelta,lineDelta));
    }

    return [ptr,byteObject];
}

function parseBytecode(bytecode:NodeBuffer,byteObject) {

    var len = bytecode.length;

    var magic_number = '';
    for (var j=0; j<4; j++) { magic_number = magic_number + String(bytecode.readUInt8(j)); }
    console.log('magic number: '+magic_number);
    byteObject.magic_number = magic_number;

    var time_stamp = '';
    for (j=4; j<8; j++) { time_stamp = time_stamp + String(bytecode.readUInt8(j)); }
    console.log('time stamp: '+time_stamp);
    byteObject.time_stamp = time_stamp;

    // Check Magic Number Against Python 2.7 (03f3 0d0a)
    var my_version = '32431310';
    for (var j = 0; j<4; j++) {
        if (magic_number[j] != my_version[j]) {
            console.log('Not right version!');
            // exit program
        }
    }

    // Start Parsing Bytecode
    var ptr = 8;
    while (ptr<len) {
        var type = bytecode.toString('utf8',ptr,ptr+1);
        if (type in readByType) {
            var out = readByType[type](bytecode,ptr+1,1);
            ptr = out[0]; byteObject.code_object = out[1];
        } else { ptr = ptr + 1; }
    }
    
}

function interpretBytecode(bytecode:NodeBuffer) {

    // Parse Bytecode and Return Op Codes
    var byteObject:any = {};
    parseBytecode(bytecode,byteObject);
    // console.log(byteObject);
    // console.log(byteObject.code_object.code);
    // console.log(byteObject.code_object.code[0]);
    // console.log(byteObject.code_object.consts[0]);

    // Execute Op Codes
}

var readByType = {}; // associative array
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
    if (err) throw err;
    interpretBytecode(bytecode);
});


















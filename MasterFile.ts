/// <reference path="node.d.ts" />

var fs = require('fs');
fs.readFile('foo.pyc', function doneReading(err, bytecode) {
    if (err) throw err;
    interpretBytecode(bytecode);
});

function interpretBytecode(bytecode) {

    // Parse Bytecode and Return Op Codes
    parseBytecode(bytecode);

    // Execute Op Codes
}

function parseBytecode(bytecode) {

    var magic_number = bytecode.slice(0, 4);
    var time_stamp = bytecode.slice(4, 8);

    // Check Magic Number Against Python 2.7 (03f3 0d0a)
    var my_version = [3, 243, 13, 10];
    for (var i = 0; i++; i < 4) {
        if (magic_number.readUInt8(i) != my_version[i]) {
            console.log("Not right version!");
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

    // Parse Code Object Fields
    var argcount = bytecode.slice(i, i + 4).readUInt32LE(0);
    var nlocals = bytecode.slice(i + 4, i + 8).readUInt32LE(0);
    var stacksize = bytecode.slice(i + 8, i + 12).readUInt32LE(0);
    var flags = bytecode.slice(i + 12, i + 16).readUInt32LE(0);

    console.log(argcount);
    console.log(nlocals);
    console.log(stacksize);
    console.log(flags);
}
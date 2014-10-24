/// <reference path="Globals.ts" />
/// <reference path="BytecodeObjects.ts" />
/// <reference path="Parsers.ts" />
/// <reference path="Log.ts" />
/// <reference path="node.d.ts" />
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

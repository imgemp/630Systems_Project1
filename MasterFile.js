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
            var arg = bytecode.readUInt16LE(ptr + 1);
            if (opcode > 99) {
                logout = logout + ' (' + String(arg) + ')';
            } else {
                logout = logout + '  (' + String(arg) + ')';
            }
            ptr = ptr + 3;
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

//Implemented bytecode functions in a OpCode class
var OpCodeFunctions = (function () {
    function OpCodeFunctions() {
    }
    OpCodeFunctions.STOP_CODE = function () {
        //do nothing
        console.log('STOP_CODE');
    };
    OpCodeFunctions.POP_TOP = function () {
        console.log('POP_TOP');
        return Stack.pop();
    };
    OpCodeFunctions.ROT_TWO = function () {
        console.log('ROT_TWO');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS1);
    };
    OpCodeFunctions.ROT_THREE = function () {
        console.log('ROT_THREE');
        var TOS = Stack.pop();
        var TOS2 = Stack.pop();
        var TOS3 = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS3);
        Stack.push(TOS2);
    };
    OpCodeFunctions.DUP_TOP = function () {
        console.log('DUP_TOP');
        var TOS = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS);
    };
    OpCodeFunctions.ROT_FOUR = function () {
        console.log('ROT_FOUR');
        console.log('ROT_THREE');
        var TOS = Stack.pop();
        var TOS2 = Stack.pop();
        var TOS3 = Stack.pop();
        var TOS4 = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS4);
        Stack.push(TOS3);
        Stack.push(TOS2);
    };
    OpCodeFunctions.NOP = function () {
        console.log('NOP');
    };
    OpCodeFunctions.UNARY_POSITIVE = function () {
        console.log('UNARY_POSITIVE');
        var TOS = Stack.pop();
        TOS = +TOS;
        Stack.push(TOS);
    };
    OpCodeFunctions.UNARY_NEGATIVE = function () {
        console.log('UNARY_NEGATIVE');
        var TOS = Stack.pop();
        TOS = -TOS;
        Stack.push(TOS);
    };
    OpCodeFunctions.UNARY_NOT = function () {
        console.log('UNARY_NOT');
        var TOS = Stack.pop();
        TOS = !TOS;
        Stack.push(TOS);
    };
    OpCodeFunctions.UNARY_CONVERT = function () {
        console.log('UNARY_CONVERT');
        var TOS = Stack.pop();
        TOS = String(TOS); // Not completely accurate
        Stack.push(TOS);
    };
    OpCodeFunctions.UNARY_INVERT = function () {
        console.log('UNARY_INVERT');
        var TOS = Stack.pop();
        TOS = ~TOS;
        Stack.push(TOS);
    };
    OpCodeFunctions.BINARY_POWER = function () {
        console.log('BINARY_POWER');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        TOS = Math.pow(TOS1, TOS);
        Stack.push(TOS);
    };

    //implements TOS = TOS1 * TOS
    OpCodeFunctions.BINARY_MULTIPLY = function () {
        console.log('BINARY_MULTIPY');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 * TOS);
    };

    //implements TOS = TOS1/TOS (without from_future_import division)
    OpCodeFunctions.BINARY_DIVIDE = function () {
        console.log('BINARY_DIVIDE');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();

        //*** need to make this so floors ints & longs but gives approx with floats or complex ***/
        Stack.push(TOS1 / TOS);
    };

    //implements TOS = TOS1 % TOS
    OpCodeFunctions.BINARY_MODULO = function () {
        console.log('BINARY_MODULO');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 % TOS);
    };

    //implemsnts TOS = TOS1 + TOS
    OpCodeFunctions.BINARY_ADD = function () {
        console.log('BINARY_ADD');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 + TOS);
    };

    //implements TOS = TOS1 - TOS
    OpCodeFunctions.BINARY_SUBTRACT = function () {
        console.log('BINARY_SUBTRACT');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 - TOS);
    };

    //implements TOS = TOS1[TOS]
    OpCodeFunctions.BINARY_SUBSCR = function () {
        console.log('BINARY_SUBSCR');
    };

    //implements TOS = TOS1 // TOS
    OpCodeFunctions.BINARY_FLOOR_DIVIDE = function () {
        console.log('BINARY_FLOOR_DIVIDE');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(Math.floor(TOS1 / TOS));
    };

    //implements TOS = TOS1/TOS (with from_future_import division)
    OpCodeFunctions.BINARY_TRUE_DIVIDE = function () {
        console.log('BINARY_TRUE_DIVIDE');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 / TOS);
    };

    //DIFFERENCE OF THESE FROM BINARY?
    OpCodeFunctions.INPLACE_FLOOR_DIVIDE = function () {
        console.log('INPLACE_FLOOR_DIVIDE');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(Math.floor(TOS1 / TOS));
    };

    //with from_future_import division
    OpCodeFunctions.INPLACE_TRUE_DIVIDE = function () {
        console.log('INPLACE_TRUE_DIVIDE');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 / TOS);
    };
    OpCodeFunctions.SLICE = function () {
    };
    OpCodeFunctions.STORE_SLICE = function () {
    };
    OpCodeFunctions.DELETE_SLICE = function () {
    };
    OpCodeFunctions.STORE_MAP = function () {
    };
    OpCodeFunctions.INPLACE_ADD = function () {
    };
    OpCodeFunctions.INPLACE_SUBTRACT = function () {
    };
    OpCodeFunctions.INPLACE_MULTIPY = function () {
    };
    OpCodeFunctions.INPLACE_DIVIDE = function () {
    };
    OpCodeFunctions.INPLACE_MODULO = function () {
    };
    OpCodeFunctions.STORE_SUBSCR = function () {
    };
    OpCodeFunctions.DELETE_SUBSCR = function () {
    };
    OpCodeFunctions.BINARY_LSHIFT = function () {
    };
    OpCodeFunctions.BINARY_RSHIFT = function () {
    };
    OpCodeFunctions.BINARY_AND = function () {
    };
    OpCodeFunctions.BINARY_XOR = function () {
    };
    OpCodeFunctions.BINARY_OR = function () {
    };
    OpCodeFunctions.INPLACE_POWER = function () {
    };
    OpCodeFunctions.GET_ITER = function () {
        console.log('GET_ITER'); // Objects already iterable?
    };
    OpCodeFunctions.PRINT_EXPR = function () {
    };
    OpCodeFunctions.PRINT_ITEM = function () {
        console.log('PRINT_ITEM');
        var TOS = Stack.pop();
        console.log(TOS);
        Stack.push(TOS);
    };
    OpCodeFunctions.PRINT_NEWLINE = function () {
        console.log('PRINT_NEWLINE');
        console.log('\n');
    };
    OpCodeFunctions.PRINT_ITEM_TO = function () {
    };
    OpCodeFunctions.PRINT_NEWLINE_TO = function () {
    };
    OpCodeFunctions.INPLACE_LSHIFT = function () {
    };
    OpCodeFunctions.INPLACE_RSHIFT = function () {
    };
    OpCodeFunctions.INPLACE_AND = function () {
    };
    OpCodeFunctions.INPLACE_XOR = function () {
    };
    OpCodeFunctions.INPLACE_OR = function () {
    };
    OpCodeFunctions.BREAK_LOOP = function () {
    };
    OpCodeFunctions.WITH_CLEANUP = function () {
    };
    OpCodeFunctions.LOAD_LOCALS = function () {
    };
    OpCodeFunctions.RETURN_VALUE = function () {
    };
    OpCodeFunctions.IMPORT_STAR = function () {
    };
    OpCodeFunctions.EXEC_STMT = function () {
    };
    OpCodeFunctions.YIELD_VALUE = function () {
    };
    OpCodeFunctions.POP_BLOCK = function () {
    };
    OpCodeFunctions.END_FINALLY = function () {
    };
    OpCodeFunctions.BUILD_CLASS = function () {
    };

    //Opcodes from here have an argument
    OpCodeFunctions.STORE_NAME = function (index) {
        console.log('STORE_NAME');
        var name = Stack.pop();
        /*** need access to this ***/
        //obj.names[index] = name;
    };
    OpCodeFunctions.DELETE_NAME = function (index) {
    };
    OpCodeFunctions.UNPACK_SEQUENCE = function (numItems) {
    };
    OpCodeFunctions.FOR_ITER = function (incrCounter) {
    };
    OpCodeFunctions.LIST_APPEND = function (value) {
    };
    OpCodeFunctions.STORE_ATTR = function (index) {
    };
    OpCodeFunctions.DELETE_ATTR = function (index) {
    };
    OpCodeFunctions.STORE_GLOBAL = function (index) {
    };
    OpCodeFunctions.DELETE_GLOBAL = function (index) {
    };
    OpCodeFunctions.DUP_TOPX = function (numItemsDup) {
    };

    //pushes co_consts onto the stack
    OpCodeFunctions.LOAD_CONST = function (index) {
        console.log("LOAD_CONST");
        //need to be able to access the consts list
        //Stack.push(obj.consts[index]);
    };
    OpCodeFunctions.LOAD_NAME = function (index) {
        console.log("LOAD_NAME");
        //need to be able to access the name list
        //Stack.push(obj.names[index]);
    };
    OpCodeFunctions.BUILD_TUPLE = function (numItems) {
    };
    OpCodeFunctions.BUILD_LIST = function (numItems) {
    };
    OpCodeFunctions.BUILD_SET = function (numItems) {
    };
    OpCodeFunctions.BUILD_MAP = function (numEntries) {
    };
    OpCodeFunctions.LOAD_ATTR = function (index) {
    };
    OpCodeFunctions.COMPARE_OP = function (opname) {
    };
    OpCodeFunctions.IMPORT_NAME = function (index) {
    };
    OpCodeFunctions.IMPORT_FROM = function (index) {
    };
    OpCodeFunctions.JUMP_FORWARD = function (numBytes) {
    };
    OpCodeFunctions.JUMP_IF_FALSE_OR_POP = function (offest) {
    };
    OpCodeFunctions.JUMP_IF_TRUE_OR_POP = function (offset) {
    };
    OpCodeFunctions.JUMP_ABSOLUTE = function (offset) {
    };
    OpCodeFunctions.POP_JUMP_IF_FALSE = function (offset) {
    };
    OpCodeFunctions.POP_JUMP_IF_TRUE = function (offset) {
    };
    OpCodeFunctions.LOAD_GLOBAL = function (index) {
    };
    OpCodeFunctions.CONTINUE_LOOP = function (start) {
    };
    OpCodeFunctions.SETUP_LOOP = function (addr) {
    };
    OpCodeFunctions.SETUP_EXCEPT = function (addr) {
    };
    OpCodeFunctions.SETUP_FINALLY = function (addr) {
    };
    OpCodeFunctions.LOAD_FAST = function (varNum) {
    };
    OpCodeFunctions.STORE_FAST = function (varNum) {
    };
    OpCodeFunctions.DELETE_FAST = function (varNum) {
    };
    OpCodeFunctions.RAISE_VARARGS = function (numArg) {
    };

    /* CALL_FUNCTION_XXX opcodes defined below depend on this definition */
    OpCodeFunctions.CALL_FUNCTION = function (arg) {
    };
    OpCodeFunctions.MAKE_FUNCTION = function (numDefaults) {
    };
    OpCodeFunctions.BUILD_SLICE = function (numItems) {
    };
    OpCodeFunctions.MAKE_CLOSURE = function (numFreeVars) {
    };
    OpCodeFunctions.LOAD_CLOSURE = function (index) {
    };
    OpCodeFunctions.LOAD_DEREF = function (index) {
    };
    OpCodeFunctions.STORE_DEREF = function (index) {
    };

    /* The next 3 opcodes must be contiguous and satisfy
    (CALL_FUNCTION_VAR - CALL_FUNCTION) & 3 == 1  */
    OpCodeFunctions.CALL_FUNCTION_VAR = function (argc) {
    };
    OpCodeFunctions.CALL_FUNCTION_KW = function (argc) {
    };
    OpCodeFunctions.CALL_FUNCTION_VAR_KW = function (argc) {
    };
    OpCodeFunctions.SETUP_WITH = function (delta) {
    };

    /* Support for opargs more than 16 bits long */
    OpCodeFunctions.EXTENDED_ARG = function (ext) {
    };

    /***** have to determine what type of arguments these take *****/
    OpCodeFunctions.SET_ADD = function () {
    };
    OpCodeFunctions.MAP_ADD = function () {
    };
    return OpCodeFunctions;
})();
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
        var type = bytecode.toString('ascii', ptr, ptr + 1);
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
    parseBytecode(bytecode);
    console.log(byteObject.interned_list);

    //execute the initial opcodes in the code object
    execBytecode();
}

//initalize the stack object
var Stack = [];

//function to execute the op code commands in code object
function execBytecode() {
    for (var i = 0; i < byteObject.code_object.code.length; i++) {
        //op code
        var opcode = byteObject.code_object.code[i][0];

        //arguments to op code function
        var operand = byteObject.code_object.code[i][1];

        //debugg this...something 'undefined' after PRINT_LINEs...
        console.log(OpCodeList[opcode]);
        OpCodeFunctions[OpCodeList[opcode]](operand);
    }

    return Stack.pop();
}

//initalize object to store information of various types
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

//https://android.googlesource.com/platform/prebuilts/python/darwin-x86/2.7.5/+/master/include/python2.7/opcode.h
//enum list of all opcodes
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

var fs = require('fs');
fs.readFile(process.argv[2], function doneReading(err, bytecode) {
    if (err)
        throw err;
    interpretBytecode(bytecode);
});

/// <reference path="node.d.ts" />

function readNull(bytecode:NodeBuffer, ptr:number, level:number) {
    console.log(Array(level).join('\t') + 'Null');
    var obj = null;
    return [ptr, obj];
}

function readNone(bytecode:NodeBuffer, ptr:number, level:number) {
    console.log(Array(level).join('\t') + 'None');
    var obj = 'None';
    return [ptr, obj];
}

function readFalse(bytecode:NodeBuffer, ptr:number, level:number) {
    console.log(Array(level).join('\t') + 'False');
    var obj = false;
    return [ptr, obj];
}

function readTrue(bytecode:NodeBuffer, ptr:number, level:number) {
    console.log(Array(level).join('\t') + 'True');
    var obj = true;
    return [ptr, obj];
}

function readStopIter(bytecode:NodeBuffer, ptr:number, level:number) {
    console.log(Array(level).join('\t') + 'StopIteration');
    var obj = 'StopIteration';
    return [ptr, obj];
}

function readEllipsis(bytecode:NodeBuffer, ptr:number, level:number) {
    console.log(Array(level).join('\t') + 'Ellipsis');
    var obj = 'Ellipsis';
    return [ptr, obj];
}

function readInt32(bytecode:NodeBuffer, ptr:number, level:number) {
    var obj = bytecode.readUInt32LE(ptr);
    console.log(Array(level).join('\t') + obj);
    return [ptr + 4, obj];
}

function readInt64(bytecode:NodeBuffer, ptr:number, level:number) {
    console.log('Int64 Not implemented yet!');
    var obj = 'Int64 Not implemented yet!';
    return [ptr + 8, obj];
}

function readFloat32(bytecode:NodeBuffer, ptr:number, level:number) {
    console.log('Float32 Not implemented yet!');
    var obj = 'Float32 Not implemented yet!';
    return [ptr + 4, obj];
}

function readFloat64(bytecode:NodeBuffer, ptr:number, level:number) {
    console.log('Float64 Not implemented yet!');
    var obj = 'Float64 Not implemented yet!';
    return [ptr + 8, obj];
}

function readComplex32(bytecode:NodeBuffer, ptr:number, level:number) {
    console.log('Complex32 Not implemented yet!');
    var obj = 'Complex32 Not implemented yet!';
    return [ptr + 4, obj];
}

function readComplex64(bytecode:NodeBuffer, ptr:number, level:number) {
    console.log('Complex64 Not implemented yet!');
    var obj = 'Complex64 Not implemented yet!';
    return [ptr + 8, obj];
}

function readLong(bytecode:NodeBuffer, ptr:number, level:number) {
    console.log('Long Not implemented yet!');
    var obj = 'Long Not implemented yet!';
    return [ptr + 4, obj];
}

function readString(bytecode:NodeBuffer, ptr:number, level:number) {
    var obj = '';
    var size = bytecode.readUInt32LE(ptr);
    for (var j = 0; j < size; j++) {
        obj = obj + bytecode.toString('ascii', ptr + 4 + j, ptr + 4 + j + 1);
    }
    console.log(Array(level).join('\t') + obj);
    return [ptr + 4 + size, obj];
}

function readStringInterned(bytecode:NodeBuffer, ptr:number, level:number) {
    var obj = '';
    var size = bytecode.readUInt32LE(ptr);
    for (var j = 0; j < size; j++) {
        obj = obj + bytecode.toString('ascii', ptr + 4 + j, ptr + 4 + j + 1);
    }
    console.log(Array(level).join('\t') + '(interned)' + obj);
    byteObject.interned_list.push(obj);
    return [ptr + 4 + size, obj];
}

function readStringRef(bytecode:NodeBuffer, ptr:number, level:number) {
    var obj = bytecode.readUInt32LE(ptr);
    console.log(Array(level).join('\t') + 'ref to interned string in position ' + obj);
    return [ptr + 4, obj];
}

function readUnicode(bytecode:NodeBuffer, ptr:number, level:number) {
    var obj = '';
    var size = bytecode.readUInt32LE(ptr);
    for (var j = 0; j < size; j++) {
        obj = obj + bytecode.toString('utf8', ptr + 4 + j, ptr + 4 + j + 1);
    }
    console.log(Array(level).join('\t') + obj);
    return [ptr + 4 + size, obj];
}

function readDict(bytecode:NodeBuffer, ptr:number, level:number) {
    console.log('readDict Not implemented yet! You are screwed');
    var obj = 'readDict Not implemented yet! You are screwed';
    return [ptr + 4, obj];
}

function readTuple(bytecode:NodeBuffer, ptr:number, level:number) {
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

function readCodeObject(bytecode:NodeBuffer, ptr:number, level:number) {
    console.log(Array(level).join('\t') + 'code object:');
    var obj:any = {};
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
    if (codelen > 9) { colon = ':  '; }
    var ptr0 = ptr;
    while (ptr < ptr0 + codelen) {
        if (ptr - ptr0 > 9) { colon = ': '; }
        var opcode = bytecode.readUInt8(ptr);
        var logout = '\t' + String(ptr - ptr0) + colon + String(opcode);
        if (opcode >= 90) {
            var arg = bytecode.readUInt16LE(ptr + 1);
            if (opcode > 99) { logout = logout + ' (' + String(arg) + ')'; }
            else { logout = logout + '  (' + String(arg) + ')'; }
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
//Implemented bytecode functions
function STOP_CODE(){
    console.log('STOP_CODE');
}
function POP_TOP(){
    console.log('POP_TOP');
    return Stack.pop();
}
function ROT_TWO(){
    console.log('ROT_TWO');
    var TOS = Stack.pop();
    var TOS1 = Stack.pop();
    Stack.push(TOS);
    Stack.push(TOS1);
}
function ROT_THREE(){
    console.log('ROT_THREE');
    var TOS = Stack.pop();
    var TOS2 = Stack.pop();
    var TOS3 = Stack.pop();
    Stack.push(TOS);
    Stack.push(TOS3);
    Stack.push(TOS2);
}
function DUP_TOP(){
    console.log('DUP_TOP');
    var TOS = Stack.pop();
    Stack.push(TOS);
    Stack.push(TOS);
}
function ROT_FOUR(){
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
}
function NOP(){
    console.log('NOP');
}
function UNARY_POSITIVE(){
    console.log('UNARY_POSITIVE');
    var TOS = Stack.pop();
    TOS = +TOS;
    Stack.push(TOS);
}
function UNARY_NEGATIVE(){
    console.log('UNARY_NEGATIVE');
    var TOS = Stack.pop();
    TOS = -TOS;
    Stack.push(TOS);
}
function UNARY_NOT(){
    console.log('UNARY_NOT');
    var TOS = Stack.pop();
    TOS = !TOS;
    Stack.push(TOS);
}
function UNARY_CONVERT(){
    console.log('UNARY_CONVERT');
    var TOS = Stack.pop();
    TOS = String(TOS); // Not completely accurate
    Stack.push(TOS);
}
function UNARY_INVERT(){
    console.log('UNARY_INVERT');
    var TOS = Stack.pop();
    TOS = ~TOS;
    Stack.push(TOS);
}
function BINARY_POWER(){
    console.log('BINARY_POWER');
    var TOS = Stack.pop();
    var TOS1 = Stack.pop();
    TOS = Math.pow(TOS1,TOS);
    Stack.push(TOS);
}
function BINARY_MULTIPLY(){}
function BINARY_DIVIDE(){}
function BINARY_MODULO(){}
function BINARY_ADD(){}
function BINARY_SUBTRACT(){}
function BINARY_SUBSCR(){}
function BINARY_FLOOR_DIVIDE(){}
function BINARY_TRUE_DIVIDE(){}
function INPLACE_FLOOR_DIVIDE(){}
function INPLACE_TRUE_DIVIDE(){}
function SLICE(){}
function STORE_SLICE(){}
function DELETE_SLICE(){}
function STORE_MAP(){}
function INPLACE_ADD(){}
function INPLACE_SUBTRACT(){}
function INPLACE_MULTIPY(){}
function INPLACE_DIVIDE(){}
function INPLACE_MODULO(){}
function STORE_SUBSCR(){}
function DELETE_SUBSCR(){}
function BINARY_LSHIFT(){}
function BINARY_RSHIFT(){}
function BINARY_AND(){}
function BINARY_XOR(){}
function BINARY_OR(){}
function INPLACE_POWER(){}
function GET_ITER(){
    console.log('GET_ITER'); // Objects already iterable?
}
function PRINT_EXPR(){}
function PRINT_ITEM(){
    console.log('PRINT_ITEM');
    var TOS = Stack.pop();
    console.log(TOS);
    Stack.push(TOS);
}
function PRINT_NEWLINE(){
    console.log('PRINT_NEWLINE');
    console.log('\n');
}
function PRINT_ITEM_TO(){}
function PRINT_NEWLINE_TO(){}
function INPLACE_LSHIFT(){}
function INPLACE_RSHIFT(){}
function INPLACE_AND(){}
function INPLACE_XOR(){}
function INPLACE_OR(){}
function BREAK_LOOP(){}
function WITH_CLEANUP(){}
function LOAD_LOCALS(){}
function RETURN_VALUE(){}
function IMPORT_STAR(){}
function EXEC_STMT(){}
function YIELD_VALUE(){}
function POP_BLOCK(){}
function END_FINALLY(){}
function BUILD_CLASS(){}
//Opcodes from here have an argument 
function STORE_NAME(index:number){}
function DELETE_NAME(index:number){} 
function UNPACK_SEQUENCE(numItems:number){} 
function FOR_ITER(){}
function LIST_APPEND(){}
function STORE_ATTR(index:number){} 
function DELETE_ATTR(index:number){} 
function STORE_GLOBAL(index:number){} 
function DELETE_GLOBAL(index:number){}
function DUP_TOPX(numItemsDup:number){} 
function LOAD_CONST(index:number){}
function LOAD_NAME(index:number){}
function BUILD_TUPLE(numItems:number){} 
function BUILD_LIST(numItems:number){} 
function BUILD_SET(numItems:number){}
function BUILD_MAP(){} 
function LOAD_ATTR(index:number){}
function COMPARE_OP (){} //comparison operator
function IMPORT_NAME (index:number){}
function IMPORT_FROM(index:number){} 
function JUMP_FORWARD(numBytes:number){}
function JUMP_IF_FALSE_OR_POP(offest:number){} 
function JUMP_IF_TRUE_OR_POP(offset:number){} 
function JUMP_ABSOLUTE(offset:number){}
function POP_JUMP_IF_FALSE(offset:number){} 
function POP_JUMP_IF_TRUE(offset:number){} 
function LOAD_GLOBAL(index:number){} 
function CONTINUE_LOOP(start:number){}//start of loop(absolute)
function SETUP_LOOP(addr:number){}//target address(relative)
function SETUP_EXCEPT(addr:number){}//target address(relative)
function SETUP_FINALLY(addr:number){}//target address(relative)
function LOAD_FAST(varNum:number){} //local variable number
function STORE_FAST(varNum:number){} 
function DELETE_FAST(varNum:number){} 
function RAISE_VARARGS(numArg:number){} //number of raise arguments(1,2 or 3)
/* CALL_FUNCTION_XXX opcodes defined below depend on this definition */
function CALL_FUNCTION(arg:number){}//number of args + (number kwargs<<8)
function MAKE_FUNCTION(numDefaults:number){}
function BUILD_SLICE(numItems:number){} 
function MAKE_CLOSURE(numFreeVars:number){} 
function LOAD_CLOSURE(){}//load free variable from closure
function LOAD_DEREF(){}//load and deference from closure cell
function STORE_DEREF(){} //store into cell
/* The next 3 opcodes must be contiguous and satisfy
   (CALL_FUNCTION_VAR - CALL_FUNCTION) & 3 == 1  */
function CALL_FUNCTION_VAR(){} //number args + (number kwargs<<8)
function CALL_FUNCTION_KW(){} //number args + (number kwargs<<8)
function CALL_FUNCTION_VAR_KW(){} //number args + (number kwargs<<8)
function SETUP_WITH(){}
/* Support for opargs more than 16 bits long */
function EXTENDED_ARG(){}
function SET_ADD(){}
function MAP_ADD(){}

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

    // console.log(byteObject);
    // console.log(byteObject.code_object.code);
    // console.log(byteObject.code_object.code[0]);
    // console.log(byteObject.code_object.consts[0]);
    console.log(byteObject.interned_list);
    // Execute Op Codes
}

//initalize object to store information of various types 
var byteObject:any = {};

var Stack = [];

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
var opCodeList = {};
opCodeList[0] = STOP_CODE;
opCodeList[1] = POP_TOP;
opCodeList[2] = ROT_TWO;
opCodeList[3] = ROT_THREE;
opCodeList[4] = DUP_TOP;
opCodeList[5] = ROT_FOUR;
opCodeList[9] = NOP;
opCodeList[10] = UNARY_POSITIVE;
opCodeList[11] = UNARY_NEGATIVE;
opCodeList[12] = UNARY_NOT;
opCodeList[13] = UNARY_CONVERT;
opCodeList[15] = UNARY_INVERT;
opCodeList[19] = BINARY_POWER;
opCodeList[20] = BINARY_MULTIPLY;
opCodeList[21] = BINARY_DIVIDE;
opCodeList[22] = BINARY_MODULO;
opCodeList[23] = BINARY_ADD;
opCodeList[24] = BINARY_SUBTRACT;
opCodeList[25] = BINARY_SUBSCR;
opCodeList[26] = BINARY_FLOOR_DIVIDE;
opCodeList[27] = BINARY_TRUE_DIVIDE;
opCodeList[28] = INPLACE_FLOOR_DIVIDE;
opCodeList[29] = INPLACE_TRUE_DIVIDE;
opCodeList[30] = SLICE;
opCodeList[31] = SLICE;
opCodeList[32] = SLICE;
opCodeList[33] = SLICE;
opCodeList[40] = STORE_SLICE;
opCodeList[41] = STORE_SLICE;
opCodeList[42] = STORE_SLICE;
opCodeList[43] = STORE_SLICE;
opCodeList[50] = DELETE_SLICE;
opCodeList[51] = DELETE_SLICE;
opCodeList[52] = DELETE_SLICE;
opCodeList[53] = DELETE_SLICE;
opCodeList[54] = STORE_MAP;
opCodeList[55] = INPLACE_ADD;
opCodeList[56] = INPLACE_SUBTRACT;
opCodeList[57] = INPLACE_MULTIPY;
opCodeList[58] = INPLACE_DIVIDE;
opCodeList[59] = INPLACE_MODULO;
opCodeList[60] = STORE_SUBSCR;
opCodeList[61] = DELETE_SUBSCR;
opCodeList[62] = BINARY_LSHIFT;
opCodeList[63] = BINARY_RSHIFT;
opCodeList[64] = BINARY_AND;
opCodeList[65] = BINARY_XOR;
opCodeList[66] = BINARY_OR;
opCodeList[67] = INPLACE_POWER;
opCodeList[68] = GET_ITER;
opCodeList[70] = PRINT_EXPR;
opCodeList[71] = PRINT_ITEM;
opCodeList[72] = PRINT_NEWLINE;
opCodeList[73] = PRINT_ITEM_TO;
opCodeList[74] = PRINT_NEWLINE_TO;
opCodeList[75] = INPLACE_LSHIFT;
opCodeList[76] = INPLACE_RSHIFT;
opCodeList[77] = INPLACE_AND;
opCodeList[78] = INPLACE_XOR;
opCodeList[79] = INPLACE_OR;
opCodeList[80] = BREAK_LOOP;
opCodeList[81] = WITH_CLEANUP;
opCodeList[82] = LOAD_LOCALS;
opCodeList[83] = RETURN_VALUE;
opCodeList[84] = IMPORT_STAR;
opCodeList[85] = EXEC_STMT;
opCodeList[86] = YIELD_VALUE;
opCodeList[87] = POP_BLOCK;
opCodeList[88] = END_FINALLY;
opCodeList[89] = BUILD_CLASS;
//Opcodes from here have an argument HAVE_ARGUMENT 90
opCodeList[90] = STORE_NAME; //index in name list
opCodeList[91] = DELETE_NAME; //index in name list
opCodeList[92] = UNPACK_SEQUENCE; //number of sequence items
opCodeList[93] = FOR_ITER;
opCodeList[94] = LIST_APPEND;
opCodeList[95] = STORE_ATTR; //index in name list
opCodeList[96] = DELETE_ATTR; //index in name list
opCodeList[97] = STORE_GLOBAL; //index in name list
opCodeList[98] = DELETE_GLOBAL; //index in name list
opCodeList[99] = DUP_TOPX; //number of items to duplicate
opCodeList[100] = LOAD_CONST; //index in const list
opCodeList[101] = LOAD_NAME; //index in name list
opCodeList[102] = BUILD_TUPLE; //number of tuple items
opCodeList[103] = BUILD_LIST; //number of list items
opCodeList[104] = BUILD_SET; //number of set items
opCodeList[105] = BUILD_MAP; //always 0 for now?
opCodeList[106] = LOAD_ATTR; //index in name list
opCodeList[107] = COMPARE_OP; //comparison operator
opCodeList[108] = IMPORT_NAME; //index in name list
opCodeList[109] = IMPORT_FROM; //index in name list
opCodeList[110] = JUMP_FORWARD; //number of bytes to skip
opCodeList[111] = JUMP_IF_FALSE_OR_POP; //target byte offset from beginning of code
opCodeList[112] = JUMP_IF_TRUE_OR_POP; //target byte offset from beginning of code
opCodeList[113] = JUMP_ABSOLUTE;  //target byte offset from beginning of code
opCodeList[114] = POP_JUMP_IF_FALSE;  //target byte offset from beginning of code
opCodeList[115] = POP_JUMP_IF_TRUE; //target byte offset from beginning of code
opCodeList[116] = LOAD_GLOBAL; //index in name list
opCodeList[119] = CONTINUE_LOOP; //start of loop(absolute)
opCodeList[120] = SETUP_LOOP; //target address(relative)
opCodeList[121] = SETUP_EXCEPT; //target address(relative)
opCodeList[122] = SETUP_FINALLY; //target address(relative)
opCodeList[124] = LOAD_FAST; //local variable number
opCodeList[125] = STORE_FAST; //local variable number
opCodeList[126] = DELETE_FAST; //local variable number
opCodeList[130] = RAISE_VARARGS; //number of raise arguments(1,2 or 3)
/* CALL_FUNCTION_XXX opcodes defined below depend on this definition */
opCodeList[131] = CALL_FUNCTION; //number of args + (number kwargs<<8)
opCodeList[132] = MAKE_FUNCTION; //number defaults
opCodeList[133] = BUILD_SLICE; //number of items
opCodeList[134] = MAKE_CLOSURE; //number free vars
opCodeList[135] = LOAD_CLOSURE; //load free variable from closure
opCodeList[136] = LOAD_DEREF; //load and deference from closure cell
opCodeList[137] = STORE_DEREF; //store into cell
/* The next 3 opcodes must be contiguous and satisfy
   (CALL_FUNCTION_VAR - CALL_FUNCTION) & 3 == 1  */
opCodeList[140] = CALL_FUNCTION_VAR; //number args + (number kwargs<<8)
opCodeList[141] = CALL_FUNCTION_KW; //number args + (number kwargs<<8)
opCodeList[142] = CALL_FUNCTION_VAR_KW; //number args + (number kwargs<<8)
opCodeList[143] = SETUP_WITH;
/* Support for opargs more than 16 bits long */
opCodeList[145] = EXTENDED_ARG;
opCodeList[146] = SET_ADD;
opCodeList[147] = MAP_ADD;



var fs = require('fs');
fs.readFile(process.argv[2], function doneReading(err, bytecode) {
    if (err)
        throw err;
    interpretBytecode(bytecode);
});
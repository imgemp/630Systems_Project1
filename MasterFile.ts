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
//Implemented bytecode functions in a OpCode class
class OpCodeFunctions {
    public static STOP_CODE(){
        //do nothing
        console.log('STOP_CODE');
    }
    public static POP_TOP(){
        console.log('POP_TOP');
        return Stack.pop();
    }
    public static ROT_TWO(){
        console.log('ROT_TWO');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS1);
    }
    public static ROT_THREE(){
        console.log('ROT_THREE');
        var TOS = Stack.pop();
        var TOS2 = Stack.pop();
        var TOS3 = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS3);
        Stack.push(TOS2);
    }
    public static DUP_TOP(){
        console.log('DUP_TOP');
        var TOS = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS);
    }
    public static ROT_FOUR(){
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
    public static NOP(){
        console.log('NOP');
    }
    public static UNARY_POSITIVE(){
        console.log('UNARY_POSITIVE');
        var TOS = Stack.pop();
        TOS = +TOS;
        Stack.push(TOS);
    }
    public static UNARY_NEGATIVE(){
        console.log('UNARY_NEGATIVE');
        var TOS = Stack.pop();
        TOS = -TOS;
        Stack.push(TOS);
    }
    public static UNARY_NOT(){
        console.log('UNARY_NOT');
        var TOS = Stack.pop();
        TOS = !TOS;
        Stack.push(TOS);
    }
    public static UNARY_CONVERT(){
        console.log('UNARY_CONVERT');
        var TOS = Stack.pop();
        TOS = String(TOS); // Not completely accurate
        Stack.push(TOS);
    }
    public static UNARY_INVERT(){
        console.log('UNARY_INVERT');
        var TOS = Stack.pop();
        TOS = ~TOS;
        Stack.push(TOS);
    }
    public static BINARY_POWER(){
        console.log('BINARY_POWER');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        TOS = Math.pow(TOS1,TOS);
        Stack.push(TOS);
    }
    //implements TOS = TOS1 * TOS
    public static BINARY_MULTIPLY(){
        console.log('BINARY_MULTIPY');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 * TOS);
    }
    //implements TOS = TOS1/TOS (without from_future_import division)
    public static BINARY_DIVIDE(){
        console.log('BINARY_DIVIDE');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        //*** need to make this so floors ints & longs but gives approx with floats or complex ***/
        Stack.push(TOS1/TOS);

    }
    //implements TOS = TOS1 % TOS
    public static BINARY_MODULO(){
        console.log('BINARY_MODULO');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 % TOS);

    }
    //implemsnts TOS = TOS1 + TOS
    public static BINARY_ADD(){
        console.log('BINARY_ADD');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 + TOS);

    }
    //implements TOS = TOS1 - TOS
    public static BINARY_SUBTRACT(){
        console.log('BINARY_SUBTRACT');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 - TOS);

    }
    //implements TOS = TOS1[TOS]
    public static BINARY_SUBSCR(){
        console.log('BINARY_SUBSCR');

    }
    //implements TOS = TOS1 // TOS
    public static BINARY_FLOOR_DIVIDE(){
        console.log('BINARY_FLOOR_DIVIDE');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(Math.floor(TOS1/TOS));

    }
    //implements TOS = TOS1/TOS (with from_future_import division)
    public static BINARY_TRUE_DIVIDE(){
        console.log('BINARY_TRUE_DIVIDE');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1/TOS);
    }
    //DIFFERENCE OF THESE FROM BINARY?
    public static INPLACE_FLOOR_DIVIDE(){
        console.log('INPLACE_FLOOR_DIVIDE');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(Math.floor(TOS1/TOS));
    }
    //with from_future_import division
    public static INPLACE_TRUE_DIVIDE(){
        console.log('INPLACE_TRUE_DIVIDE');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1/TOS);
    }
    public static SLICE(){}
    public static STORE_SLICE(){}
    public static DELETE_SLICE(){}
    public static STORE_MAP(){}
    public static INPLACE_ADD(){}
    public static INPLACE_SUBTRACT(){}
    public static INPLACE_MULTIPY(){}
    public static INPLACE_DIVIDE(){}
    public static INPLACE_MODULO(){}
    public static STORE_SUBSCR(){}
    public static DELETE_SUBSCR(){}
    public static BINARY_LSHIFT(){}
    public static BINARY_RSHIFT(){}
    public static BINARY_AND(){}
    public static BINARY_XOR(){}
    public static BINARY_OR(){}
    public static INPLACE_POWER(){}
    public static GET_ITER(){
        console.log('GET_ITER'); // Objects already iterable?
    }
    public static PRINT_EXPR(){}
    public static PRINT_ITEM(){
        console.log('PRINT_ITEM');
        var TOS = Stack.pop();
        console.log(TOS);
        Stack.push(TOS);
    }
    public static PRINT_NEWLINE(){
        console.log('PRINT_NEWLINE');
        console.log('\n');
    }
    public static PRINT_ITEM_TO(){}
    public static PRINT_NEWLINE_TO(){}
    public static INPLACE_LSHIFT(){}
    public static INPLACE_RSHIFT(){}
    public static INPLACE_AND(){}
    public static INPLACE_XOR(){}
    public static INPLACE_OR(){}
    public static BREAK_LOOP(){}
    public static WITH_CLEANUP(){}
    public static LOAD_LOCALS(){}
    public static RETURN_VALUE(){}
    public static IMPORT_STAR(){}
    public static EXEC_STMT(){}
    public static YIELD_VALUE(){}
    public static POP_BLOCK(){}
    public static END_FINALLY(){}
    public static BUILD_CLASS(){}
    //Opcodes from here have an argument 
    public static STORE_NAME(index:number){}
    public static DELETE_NAME(index:number){} 
    public static UNPACK_SEQUENCE(numItems:number){} 
    public static FOR_ITER(incrCounter:number){}
    public static LIST_APPEND(value:number){}
    public static STORE_ATTR(index:number){} 
    public static DELETE_ATTR(index:number){} 
    public static STORE_GLOBAL(index:number){} 
    public static DELETE_GLOBAL(index:number){}
    public static DUP_TOPX(numItemsDup:number){} 
    public static LOAD_CONST(index:number){}
    public static LOAD_NAME(index:number){}
    public static BUILD_TUPLE(numItems:number){} 
    public static BUILD_LIST(numItems:number){} 
    public static BUILD_SET(numItems:number){}
    public static BUILD_MAP(numEntries:number){} 
    public static LOAD_ATTR(index:number){}
    public static COMPARE_OP (opname){} //comparison operator
    public static IMPORT_NAME (index:number){}
    public static IMPORT_FROM(index:number){} 
    public static JUMP_FORWARD(numBytes:number){}
    public static JUMP_IF_FALSE_OR_POP(offest:number){} 
    public static JUMP_IF_TRUE_OR_POP(offset:number){} 
    public static JUMP_ABSOLUTE(offset:number){}
    public static POP_JUMP_IF_FALSE(offset:number){} 
    public static POP_JUMP_IF_TRUE(offset:number){} 
    public static LOAD_GLOBAL(index:number){} 
    public static CONTINUE_LOOP(start:number){}//start of loop(absolute)
    public static SETUP_LOOP(addr:number){}//target address(relative)
    public static SETUP_EXCEPT(addr:number){}//target address(relative)
    public static SETUP_FINALLY(addr:number){}//target address(relative)
    public static LOAD_FAST(varNum:number){} //local variable number
    public static STORE_FAST(varNum:number){} 
    public static DELETE_FAST(varNum:number){} 
    public static RAISE_VARARGS(numArg:number){} //number of raise arguments(1,2 or 3)
    /* CALL_FUNCTION_XXX opcodes defined below depend on this definition */
    public static CALL_FUNCTION(arg:number){}//number of args + (number kwargs<<8)
    public static MAKE_FUNCTION(numDefaults:number){}
    public static BUILD_SLICE(numItems:number){} 
    public static MAKE_CLOSURE(numFreeVars:number){} 
    public static LOAD_CLOSURE(index:number){}//load free variable from closure
    public static LOAD_DEREF(index:number){}//load and deference from closure cell
    public static STORE_DEREF(index:number){} //store into cell
    /* The next 3 opcodes must be contiguous and satisfy
       (CALL_FUNCTION_VAR - CALL_FUNCTION) & 3 == 1  */
    public static CALL_FUNCTION_VAR(argc){} //number args + (number kwargs<<8)
    public static CALL_FUNCTION_KW(argc){} //number args + (number kwargs<<8)
    public static CALL_FUNCTION_VAR_KW(argc){} //number args + (number kwargs<<8)
    public static SETUP_WITH(delta){}
    /* Support for opargs more than 16 bits long */
    public static EXTENDED_ARG(ext){}
    /***** have to determine what type of arguments these take *****/
    public static SET_ADD(){}
    public static MAP_ADD(){}
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

//initalize the stack object
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
//enum list of all opcodes
var OpCodeList = new Enum({
    STOP_CODE:0, 
    POP_TOP:1,
    ROT_TWO:2,
    ROT_THREE:3,
    DUP_TOP:4,
    ROT_FOUR:5,
    NOP:9,
    UNARY_POSITIVE:10,
    UNARY_NEGATIVE:11,
    UNARY_NOT:12,
    UNARY_CONVERT:13,
    UNARY_INVERT:15,
    BINARY_POWER:19,
    BINARY_MULTIPLY:20,
    BINARY_DIVIDE:21,
    BINARY_MODULO:22,
    BINARY_ADD:23,
    BINARY_SUBTRACT:24,
    BINARY_SUBSCR:25,
    BINARY_FLOOR_DIVIDE:26,
    BINARY_TRUE_DIVIDE:27,
    INPLACE_FLOOR_DIVIDE:28,
    INPLACE_TRUE_DIVIDE:29,
    SLICE:30,
    //SLICE:31,
    //SLICE:32,
    //SLICE:33,
    STORE_SLICE:40,
    //STORE_SLICE:41,
    //STORE_SLICE:42,
   // STORE_SLICE:43,
    DELETE_SLICE:50,
   // DELETE_SLICE:51,
    //DELETE_SLICE:52,
    //DELETE_SLICE:53,
    STORE_MAP:54,
    INPLACE_ADD:55,
    INPLACE_SUBTRACT:56,
    INPLACE_MULTIPY:57,
    INPLACE_DIVIDE:58,
    INPLACE_MODULO:59,
    STORE_SUBSCR:60,
    DELETE_SUBSCR:61,
    BINARY_LSHIFT:62,
    BINARY_RSHIFT:63,
    BINARY_AND:64,
    BINARY_XOR:65,
    BINARY_OR:66,
    INPLACE_POWER:67,
    GET_ITER:68,
    PRINT_EXPR:70,
    PRINT_ITEM:71,
    PRINT_NEWLINE:72,
    RINT_ITEM_TO:73,
    PRINT_NEWLINE_TO:74,
    INPLACE_LSHIFT:75,
    INPLACE_RSHIFT:76,
    INPLACE_AND:77,
    INPLACE_XOR:78,
    INPLACE_OR:79,
    BREAK_LOOP:80,
    WITH_CLEANUP:81,
    LOAD_LOCALS:82,
    RETURN_VALUE:83,
    IMPORT_STAR:84,
    EXEC_STMT:85,
    YIELD_VALUE:86,
    POP_BLOCK:87,
    END_FINALLY:88,
    BUILD_CLASS:89,
    //Opcodes from here have an argument HAVE_ARGUMENT 90
    STORE_NAME:90, //index in name list
    DELETE_NAME:91, //index in name list
    UNPACK_SEQUENCE:92, //number of sequence items
    FOR_ITER:93,
    LIST_APPEND:94,
    STORE_ATTR:95, //index in name list
    DELETE_ATTR:96, //index in name list
    STORE_GLOBAL:97,//index in name list
    DELETE_GLOBAL:98, //index in name list
    DUP_TOPX:99, //number of items to duplicate
    LOAD_CONST:100, //index in const list
    LOAD_NAME:101, //index in name list
    BUILD_TUPLE:102, //number of tuple items
    BUILD_LIST:103, //number of list items
    BUILD_SET:104, //number of set items
    BUILD_MAP:105, //always 0 for now?
    LOAD_ATTR:106, //index in name list
    COMPARE_OP:107, //comparison operator
    IMPORT_NAME:108, //index in name list
    IMPORT_FROM:109, //index in name list
    JUMP_FORWARD:110, //number of bytes to skip
    JUMP_IF_FALSE_OR_POP:111, //target byte offset from beginning of code
    JUMP_IF_TRUE_OR_POP:112, //target byte offset from beginning of code
    JUMP_ABSOLUTE:113,  //target byte offset from beginning of code
    POP_JUMP_IF_FALSE:114, //target byte offset from beginning of code
    POP_JUMP_IF_TRUE:115, //target byte offset from beginning of code
    LOAD_GLOBAL:116, //index in name list
    CONTINUE_LOOP:119, //start of loop(absolute)
    SETUP_LOOP:120, //target address(relative)
    SETUP_EXCEPT:121, //target address(relative)
    SETUP_FINALLY:122, //target address(relative)
    LOAD_FAST:124, //local variable number
    STORE_FAST:125,//local variable number
    DELETE_FAST:126, //local variable number
    RAISE_VARARGS:130, //number of raise arguments(1,2 or 3)
    /* CALL_FUNCTION_XXX opcodes defined below depend on this definition */
    CALL_FUNCTION:131, //number of args + (number kwargs<<8)
    MAKE_FUNCTION:132, //number defaults
    BUILD_SLICE:133, //number of items
    MAKE_CLOSURE:134,//number free vars
    LOAD_CLOSURE:135, //load free variable from closure
    LOAD_DEREF:136, //load and deference from closure cell
    STORE_DEREF:137, //store into cell
    /* The next 3 opcodes must be contiguous and satisfy
       (CALL_FUNCTION_VAR - CALL_FUNCTION) & 3 == 1  */
    CALL_FUNCTION_VAR:140, //number args + (number kwargs<<8)
    CALL_FUNCTION_KW:141, //number args + (number kwargs<<8)
    CALL_FUNCTION_VAR_KW:142, //number args + (number kwargs<<8)
    SETUP_WITH:143,
    /* Support for opargs more than 16 bits long */
    EXTENDED_ARG:145,
    SET_ADD:146,
    MAP_ADD:147
});



var fs = require('fs');
var Enum = require('enum');
fs.readFile(process.argv[2], function doneReading(err, bytecode) {
    if (err)
        throw err;
    interpretBytecode(bytecode);
});
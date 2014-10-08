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

// Returns a CodeObject
function readCodeObject(bytecode:NodeBuffer, ptr:number, level:number) {
    console.log(Array(level).join('\t') + 'code object:');
    var obj = new CodeObject();
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
class CodeObject {

    argcount: number;
    nlocals: number;
    stacksize: number;
    flags: number;
    code: any;
    consts: any;
    names: any;
    varnames: any;
    freevars: any;
    cellvars: any;
    filename: string;
    name: string;
    firstlineno: number;
    lnotab: any;
    returnedValue: any;

    constructor() {
        this.argcount = undefined;
        this.nlocals = undefined;
        this.stacksize = undefined;
        this.flags = undefined;
        this.code = undefined;
        this.consts = undefined;
        this.names = undefined;
        this.varnames = undefined;
        this.freevars = undefined;
        this.cellvars = undefined;
        this.filename = undefined;
        this.name = undefined;
        this.firstlineno = undefined;
        this.lnotab = undefined;
        this.returnedValue = undefined;
    }

    public STOP_CODE(){
        //do nothing
        // console.log('STOP_CODE');
    }
    public POP_TOP(){
        // console.log('POP_TOP');
        return Stack.pop();
    }
    public ROT_TWO(){
        // console.log('ROT_TWO');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS1);
    }
    public ROT_THREE(){
        // console.log('ROT_THREE');
        var TOS = Stack.pop();
        var TOS2 = Stack.pop();
        var TOS3 = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS3);
        Stack.push(TOS2);
    }
    public DUP_TOP(){
        // console.log('DUP_TOP');
        var TOS = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS);
    }
    public ROT_FOUR(){
        // console.log('ROT_FOUR');
        var TOS = Stack.pop();
        var TOS2 = Stack.pop();
        var TOS3 = Stack.pop();
        var TOS4 = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS4);
        Stack.push(TOS3);
        Stack.push(TOS2);
    }
    public NOP(){
        // console.log('NOP');
    }
    public UNARY_POSITIVE(){
        // console.log('UNARY_POSITIVE');
        var TOS = Stack.pop();
        TOS = +TOS;
        Stack.push(TOS);
    }
    public UNARY_NEGATIVE(){
        // console.log('UNARY_NEGATIVE');
        var TOS = Stack.pop();
        TOS = -TOS;
        Stack.push(TOS);
    }
    public UNARY_NOT(){
        // console.log('UNARY_NOT');
        var TOS = Stack.pop();
        TOS = !TOS;
        Stack.push(TOS);
    }
    public UNARY_CONVERT(){
        // console.log('UNARY_CONVERT');
        var TOS = Stack.pop();
        TOS = String(TOS); // Not completely accurate
        Stack.push(TOS);
    }
    public UNARY_INVERT(){
        // console.log('UNARY_INVERT');
        var TOS = Stack.pop();
        TOS = ~TOS;
        Stack.push(TOS);
    }
    public BINARY_POWER(){
        // console.log('BINARY_POWER');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        TOS = Math.pow(TOS1,TOS);
        Stack.push(TOS);
    }
    //implements TOS = TOS1 * TOS
    public BINARY_MULTIPLY(){
        // console.log('BINARY_MULTIPY');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 * TOS);
    }
    //implements TOS = TOS1/TOS (without from_future_import division)
    public BINARY_DIVIDE(){
        // console.log('BINARY_DIVIDE');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        //*** need to make this so floors ints & longs but gives approx with floats or complex ***/
        Stack.push(TOS1/TOS);

    }
    //implements TOS = TOS1 % TOS
    public BINARY_MODULO(){
        // console.log('BINARY_MODULO');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 % TOS);

    }
    //implemsnts TOS = TOS1 + TOS
    public BINARY_ADD(){
        // console.log('BINARY_ADD');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 + TOS);

    }
    //implements TOS = TOS1 - TOS
    public BINARY_SUBTRACT(){
        // console.log('BINARY_SUBTRACT');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 - TOS);

    }
    //implements TOS = TOS1[TOS]
    public BINARY_SUBSCR(){
        // console.log('BINARY_SUBSCR');

    }
    //implements TOS = TOS1 // TOS
    public BINARY_FLOOR_DIVIDE(){
        // console.log('BINARY_FLOOR_DIVIDE');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(Math.floor(TOS1/TOS));

    }
    //implements TOS = TOS1/TOS (with from_future_import division)
    public BINARY_TRUE_DIVIDE(){
        // console.log('BINARY_TRUE_DIVIDE');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1/TOS);
    }
    //DIFFERENCE OF THESE FROM BINARY?
    public INPLACE_FLOOR_DIVIDE(){
        // console.log('INPLACE_FLOOR_DIVIDE');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(Math.floor(TOS1/TOS));
    }
    //with from_future_import division
    public INPLACE_TRUE_DIVIDE(){
        // console.log('INPLACE_TRUE_DIVIDE');
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1/TOS);
    }
    public SLICE(){}
    public STORE_SLICE(){}
    public DELETE_SLICE(){}
    public STORE_MAP(){}
    public INPLACE_ADD(){}
    public INPLACE_SUBTRACT(){}
    public INPLACE_MULTIPY(){}
    public INPLACE_DIVIDE(){}
    public INPLACE_MODULO(){}
    public STORE_SUBSCR(){}
    public DELETE_SUBSCR(){}
    public BINARY_LSHIFT(){}
    public BINARY_RSHIFT(){}
    public BINARY_AND(){}
    public BINARY_XOR(){}
    public BINARY_OR(){}
    public INPLACE_POWER(){}
    public GET_ITER(){
        // console.log('GET_ITER'); // Objects already iterable?
    }
    public PRINT_EXPR(){}
    public PRINT_ITEM(){
        // console.log('PRINT_ITEM');
        var TOS = Stack.pop();
        console.log('LOGGED TO CONSOLE: --------------------- '+TOS);
    }
    public PRINT_NEWLINE(){
        // console.log('PRINT_NEWLINE');
        console.log('LOGGED TO CONSOLE: --------------------- '); // or process.stdout.write('\n');
    }
    public PRINT_ITEM_TO(){}
    public PRINT_NEWLINE_TO(){}
    public INPLACE_LSHIFT(){}
    public INPLACE_RSHIFT(){}
    public INPLACE_AND(){}
    public INPLACE_XOR(){}
    public INPLACE_OR(){}
    public BREAK_LOOP(){}
    public WITH_CLEANUP(){}
    public LOAD_LOCALS(){}
    public RETURN_VALUE(){
        this.returnedValue = Stack.pop();
    }
    public IMPORT_STAR(){}
    public EXEC_STMT(){}
    public YIELD_VALUE(){}
    public POP_BLOCK(){}
    public END_FINALLY(){}
    public BUILD_CLASS(){}
    //Opcodes from here have an argument 
    public STORE_NAME(index:number){
        // console.log('STORE_NAME');
        var name = Stack.pop();
        /*** need access to this ***/
        this.names[index] = name;
    }
    public DELETE_NAME(index:number){} 
    public UNPACK_SEQUENCE(numItems:number){} 
    public FOR_ITER(incrCounter:number){}
    public LIST_APPEND(value:number){}
    public STORE_ATTR(index:number){} 
    public DELETE_ATTR(index:number){} 
    public STORE_GLOBAL(index:number){} 
    public DELETE_GLOBAL(index:number){}
    public DUP_TOPX(numItemsDup:number){} 
     //pushes co_consts onto the stack
    public LOAD_CONST(index:number){
        // console.log("LOAD_CONST")
        //need to be able to access the consts list
        Stack.push(this.consts[index]);
    }
    public LOAD_NAME(index:number){
        // console.log("LOAD_NAME")
        //need to be able to access the name list
        Stack.push(this.names[index]);
    }
    public BUILD_TUPLE(numItems:number){} 
    public BUILD_LIST(numItems:number){} 
    public BUILD_SET(numItems:number){}
    public BUILD_MAP(numEntries:number){} 
    public LOAD_ATTR(index:number){}
    public COMPARE_OP (opname){} //comparison operator
    public IMPORT_NAME (index:number){}
    public IMPORT_FROM(index:number){} 
    public JUMP_FORWARD(numBytes:number){}
    public JUMP_IF_FALSE_OR_POP(offest:number){} 
    public JUMP_IF_TRUE_OR_POP(offset:number){} 
    public JUMP_ABSOLUTE(offset:number){}
    public POP_JUMP_IF_FALSE(offset:number){} 
    public POP_JUMP_IF_TRUE(offset:number){} 
    public LOAD_GLOBAL(index:number){} 
    public CONTINUE_LOOP(start:number){}//start of loop(absolute)
    public SETUP_LOOP(addr:number){}//target address(relative)
    public SETUP_EXCEPT(addr:number){}//target address(relative)
    public SETUP_FINALLY(addr:number){}//target address(relative)
    public LOAD_FAST(varNum:number){
        Stack.push(this.varnames[varNum]);
    } //local variable number
    public STORE_FAST(varNum:number){
        this.varnames[varNum] = Stack.pop();
    } 
    public DELETE_FAST(varNum:number){} 
    public RAISE_VARARGS(numArg:number){} //number of raise arguments(1,2 or 3)
    /* CALL_FUNCTION_XXX opcodes defined below depend on this definition */
    public CALL_FUNCTION(argc:number){
        var binStr = argc.toString(2);
        var numArgs = parseInt(binStr.slice(0,8),2);
        var numKwargs = parseInt(binStr.slice(8,16),2);
        var args = [];
        var kwargs = {};
        // console.log('printing stack');
        // console.log(Stack);
        // console.log('thats everything');
        for (var i=0; i< numKwargs; i++) { var val = Stack.pop(); kwargs[Stack.pop()] = val; }
        for (i=0; i< numArgs; i++) { args[numArgs-1-i] = Stack.pop(); } // args[0] = leftmost argument
        var function_object = Stack.pop();
        // how to defaults and args combine
        function_object.func_code.varnames = args;
        var argcount = function_object.func_code.argcount;
        for (i=0; i< argcount - argc; i++) { function_object.func_code.varnames.push(function_object.func_defaults[i]); }
        function_object.func_code.cellvars = kwargs;
        // console.log(function_object.func_code);
        for(i=0; i < function_object.func_code.code.length; i++){
            //op code
            var opcode = function_object.func_code.code[i][0];
            //arguments to op code function
            var operand = function_object.func_code.code[i][1];
            //debugg this...something 'undefined' after PRINT_LINEs...
            console.log(OpCodeList[opcode]);
            function_object.func_code[OpCodeList[opcode]](operand);
            console.log(Stack);
        }
        // console.log(function_object.func_code.returnedValue);
        Stack.push(function_object.func_code.returnedValue);
    }//number of args + (number kwargs<<8)
    public MAKE_FUNCTION(argc:number){
        var code_object = Stack.pop();
        var defaults = [];
        for (var i=0; i<argc; i++) { defaults[i] = Stack.pop(); }
        var newFunction = new FunctionObject(code_object,defaults);
        // console.log('about to add function object to stack');
        // console.log(Stack);
        Stack.push(newFunction);
        // console.log('did it work');
        // console.log(Stack);
    }
    public BUILD_SLICE(numItems:number){} 
    public MAKE_CLOSURE(numFreeVars:number){} 
    public LOAD_CLOSURE(index:number){}//load free variable from closure
    public LOAD_DEREF(index:number){}//load and deference from closure cell
    public STORE_DEREF(index:number){} //store into cell
    /* The next 3 opcodes must be contiguous and satisfy
       (CALL_FUNCTION_VAR - CALL_FUNCTION) & 3 == 1  */
    public CALL_FUNCTION_VAR(argc){} //number args + (number kwargs<<8)
    public CALL_FUNCTION_KW(argc){} //number args + (number kwargs<<8)
    public CALL_FUNCTION_VAR_KW(argc){} //number args + (number kwargs<<8)
    public SETUP_WITH(delta){}
    /* Support for opargs more than 16 bits long */
    public EXTENDED_ARG(ext){}
    /***** have to determine what type of arguments these take *****/
    public SET_ADD(){}
    public MAP_ADD(){}
}

class FunctionObject {
    func_closure: number;
    func_code: CodeObject;
    func_defaults: any;
    func_dict: any;
    func_doc: string;
    func_globals: any;
    func_name: string;

    constructor(code_object: CodeObject, defaults: any) { this.func_code = code_object; this.func_defaults = defaults; }
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
    console.log(byteObject.interned_list);
    //execute the initial opcodes in the code object
    execBytecode();
    
  
}
//initalize the stack object
var Stack = [];

//function to execute the op code commands in code object
function execBytecode(){
    var obj = byteObject;
    // Execute Op Codes
    for(var i=0; i < byteObject.code_object.code.length; i++){
        //op code
        var opcode = byteObject.code_object.code[i][0];
        //arguments to op code function
        var operand = byteObject.code_object.code[i][1];
        //debugg this...something 'undefined' after PRINT_LINEs...
        console.log(OpCodeList[opcode]);
        byteObject.code_object[OpCodeList[opcode]](operand);
        console.log(Stack);
    }

    return Stack.pop();
}

//initalize object to store information of various types 
var byteObject:any = {};

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
enum OpCodeList {
    STOP_CODE = 0,
    POP_TOP = 1,
    ROT_TWO = 2,
    ROT_THREE = 3,
    DUP_TOP = 4,
    ROT_FOUR = 5,
    NOP = 9,
    UNARY_POSITIVE = 10,
    UNARY_NEGATIVE = 11,
    UNARY_NOT = 12,
    UNARY_CONVERT = 13,
    UNARY_INVERT = 15,
    BINARY_POWER = 19,
    BINARY_MULTIPLY = 20,
    BINARY_DIVIDE = 21,
    BINARY_MODULO = 22,
    BINARY_ADD = 23,
    BINARY_SUBTRACT = 24,
    BINARY_SUBSCR = 25,
    BINARY_FLOOR_DIVIDE = 26,
    BINARY_TRUE_DIVIDE = 27,
    INPLACE_FLOOR_DIVIDE = 28,
    INPLACE_TRUE_DIVIDE = 29,
    SLICE_0 = 30,
    SLICE_1 = 31,
    SLICE_2 = 32,
    SLICE_3 = 33,
    STORE_SLICE_0 = 40,
    STORE_SLICE_1 = 41,
    STORE_SLICE_2 = 42,
    STORE_SLICE_3 = 43,
    DELETE_SLICE_0 = 50,
    DELETE_SLICE_1 = 51,
    DELETE_SLICE_2 = 52,
    DELETE_SLICE_3 = 53,
    STORE_MAP = 54,
    INPLACE_ADD = 55,
    INPLACE_SUBTRACT = 56,
    INPLACE_MULTIPY = 57,
    INPLACE_DIVIDE = 58,
    INPLACE_MODULO = 59,
    STORE_SUBSCR = 60,
    DELETE_SUBSCR = 61,
    BINARY_LSHIFT = 62,
    BINARY_RSHIFT = 63,
    BINARY_AND = 64,
    BINARY_XOR = 65,
    BINARY_OR = 66,
    INPLACE_POWER = 67,
    GET_ITER = 68,
    PRINT_EXPR = 70,
    PRINT_ITEM = 71,
    PRINT_NEWLINE = 72,
    RINT_ITEM_TO = 73,
    PRINT_NEWLINE_TO = 74,
    INPLACE_LSHIFT = 75,
    INPLACE_RSHIFT = 76,
    INPLACE_AND = 77,
    INPLACE_XOR = 78,
    INPLACE_OR = 79,
    BREAK_LOOP = 80,
    WITH_CLEANUP = 81,
    LOAD_LOCALS = 82,
    RETURN_VALUE = 83,
    IMPORT_STAR = 84,
    EXEC_STMT = 85,
    YIELD_VALUE = 86,
    POP_BLOCK = 87,
    END_FINALLY = 88,
    BUILD_CLASS = 89,
    //Opcodes from here have an argument HAVE_ARGUMENT 90
    STORE_NAME = 90, //index in name list
    DELETE_NAME = 91, //index in name list
    UNPACK_SEQUENCE = 92, //number of sequence items
    FOR_ITER = 93,
    LIST_APPEND = 94,
    STORE_ATTR = 95, //index in name list
    DELETE_ATTR = 96, //index in name list
    STORE_GLOBAL = 97,//index in name list
    DELETE_GLOBAL = 98, //index in name list
    DUP_TOPX = 99, //number of items to duplicate
    LOAD_CONST = 100, //index in const list
    LOAD_NAME = 101, //index in name list
    BUILD_TUPLE = 102, //number of tuple items
    BUILD_LIST = 103, //number of list items
    BUILD_SET = 104, //number of set items
    BUILD_MAP = 105, //always 0 for now?
    LOAD_ATTR = 106, //index in name list
    COMPARE_OP = 107, //comparison operator
    IMPORT_NAME = 108, //index in name list
    IMPORT_FROM = 109, //index in name list
    JUMP_FORWARD = 110, //number of bytes to skip
    JUMP_IF_FALSE_OR_POP = 111, //target byte offset from beginning of code
    JUMP_IF_TRUE_OR_POP = 112, //target byte offset from beginning of code
    JUMP_ABSOLUTE = 113,  //target byte offset from beginning of code
    POP_JUMP_IF_FALSE = 114, //target byte offset from beginning of code
    POP_JUMP_IF_TRUE = 115, //target byte offset from beginning of code
    LOAD_GLOBAL = 116, //index in name list
    CONTINUE_LOOP = 119, //start of loop(absolute)
    SETUP_LOOP = 120, //target address(relative)
    SETUP_EXCEPT = 121, //target address(relative)
    SETUP_FINALLY = 122, //target address(relative)
    LOAD_FAST = 124, //local variable number
    STORE_FAST = 125,//local variable number
    DELETE_FAST = 126, //local variable number
    RAISE_VARARGS = 130, //number of raise arguments(1,2 or 3)
    /* CALL_FUNCTION_XXX opcodes defined below depend on this definition */
    CALL_FUNCTION = 131, //number of args + (number kwargs<<8)
    MAKE_FUNCTION = 132, //number defaults
    BUILD_SLICE = 133, //number of items
    MAKE_CLOSURE = 134,//number free vars
    LOAD_CLOSURE = 135, //load free variable from closure
    LOAD_DEREF = 136, //load and deference from closure cell
    STORE_DEREF = 137, //store into cell
    /* The next 3 opcodes must be contiguous and satisfy
       (CALL_FUNCTION_VAR - CALL_FUNCTION) & 3 == 1  */
    CALL_FUNCTION_VAR = 140, //number args + (number kwargs<<8)
    CALL_FUNCTION_KW = 141, //number args + (number kwargs<<8)
    CALL_FUNCTION_VAR_KW = 142, //number args + (number kwargs<<8)
    SETUP_WITH = 143,
    /* Support for opargs more than 16 bits long */
    EXTENDED_ARG = 145,
    SET_ADD = 146,
    MAP_ADD = 147
};



var fs = require('fs');
fs.readFile(process.argv[2], function doneReading(err, bytecode) {
    if (err)
        throw err;
    interpretBytecode(bytecode);
});
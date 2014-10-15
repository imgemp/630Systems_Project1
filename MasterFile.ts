/// <reference path="node.d.ts" />

class internedString {
    index: number;

    constructor(index: number) { this.index = index; }
}

function readNull(bytecode:NodeBuffer, ptr:number, level:number) {
    console.log(Array(level).join('\t') + 'Null');
    var obj = null;
    return [ptr, obj];
}

function readNone(bytecode:NodeBuffer, ptr:number, level:number) {
    console.log(Array(level).join('\t') + 'None');
    var obj = null;
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
    var index = bytecode.readUInt32LE(ptr);
    var obj = new internedString(index);
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

// Interprets and returns a CodeObject
function readCodeObject(bytecode:NodeBuffer, ptr:number, level:number) {
    console.log(Array(level).join('\t') + 'code object:');
    var obj = new CodeObject();
    var out = [];

    level = level + 1;
    var prefix = Array(level).join('\t');

    // Read Argcount
    obj.argcount = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;
    console.log(prefix + 'argcount:\n' + prefix + String(obj.argcount));

    // Read Nlocals
    obj.nlocals = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;
    console.log(prefix + 'nlocals:\n' + prefix + String(obj.nlocals));

    // Read Stacksize
    obj.stacksize = bytecode.readUInt32LE(ptr);
    ptr = ptr + 4;
    console.log(prefix + 'stacksize:\n' + prefix + String(obj.stacksize));

    // Read Flags
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
            var arg1 = bytecode.readUInt8(ptr + 1);
            var arg2 = bytecode.readUInt8(ptr + 2);
            if (opcode > 99) { logout = logout + ' (' + String(arg1) + ',' + String(arg2) + ')'; }
            else { logout = logout + '  (' + String(arg1) + ',' + String(arg2) + ')'; }
            ptr = ptr + 3;
            obj.code.push(opcode);
            obj.code.push(arg1);
            obj.code.push(arg2);
        } else {
            ptr = ptr + 1;
            obj.code.push(opcode);
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
    ptr = ptr + 1; // Skipping the 's' byte
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

// Implemented bytecode functions in a CodeObject class
class CodeObject {

    // Properties of CodeObject
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
    pc: number;
    self: any;

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
        this.pc = 0;
        this.self = {};
    }

    public STOP_CODE(){
        //do nothing
        this.pc += 1;
    }
    public POP_TOP(){
        Stack.pop();
        this.pc += 1;
    }
    public ROT_TWO(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS1);
        this.pc += 1;
    }
    public ROT_THREE(){
        var TOS = Stack.pop();
        var TOS2 = Stack.pop();
        var TOS3 = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS3);
        Stack.push(TOS2);
        this.pc += 1;
    }
    public DUP_TOP(){
        var TOS = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS);
        this.pc += 1;
    }
    public ROT_FOUR(){
        var TOS = Stack.pop();
        var TOS2 = Stack.pop();
        var TOS3 = Stack.pop();
        var TOS4 = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS4);
        Stack.push(TOS3);
        Stack.push(TOS2);
        this.pc += 1;
    }
    public NOP(){
        this.pc += 1;
    }
    public UNARY_POSITIVE(){
        var TOS = Stack.pop();
        TOS = +TOS;
        Stack.push(TOS);
        this.pc += 1;
    }
    public UNARY_NEGATIVE(){
        var TOS = Stack.pop();
        TOS = -TOS;
        Stack.push(TOS);
        this.pc += 1;
    }
    public UNARY_NOT(){
        var TOS = Stack.pop();
        TOS = !TOS;
        Stack.push(TOS);
        this.pc += 1;
    }
    public UNARY_CONVERT(){
        var TOS = Stack.pop();
        TOS = String(TOS); // Not completely accurate
        Stack.push(TOS);
        this.pc += 1;
    }
    public UNARY_INVERT(){
        var TOS = Stack.pop();
        TOS = ~TOS;
        Stack.push(TOS);
        this.pc += 1;
    }
    public BINARY_POWER(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        TOS = Math.pow(TOS1,TOS);
        Stack.push(TOS);
        this.pc += 1;
    }
    //implements TOS = TOS1 * TOS
    public BINARY_MULTIPLY(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 * TOS);
        this.pc += 1;
    }
    //implements TOS = TOS1/TOS (without from_future_import division)
    public BINARY_DIVIDE(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        //*** need to make this so floors ints & longs but gives approx with floats or complex ***/
        Stack.push(TOS1/TOS);
        this.pc += 1;

    }
    //implements TOS = TOS1 % TOS
    public BINARY_MODULO(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 % TOS);
        this.pc += 1;
    }
    //implemsnts TOS = TOS1 + TOS
    public BINARY_ADD(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 + TOS);
        this.pc += 1;
    }
    //implements TOS = TOS1 - TOS
    public BINARY_SUBTRACT(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 - TOS);
        this.pc += 1;
    }
    //implements TOS = TOS1[TOS]
    public BINARY_SUBSCR(){
        this.pc += 1;
    }
    //implements TOS = TOS1 // TOS
    public BINARY_FLOOR_DIVIDE(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(Math.floor(TOS1/TOS));
        this.pc += 1;
    }
    //implements TOS = TOS1/TOS (with from_future_import division)
    public BINARY_TRUE_DIVIDE(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1/TOS);
        this.pc += 1;
    }
    //DIFFERENCE OF THESE FROM BINARY?
    public INPLACE_FLOOR_DIVIDE(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(Math.floor(TOS1/TOS));
        this.pc += 1;
    }
    //with from_future_import division
    public INPLACE_TRUE_DIVIDE(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1/TOS);
        this.pc += 1;
    }
    // Implements TOS[:] = TOS1
    public SLICE_0(){ 
        var TOS = Stack.pop();
        Stack.push(TOS.slice(0,TOS.length));
        this.pc += 1;
    }
    //Implements TOS1[TOS:] = TOS2
    public SLICE_1(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1.slice(TOS,TOS1.length));
        this.pc += 1;
    }
    public SLICE_2(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1.slice(0,TOS));
        this.pc += 1;
    }
    public SLICE_3(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        var TOS2 = Stack.pop();
        Stack.push(TOS2.slice(TOS1,TOS));
        this.pc += 1;
    }
    public STORE_SLICE_0(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        for (var i=0; i<TOS.length; i++) { TOS[i] = TOS1[i]; }
        Stack.push(TOS);
        this.pc += 1; 
    }
    public STORE_SLICE_1(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        var TOS2 = Stack.pop();
        for (var i=TOS; i<TOS1.length; i++) { TOS1[i] = TOS2[i-TOS]; }
        Stack.push(TOS1);
        this.pc += 1;
    }
    public STORE_SLICE_2(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        var TOS2 = Stack.pop();
        for (var i=0; i<TOS; i++) { TOS1[i] = TOS2[i]; }
        Stack.push(TOS1);
        this.pc += 1;
    }
    public STORE_SLICE_3(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        var TOS2 = Stack.pop();
        var TOS3 = Stack.pop();
        for (var i=TOS1; i<TOS; i++) { TOS2[i] = TOS3[i-TOS1]; }
        Stack.push(TOS2);
        this.pc += 1;
    }
    public DELETE_SLICE_0(){
        var TOS = Stack.pop();
        TOS.splice(0,TOS.length);
        Stack.push(TOS);
        this.pc += 1;
    }
    public DELETE_SLICE_1(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        TOS1.splice(TOS,TOS1.length);
        Stack.push(TOS1);
        this.pc += 1;
    }
    public DELETE_SLICE_2(){ 
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        TOS1.splice(0,TOS);
        Stack.push(TOS1);
        this.pc += 1;
    }
    public DELETE_SLICE_3(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        var TOS2 = Stack.pop();
        TOS2.splice(TOS1,TOS);
        Stack.push(TOS2);
        this.pc += 1;
    }
    public STORE_MAP(){
        var val = Stack.pop();
        var key = Stack.pop();
        var dic = Stack.pop();
        dic[key] = val;
        Stack.push(dic);
        this.pc += 1; 
    } public INPLACE_ADD(){ 
        Stack.push(Stack.pop() + Stack.pop());
        this.pc += 1; 
    }
    public INPLACE_SUBTRACT(){ 
        Stack.push(Stack.pop() - Stack.pop());
        this.pc += 1;
    }
    public INPLACE_MULTIPY(){ 
        Stack.push(Stack.pop() * Stack.pop());
        this.pc += 1; 
    }
    //without from_future_import division
    public INPLACE_DIVIDE(){ 
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        //*** need to make this so floors ints & longs but gives approx with floats or complex ***/
        Stack.push(TOS1/TOS);
        this.pc += 1; 
    }
    public INPLACE_MODULO(){ 
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 % TOS);
        this.pc += 1; 
    }
    public STORE_SUBSCR(){ 
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        var TOS2 = Stack.pop();
        TOS1[TOS] = TOS2;
        this.pc += 1; 
    }
    public DELETE_SUBSCR(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        delete TOS1[TOS];
        this.pc += 1; 
    }
    public BINARY_LSHIFT(){ 
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 << TOS);
        this.pc += 1; 
    }
    public BINARY_RSHIFT(){ 
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 >> TOS);
        this.pc += 1; 
    }
    public BINARY_AND(){ 
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push((TOS1 && TOS));
        this.pc += 1; 

    }
    public BINARY_XOR(){ 
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push((TOS1 ? 1 : 0) ^ (TOS ? 1 : 0));
        this.pc += 1;  
    }
    public BINARY_OR(){ 
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push((TOS1 || TOS));
        this.pc += 1;
    }
    public INPLACE_POWER(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        TOS = Math.pow(TOS1,TOS);
        Stack.push(TOS); 
        this.pc += 1; 
    }
    public GET_ITER(){
        var TOS = Stack.pop()
        var TOS = TOS.iter();
        Stack.push(TOS);
        this.pc += 1;
    }
    public PRINT_EXPR(){ 
        var TOS = Stack.pop();
        console.log('LOGGED TO CONSOLE: --------------------- '+TOS);
        this.pc += 1; 
    }
    public PRINT_ITEM(){
        var TOS = Stack.pop();
        console.log('LOGGED TO CONSOLE: --------------------- '+TOS);
        this.pc += 1;
    }
    public PRINT_NEWLINE(){
        console.log('LOGGED TO CONSOLE: --------------------- '); // or process.stdout.write('\n');
        this.pc += 1;
    }
    public PRINT_ITEM_TO(){ 
        this.pc += 1; 
    }
    public PRINT_NEWLINE_TO(){ 
        this.pc += 1; 
    }
    public INPLACE_LSHIFT(){ 
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 << TOS);
        this.pc += 1; 
    }
    public INPLACE_RSHIFT(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1 >> TOS); 
        this.pc += 1; 
    }
    public INPLACE_AND(){ 
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push((TOS1 && TOS));
        this.pc += 1; 
    }
    public INPLACE_XOR(){ 
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push((TOS1 ? 1 : 0) ^ (TOS ? 1 : 0));
        this.pc += 1; 
    }
    public INPLACE_OR(){
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push((TOS1 || TOS)); 
        this.pc += 1; 
    }
    public BREAK_LOOP(){ 
        this.pc += 1; 
    }
    public WITH_CLEANUP(){ 
        this.pc += 1; 
    }
    public LOAD_LOCALS(){ 
        var locals = {};
        for (var i=0; i<this.names.length; i++){
            var name = this.names[i];
            if (typeof name === 'string') { locals[name] = null; }
            else if (name instanceof internedString) { locals[byteObject.interned_list[name.index]] = null; }
            else if (name instanceof FunctionObject) { locals[name.func_name] = name; }
            else console.log('problems with LOAD_LOCALS');
        }
        Stack.push(locals);
        this.pc += 1;
    }
    // Returns TOS to the caller function
    public RETURN_VALUE(){
        this.returnedValue = Stack.pop();
        this.pc += 1;
    }
    // Implements 'from module import *'
    public IMPORT_STAR(){ 
        this.pc += 1; 
    }
    public EXEC_STMT(){ 
        this.pc += 1; 
    }
    public YIELD_VALUE(){ 
        this.pc += 1; 
    }
    public POP_BLOCK(){ 
        this.pc += 1; 
    }
    public END_FINALLY(){ 
        this.pc += 1; 
    }
    // Creates a new class object
    public BUILD_CLASS(){
        //methods dictionary
        var TOS = Stack.pop();
        //tuple of the names for base classes
        var TOS1 = Stack.pop();
        //the class name
        var TOS2 = Stack.pop();
        var newClass = new classObject(TOS2,TOS1,TOS);
        Stack.push(newClass);
        this.pc += 1; 
     }

    /****** Opcodes from here have an argument obtained by accessing the byte code ******/

    public STORE_NAME(){
        var index = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var name = Stack.pop();
        this.names[index] = name;
        this.pc += 3;
    }
    public DELETE_NAME(){ 
        var index = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        this.names.splice(index,1); 
        this.pc += 3; 
    } 
    public UNPACK_SEQUENCE(){
        var numItems = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var TOS = Stack.pop();
        for (var i=numItems-1; i>=0; i--) { Stack.push(TOS[i]); }
        this.pc += 3;
    } 
      public FOR_ITER(){
        var incrCounter = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2]; 
        var TOS = Stack.pop();
        //if(!(TOS instanceof Iterator)){
            //if(TOS instanceof List){
                //TOS = new Iterator(TOS)
            //}
        //}
        var newVal = TOS.next();
        if(newVal != -1){
            Stack.push(TOS);
            Stack.push(newVal); 
            this.pc += 3;
       }else{
            this.pc += incrCounter + 3;
       }
       
    }
    public LIST_APPEND(){
        var value = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2]; 

        this.pc += 3;
    }
    public STORE_ATTR(){
        var index = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        var attr = this.names[index];
        if (attr instanceof internedString) { attr = byteObject.interned_list[attr.index]; }
        if (TOS=='self') { this.self[attr] = TOS1; }
        else { TOS[attr] = TOS1; }
        this.pc += 3;
    }
    public DELETE_ATTR(){
        var index = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var TOS = Stack.pop();
        delete TOS[this.names[index]];
        this.pc += 3;
    }
    public STORE_GLOBAL(){
        var index = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var name = Stack.pop();
        this.names[index] = name;
        this.pc += 3;
    }
    public DELETE_GLOBAL(){
        var index = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        this.names.splice(index,1); 
        this.pc += 3; 
    }
    public DUP_TOPX(){
        var numItemsDup = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var dupItems = []
        if (numItemsDup <= 5) {
            for (var i=0; i<numItemsDup; i++) {
                dupItems[i] = Stack.pop();
            }
            for (i=numItemsDup; i>=0; i--) {
                Stack.push(dupItems[i]);
                Stack.push(dupItems[i]);
            }
        } else { console.log('Warning: Number of items to duplicate is greater than 5.')}
        this.pc += 3;
    }
    public LOAD_CONST(){
        var index = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        Stack.push(this.consts[index]);
        this.pc += 3;
    }
    public LOAD_NAME(){
        var index = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var name = this.names[index];
        if (name instanceof internedString) { Stack.push(byteObject.interned_list[name.index]); }
        else { Stack.push(name); }
        this.pc += 3;
    }
    public BUILD_TUPLE(){
        var numItems = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var tuple = [];
        for (var i=0; i<numItems; i++) {
            tuple[i] = Stack.pop();
        }
        Stack.push(tuple);
        this.pc += 3;
    } 
    public BUILD_LIST(){ 
        var numItems = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var list = [];
        for (var i=0; i<numItems; i++) {
            list[i] = Stack.pop();
        }
        Stack.push(list);
        this.pc += 3; 
    } 
    public BUILD_SET(){// NOT ON PYTHON DISASSEMBLE SITE //////////////////////////////////////////////////////////////////////////////////////////////
        var numItems = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        this.pc += 3;
    }
    public BUILD_MAP(){ 
        var numnumEntries = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2]; 
        Stack.push({}); // ignoring num entries for now
        this.pc += 3; 
    } 
    public LOAD_ATTR(){ 
        var index = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var attr = this.names[index];
        console.log('attr='+attr);
        if (attr instanceof internedString) { attr = byteObject.interned_list[attr.index]; console.log('interned version='+attr); }
        var TOS = Stack.pop();
        console.log('TOS='+TOS);
        if (TOS=='self') { Stack.push(this.self[attr]); }
        else if (TOS instanceof classObject) { Stack.push(TOS.methods[attr]); }
        else { Stack.push(TOS[attr]); }
        this.pc += 3;
    }
    public COMPARE_OP(){ //comparison operator
        var opname = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var cmp_op = ['<', '<=', '==', '!=', '>', '>=', 'in', 'not in', 'is', 'is not', 'exception match', 'BAD'];
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        if (cmp_op[opname] == '<') { Stack.push(TOS<TOS1); }
        if (cmp_op[opname] == '<=') { Stack.push(TOS<=TOS1); }
        if (cmp_op[opname] == '==') { Stack.push(TOS==TOS1); }
        if (cmp_op[opname] == '!=') { Stack.push(TOS!=TOS1); }
        if (cmp_op[opname] == '>') { Stack.push(TOS>TOS1); }
        if (cmp_op[opname] == '<=') { Stack.push(TOS>=TOS1); }
        if (cmp_op[opname] == 'in') { Stack.push(TOS in TOS1); }
        if (cmp_op[opname] == 'not in') { Stack.push(!(TOS in TOS1)); }
        if (cmp_op[opname] == 'is') { Stack.push(TOS==TOS1); }
        if (cmp_op[opname] == 'is not') { Stack.push(TOS!=TOS1); }
        if (cmp_op[opname] == 'exception match') { Stack.push(TOS==TOS1); }
        if (cmp_op[opname] == 'BAD') { Stack.push(TOS==TOS1); } // NO IDEA
        this.pc += 3;
    } 
    public IMPORT_NAME (){ 
        var index = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2]; 
        this.pc += 3; 
    }
    public IMPORT_FROM(){ 
        var index = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2]; 
        this.pc += 3; 
    } 
    public JUMP_FORWARD(){
        var delta = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        this.pc += delta + 3;
    }
    public JUMP_IF_FALSE_OR_POP(){
        var target = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var TOS = Stack.pop();
        if (!TOS) { this.pc = target; Stack.push(TOS); }
        else { this.pc += 3; }
    } 
    public JUMP_IF_TRUE_OR_POP(){
        var target = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var TOS = Stack.pop();
        if (TOS) { this.pc = target; Stack.push(TOS); }
        else { this.pc += 3; }
    } 
    public JUMP_ABSOLUTE(){
        var target = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        this.pc = target;
    }
    public POP_JUMP_IF_FALSE(){
        var target = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var TOS = Stack.pop();
        if (!TOS) { this.pc = target; }
        else { this.pc += 3; }
    } 
    public POP_JUMP_IF_TRUE(){
        var target = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var TOS = Stack.pop();
        console.log(TOS);
        if (TOS) { this.pc = target; }
        else { this.pc += 3; }
    } 
    public LOAD_GLOBAL(){ 
        var index = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2]; 
        Stack.push(this.names[index])
        this.pc += 3; 
    } 
    public CONTINUE_LOOP(){
        //start of loop(absolute)
        var start = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2]; 
        this.pc += 3; 
    }
    public SETUP_LOOP(){ 
        //target address(relative)
        var addr = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2]; 
        this.pc += 3; 
    }
    public SETUP_EXCEPT(){ 
        //target address(relative)
        var addr = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2]; 
        this.pc += 3; 
    }
    public SETUP_FINALLY(){
        //target address(relative)
        var addr = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2]; 
        this.pc += 3; 
    }
    public LOAD_FAST(){
        //local variable number
        var varNum = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var item = this.varnames[varNum];
        if (item instanceof internedString) { Stack.push(byteObject.interned_list[item.index]); }
        else { Stack.push(item); }
        this.pc += 3;
        console.log(this.varnames);
    } 
    public STORE_FAST(){
        var varNum = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        this.varnames[varNum] = Stack.pop();
        this.pc += 3;
    } 
    public DELETE_FAST(){
        var varNum = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        delete this.varnames[varNum];
        this.pc += 3; 
    } 
    public RAISE_VARARGS(){ 
        //number of raise arguments(1,2 or 3)
        var numArg = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var args = []
        for (var i=0; i<numArg; i++) {
            args[i] = Stack.pop();
        }
        if (numArg == 0) { throw 'Exception Error'; }
        if (numArg == 1) { throw 'Exception Error: '+args[0].toString(); }
        if (numArg == 2) { throw 'Exception Error: '+args[0].toString()+', Parameters: '+args[1].toString(); }
        if (numArg == 3) { throw 'Exception Error: '+args[0].toString()+', Parameters: '+args[1].toString()+', Traceback: '+args[2].toString(); }
        this.pc += 3; 
    } 
    /* CALL_FUNCTION_XXX opcodes defined below depend on this definition */
    public CALL_FUNCTION(){
        // Parse Operand Bytecode
        // argc is the operand from the bytecode (low bit = number of positional args, high bit = number of keyword args)
        var numArgs = this.code[this.pc+1]; // # of positional args
        var numKwargs = this.code[this.pc+2]; // # of keyword args
        // Retrieve arguments from Stack and add to varnames
        var args = [];
        var kwargs = [];
        for (var i=0; i< numKwargs; i++){ var val = Stack.pop(); kwargs[i] = [Stack.pop(),val]; } // grab keyword args off stack first
        for (i=0; i< numArgs; i++) { args[numArgs-1-i] = Stack.pop(); } // next grab positional args, args[0] = leftmost argument
        var function_object = Stack.pop(); // last grab function object
        var isClass = (function_object instanceof classObject);
        if (isClass) {
            var class_object = function_object;
            console.log('class methods: '+class_object.methods+'-----------------------------');
            // var self = class_object.self;
            for (var methodKey in class_object.methods) {
                console.log('found a method');
                var method = class_object.methods[methodKey];
                console.log('method: '+method);
                if (method instanceof FunctionObject) {
                    console.log('found a method function object');
                    method.func_code.self = class_object.self;
                    console.log('test');
                    method.func_code.self.a = 5;
                    console.log(method.func_code.self);
                    console.log(class_object.self);
                }
            }
            function_object = class_object.methods['__init__'];
            console.log('got here');
            // OBJECTS ALWAYS PASS SELF object AS FIRST ARGUMENT & UPDATE CHANGES TO SELF IN CLASS OBJECT BEFORE RESET VARNAMES BY INSPECTING VARNAMES[0] - hope varnames[0] doesn't get overwritten at any point
            //  args.unshift('self');
            // console.log(function_object.func_defaults);
        }
        // Replace function object's variable names with arguments from Stack & default arguments
        var varnamesOriginal = function_object.func_code.varnames.slice(0); // record varnames for later use and set to empty list
        console.log(varnamesOriginal);
        function_object.func_code.varnames = [];
        var argcount = function_object.func_code.argcount;
        // Keyword argument variables
        for (var i=0; i< numKwargs; i++) {
            var key = kwargs[i][0];
            if (key instanceof internedString) {
                key = byteObject.interned_list[key.index];
            }
            console.log('key='+key);
            // find key in varnames and set it equal to kwargs[i][1]
            var keyFound = false;
            for (var j=0; j<varnamesOriginal.length; j++) {
                var varnamesKey = varnamesOriginal[j];
                if (varnamesKey instanceof internedString) { varnamesKey = byteObject.interned_list[varnamesKey.index]; }
                console.log('varnames key='+varnamesKey);
                if ((key == varnamesKey) && (!keyFound)) {
                    function_object.func_code.varnames[j] = kwargs[i][1];
                    console.log('setting kwarg in varnames');
                    keyFound = true;
                }
            }
        }
        console.log(function_object.func_code.varnames);
        // If it's a class object, put 'self' in position zero
        if (isClass) { function_object.func_code.varnames[0] = 'self'; }
        //Fill up remaining variable names using the positional arguments
        var counter = 0;
        for (i=0; i< argcount; i++) {
            if ((function_object.func_code.varnames[i] == undefined) && (counter < args.length)) {
                function_object.func_code.varnames[i] = args[counter];
                counter += 1;
            }
        }
        console.log(function_object.func_code.varnames);
        // Get default values for any unspecified variable left
        counter = function_object.func_defaults.length;
        for (i=argcount-1; i>=0; i--) {
            if ((function_object.func_code.varnames[i] == undefined) && (counter > 0)) {
                function_object.func_code.varnames[i] = function_object.func_defaults[counter-1];
                counter -= 1;
            }
        }
        console.log(function_object.func_code.varnames);
        // Add back in any original values from varnames for stuff that is still undefined
        for (i=0;i<varnamesOriginal.length;i++) {
            if (function_object.func_code.varnames[i] == undefined) {
                function_object.func_code.varnames[i] = varnamesOriginal[i];
            }
        }
        console.log(function_object.func_code.varnames);
        // Execute the function's bytecode
        while (function_object.func_code.pc < function_object.func_code.code.length){
            // op code
            var opcode = function_object.func_code.code[function_object.func_code.pc];
            // call opcode
            console.log(OpCodeList[opcode]);
            function_object.func_code[OpCodeList[opcode]]();
            console.log(Stack);
        }
        // Update class objects self field with that found in function_object.func_code.self
        if (isClass) {
            for (var key2 in function_object.func_code.self) {
                console.log('func_code.self key: '+function_object.func_code.self[key2]);
            }
            for (var key3 in class_object.self) {
                console.log('class_object.self key: '+class_object.self[key3]);
            }
            // console.log('func_code.self='+function_object.func_code.self);
            // console.log('class_object.self='+class_object.self);
            // class_object.self = function_object.func_code.self;
            Stack.push(class_object);
        }
        // Reset varnames
        function_object.func_code.varnames = varnamesOriginal.slice(0);
        // Push the return value onto the stack (could be a None? value)
        if (!(function_object.func_code.returnedValue === null)) { Stack.push(function_object.func_code.returnedValue); }
        // Reset function object's counter
        function_object.func_code.pc = 0;
        // Increment parent's program counter
        this.pc += 3;
    }
    public MAKE_FUNCTION(){
        //number of defaults found below TOS
        var argc = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var code_object = Stack.pop();
        var defaults = [];
        for (var i=0; i<argc; i++) { defaults[i] = Stack.pop(); }
        var newFunction = new FunctionObject(code_object,defaults);
        var funName = code_object.name;
        if (funName instanceof internedString) { newFunction.func_name = byteObject.interned_list[funName.index]; }
        else { newFunction.func_name = funName; }
        if (code_object.consts.length > 0){
            var doc_string = code_object.consts[0];
            if (typeof doc_string == 'string' || doc_string instanceof String){
                newFunction.func_doc = doc_string; // not fool proof but better than nothing
            }
        }
        Stack.push(newFunction);
        this.pc += 3;
    }
    public BUILD_SLICE(){
        var numItems = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        if (numItems == 2) { Stack.push([TOS1,TOS]); }
        if (numItems == 3) { Stack.push([Stack.pop(),TOS1,TOS]); }
        this.pc += 3; 
    } 
    public MAKE_CLOSURE(){ 
        // creates a new function object sets its freevars
        var argc = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var code_object = Stack.pop();
        var cells = Stack.pop();
        var defaults = [];
        for (var i=0; i<argc; i++) { defaults[i] = Stack.pop(); }
        var newFunction = new FunctionObject(code_object,defaults);
        newFunction.func_closure = cells; // don't know what this is for
        for (i=0; i<cells.length; i++) { newFunction.func_code.freevars[i] = cells[i]; }
        Stack.push(newFunction);
        this.pc += 3; 
    } 
    public LOAD_CLOSURE(){ //http://www.programering.com/a/MzM0EjMwATY.html
        //load from cellvars
        var index = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        if (index < this.cellvars.length) { Stack.push(this.cellvars[index]); }
        else { Stack.push(this.freevars[this.cellvars.length-index]); }
        this.pc += 3;
    }
    public LOAD_DEREF(){
        //load from freevars
        var index = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2]; 
        Stack.push(this.freevars[index]);
        this.pc += 3; 
    }
    //Stores TOS into the cell contained in slot i of the cell and free variable storage.
    public STORE_DEREF(){ 
        //store in cellvars
        var index = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var TOS = Stack.pop(); 
        this.cellvars[index] = TOS;
        this.pc += 3; 
    } 
    /* The next 3 opcodes must be contiguous and satisfy
       (CALL_FUNCTION_VAR - CALL_FUNCTION) & 3 == 1  */
    public CALL_FUNCTION_VAR(){
        //number args + (number kwargs<<8)
        var argc = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2]; 
        this.pc += 3; 
    } 
    public CALL_FUNCTION_KW(){
        //number args + (number kwargs<<8)
        var argc = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2]; 
        this.pc += 3;
    } 
    public CALL_FUNCTION_VAR_KW(){ 
        //number args + (number kwargs<<8)
        var argc = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2]; 
        this.pc += 3; 
    }

    public SETUP_WITH(){ 
        var delta = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2]; 
        this.pc += 3;
    }
    /* Support for opargs more than 16 bits long */
    public EXTENDED_ARG(){
        var ext = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        this.pc += 3; 
    }
    /***** have to determine what type of arguments these take *****/
    public SET_ADD(){ 
        this.pc += 3; 
    }
    public MAP_ADD(){ 
        this.pc += 3; 
    }
}

// Defines class object
class classObject{
    name: string;
    bases: any;
    methods: any;
    self: any;
    // maybe add a 'self' property here to hold all the variables? should default to this.self = {} + methods should have func_globals set to self

    constructor(name: string, bases: any, methods: any) { this.name = name; this.bases = bases; this.methods = methods; this.self = {}; }
}

// Defines class for a function object
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

//Iterator object implemented to use for Python iterators
class Iterator{
    curIndex: number;
    high: number;

    //pass in the bounds 
    constructor(low:number, high:number){
        this.curIndex = low;
        this.high = high;
    }
    //returns itself
    iter(){
        return this;
    }
    //returns next element or StopIteration if nothing is left
    next(){
        if(this.curIndex > this.high){
            //stop iteration
            return -1;
        }else{
            this.curIndex += 1;
            return (this.curIndex - 1); 
        }
    }
}

/** Parses given bytecode object whose first 8 bytes are expected to be
    the magic number(Python verison) and a timestamp for the file **/
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
function execBytecode(){               
    // Execute all Op Codes
    while (byteObject.code_object.pc < byteObject.code_object.code.length){
        // Retrieve only the op code
        var opcode = byteObject.code_object.code[byteObject.code_object.pc];
        console.log(OpCodeList[opcode]);
        byteObject.code_object[OpCodeList[opcode]]();
        console.log(Stack);
    }
}

// First function called to parse and exectute bytecode
function interpretBytecode(bytecode:NodeBuffer) {
    // Parse Bytecode and Return Op Codes:
    if (parseBytecode(bytecode)) {
        console.log(byteObject.interned_list);
        // Execute the initial opcodes in the code object
        execBytecode();
    }
}

// Initalize the stack object
var Stack = [];

// Initalize object to store information of various types 
var byteObject:any = {};

// Dictionary of potential types to be read
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

// Enum list of all opcodes
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

// Main function to read in file
var fs = require('fs');
fs.readFile(process.argv[2], function doneReading(err, bytecode) {
    if (err)
        throw err;
    interpretBytecode(bytecode);
});
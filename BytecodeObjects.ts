/// <reference path="Globals.ts" />
/// <reference path="Log.ts" />

class Block {

    delta: number;
    start: number;
    end: number;

    constructor(delta: number, start: number) { this.delta = delta; this.start = start; this.end = start + delta -1; }
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
    BlockStack: any;

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
        this.BlockStack = [];
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
        TOS = TOS.toString(); // Not completely accurate
        Stack.push(TOS);
        this.pc += 1;
    }
    public UNARY_INVERT(){
        var TOS = Stack.pop();
        TOS = ~TOS; //python does not invert complex numbers
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
        Stack.push(TOS1 + TOS); //Math.add(TOS1,TOS)
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
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS1[TOS]);
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
        if (isVerbose) {
            printToOutput('LOGGED TO CONSOLE: --------------------- '+TOS,false);
        } else {
            printToOutput(TOS,true,true);
        }
        this.pc += 1; 
    }
    public PRINT_ITEM(){
        var TOS = Stack.pop();
        if (TOS instanceof internedString) { TOS = byteObject.interned_list[TOS.index]; }
        if (isVerbose) {
            printToOutput('LOGGED TO CONSOLE: --------------------- '+TOS,false);
        } else {
            printToOutput(TOS,true,true);
        }
        this.pc += 1;
    }
    public PRINT_NEWLINE(){
        if (isVerbose) {
            printToOutput('LOGGED TO CONSOLE: --------------------- ',false);
        } else {
            printToOutput('\n',true,true);
        }
        this.pc += 1;
    }
    public PRINT_ITEM_TO(){ 
        if (isVerbose) {
            printToOutput('NOT WORKING - SHOULD PRINT TO FILE: --------------------- ',false);
        } else {
            printToOutput('<PRINT_ITEM_TO> NOT FUNCTIONAL',true,true);
        }
        this.pc += 1; 
    }
    public PRINT_NEWLINE_TO(){ 
        if (isVerbose) {
            printToOutput('NOT WORKING - SHOULD PRINT NEWLINE TO FILE: --------------------- ',false);
        } else {
            printToOutput('<PRINT_NEWLINE_TO> NOT FUNCTIONAL',true,true);
        }
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
        //move the program to the end of the block by going ahead the size of the block
        var block = this.BlockStack.pop();
        this.pc = block.end;
        this.BlockStack.push(block); 
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
            else printToOutput('problems with LOAD_LOCALS');
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
        this.BlockStack.pop();
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
        //     if(TOS instanceof Array || TOS instanceof String){
        //         TOS = new Iterator(0, TOS.length);
        //     }else if(TOS instanceof Object){
        //         TOS = new Iterator(0, TOS.size);
        //     }
        // }
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
        } else { printToOutput('Warning: Number of items to duplicate is greater than 5.')}
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
        Stack.push({}); // ignoring num entries for now - javascript doesn't presize anything
        this.pc += 3; 
    } 
    public LOAD_ATTR(){ 
        var index = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var attr = this.names[index];
        printToOutput('attr='+attr);
        if (attr instanceof internedString) { attr = byteObject.interned_list[attr.index]; printToOutput('interned version='+attr); }
        var TOS = Stack.pop();
        printToOutput('TOS='+TOS);
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
        if (cmp_op[opname] == '<') { Stack.push(TOS1<TOS); }
        if (cmp_op[opname] == '<=') { Stack.push(TOS1<=TOS); }
        if (cmp_op[opname] == '==') { Stack.push(TOS1==TOS); }
        if (cmp_op[opname] == '!=') { Stack.push(TOS1!=TOS); }
        if (cmp_op[opname] == '>') { Stack.push(TOS1>TOS); }
        if (cmp_op[opname] == '<=') { Stack.push(TOS1>=TOS); }
        if (cmp_op[opname] == 'in') { Stack.push(TOS1 in TOS); }
        if (cmp_op[opname] == 'not in') { Stack.push(!(TOS1 in TOS)); }
        if (cmp_op[opname] == 'is') { Stack.push(TOS1==TOS); }
        if (cmp_op[opname] == 'is not') { Stack.push(TOS1!=TOS); }
        if (cmp_op[opname] == 'exception match') { Stack.push(TOS1==TOS); }
        if (cmp_op[opname] == 'BAD') { Stack.push(TOS1==TOS); } // NO IDEA
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
        printToOutput(TOS);
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
        this.pc = start; 
    }
    public SETUP_LOOP(){ 
        //pushes block of size delta bytes
        var delta = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var start = this.pc + 3;
        var block = new Block(delta,start);
        this.BlockStack.push(block);
        this.pc += 3; 
    }
    public SETUP_EXCEPT(){ 
        //target address(relative)
        var delta = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var start = this.pc + 3;
        var block = new Block(delta,start);
        this.BlockStack.push(block);
        this.pc += 3; 
    }
    public SETUP_FINALLY(){
        //target address(relative)
        var delta = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2]; 
        var start = this.pc + 3;
        var block = new Block(delta,start);
        this.BlockStack.push(block);
        this.pc += 3; 
    }
    public LOAD_FAST(){
        //local variable number
        var varNum = this.code[this.pc+1] + Math.pow(2,8)*this.code[this.pc+2];
        var item = this.varnames[varNum];
        if (item instanceof internedString) { Stack.push(byteObject.interned_list[item.index]); }
        else { Stack.push(item); }
        this.pc += 3;
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
            for (var methodKey in class_object.methods) {
                var method = class_object.methods[methodKey];
                if (method instanceof FunctionObject) {
                    method.func_code.self = class_object.self;
                }
            }
            function_object = class_object.methods['__init__'];
        }
        // Replace function object's variable names with arguments from Stack & default arguments
        var varnamesOriginal = function_object.func_code.varnames.slice(0); // record varnames for later use and set to empty list
        printToOutput(varnamesOriginal);
        function_object.func_code.varnames = [];
        var argcount = function_object.func_code.argcount;
        // Keyword argument variables
        for (var i=0; i< numKwargs; i++) {
            var key = kwargs[i][0];
            if (key instanceof internedString) {
                key = byteObject.interned_list[key.index];
            }
            printToOutput('key='+key);
            // find key in varnames and set it equal to kwargs[i][1]
            var keyFound = false;
            for (var j=0; j<varnamesOriginal.length; j++) {
                var varnamesKey = varnamesOriginal[j];
                if (varnamesKey instanceof internedString) { varnamesKey = byteObject.interned_list[varnamesKey.index]; }
                printToOutput('varnames key='+varnamesKey);
                if ((key == varnamesKey) && (!keyFound)) {
                    function_object.func_code.varnames[j] = kwargs[i][1];
                    printToOutput('setting kwarg in varnames');
                    keyFound = true;
                }
            }
        }
        // printToOutput(function_object.func_code.varnames);
        // If it's a class object, put 'self' in position zero
        if (isClass) { function_object.func_code.varnames[0] = 'self'; } //put 'self' where 'self' already exists in varnames
        //Fill up remaining variable names using the positional arguments
        var counter = 0;
        for (i=0; i< argcount; i++) {
            if ((function_object.func_code.varnames[i] == undefined) && (counter < args.length)) {
                function_object.func_code.varnames[i] = args[counter];
                counter += 1;
            }
        }
        // printToOutput(function_object.func_code.varnames);
        // Get default values for any unspecified variable left
        counter = function_object.func_defaults.length;
        for (i=argcount-1; i>=0; i--) {
            if ((function_object.func_code.varnames[i] == undefined) && (counter > 0)) {
                function_object.func_code.varnames[i] = function_object.func_defaults[counter-1];
                counter -= 1;
            }
        }
        // printToOutput(function_object.func_code.varnames);
        // Add back in any original values from varnames for stuff that is still undefined
        for (i=0;i<varnamesOriginal.length;i++) {
            if (function_object.func_code.varnames[i] == undefined) {
                function_object.func_code.varnames[i] = varnamesOriginal[i];
            }
        }
        // printToOutput(function_object.func_code.varnames);
        // Execute the function's bytecode
        while (function_object.func_code.pc < function_object.func_code.code.length){
            // op code
            var opcode = function_object.func_code.code[function_object.func_code.pc];
            // call opcode
            printToOutput(OpCodeList[opcode]);
            function_object.func_code[OpCodeList[opcode]]();
            printToOutput(Stack.toString());
        }
        // Update class objects self field with that found in function_object.func_code.self
        if (isClass) {
            for (var key2 in function_object.func_code.self) {
                printToOutput('func_code.self key: '+function_object.func_code.self[key2]);
            }
            for (var key3 in class_object.self) {
                printToOutput('class_object.self key: '+class_object.self[key3]);
            }
            // printToOutput('func_code.self='+function_object.func_code.self);
            // printToOutput('class_object.self='+class_object.self);
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

class internedString {
    index: number;

    constructor(index: number) { this.index = index; }
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
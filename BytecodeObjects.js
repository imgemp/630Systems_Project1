/// <reference path="Globals.ts" />
/// <reference path="Log.ts" />
/// <reference path="Arithmetic.ts" />
/// <reference path="Built_Ins.ts" />
var Block = (function () {
    function Block(delta, start, type) {
        this.delta = delta;
        this.start = start;
        this.end = start + delta - 1;
        this.type = type;
        this.flag = false;
    }
    return Block;
})();

// Implemented bytecode functions in a CodeObject class
var CodeObject = (function () {
    // BlockStack: any;
    function CodeObject() {
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
        // this.BlockStack = [];
    }
    CodeObject.prototype.STOP_CODE = function () {
        //do nothing
        this.pc += 1;
    };
    CodeObject.prototype.POP_TOP = function () {
        Stack.pop();
        this.pc += 1;
    };
    CodeObject.prototype.ROT_TWO = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS1);
        this.pc += 1;
    };
    CodeObject.prototype.ROT_THREE = function () {
        var TOS = Stack.pop();
        var TOS2 = Stack.pop();
        var TOS3 = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS3);
        Stack.push(TOS2);
        this.pc += 1;
    };
    CodeObject.prototype.DUP_TOP = function () {
        var TOS = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS);
        this.pc += 1;
    };
    CodeObject.prototype.ROT_FOUR = function () {
        var TOS = Stack.pop();
        var TOS2 = Stack.pop();
        var TOS3 = Stack.pop();
        var TOS4 = Stack.pop();
        Stack.push(TOS);
        Stack.push(TOS4);
        Stack.push(TOS3);
        Stack.push(TOS2);
        this.pc += 1;
    };
    CodeObject.prototype.NOP = function () {
        this.pc += 1;
    };
    CodeObject.prototype.UNARY_POSITIVE = function () {
        var TOS = Stack.pop();
        Stack.push(pos(TOS));
        this.pc += 1;
    };
    CodeObject.prototype.UNARY_NEGATIVE = function () {
        var TOS = Stack.pop();
        Stack.push(neg(TOS));
        this.pc += 1;
    };
    CodeObject.prototype.UNARY_NOT = function () {
        var TOS = getValue(Stack.pop());
        TOS = !TOS; /////////////////////////////////////////////////////////////////////////
        Stack.push(TOS);
        this.pc += 1;
    };
    CodeObject.prototype.UNARY_CONVERT = function () {
        var TOS = getValue(Stack.pop());
        TOS = TOS.toString(); // Not completely accurate
        Stack.push(TOS); /////////////////////////////////////////////////////////////////////////
        this.pc += 1;
    };
    CodeObject.prototype.UNARY_INVERT = function () {
        var TOS = Stack.pop();
        Stack.push(invert(TOS));
        this.pc += 1;
    };
    CodeObject.prototype.BINARY_POWER = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(pow(TOS1, TOS));
        this.pc += 1;
    };

    //implements TOS = TOS1 * TOS
    CodeObject.prototype.BINARY_MULTIPLY = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(mul(TOS1, TOS));
        this.pc += 1;
    };

    //implements TOS = TOS1/TOS (without from_future_import division)
    CodeObject.prototype.BINARY_DIVIDE = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(div(TOS1, TOS));
        this.pc += 1;
    };

    //implements TOS = TOS1 % TOS
    CodeObject.prototype.BINARY_MODULO = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(mod(TOS1, TOS));
        this.pc += 1;
    };

    //implemsnts TOS = TOS1 + TOS
    CodeObject.prototype.BINARY_ADD = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(add(TOS1, TOS)); //Math.add(TOS1,TOS)
        this.pc += 1;
    };

    //implements TOS = TOS1 - TOS
    CodeObject.prototype.BINARY_SUBTRACT = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(sub(TOS1, TOS));
        this.pc += 1;
    };

    //implements TOS = TOS1[TOS]
    CodeObject.prototype.BINARY_SUBSCR = function () {
        var TOS = getValue(Stack.pop());
        var TOS1 = getValue(Stack.pop());
        Stack.push(TOS1[TOS]); /////////////////////////////////////////////////////////////////////////
        this.pc += 1;
    };

    //implements TOS = TOS1 // TOS
    CodeObject.prototype.BINARY_FLOOR_DIVIDE = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(floordiv(TOS1, TOS));
        this.pc += 1;
    };

    //implements TOS = TOS1/TOS (with from_future_import division)
    CodeObject.prototype.BINARY_TRUE_DIVIDE = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(truediv(TOS1, TOS));
        this.pc += 1;
    };

    //DIFFERENCE OF THESE FROM BINARY?
    CodeObject.prototype.INPLACE_FLOOR_DIVIDE = function () {
        this.BINARY_FLOOR_DIVIDE();
    };

    //with from_future_import division
    CodeObject.prototype.INPLACE_TRUE_DIVIDE = function () {
        this.BINARY_TRUE_DIVIDE();
    };

    // Implements TOS[:] = TOS1
    CodeObject.prototype.SLICE_0 = function () {
        var TOS = getValue(Stack.pop());
        Stack.push(TOS.slice(0, TOS.length)); /////////////////////////////////////////////////////////////////////////
        this.pc += 1;
    };

    //Implements TOS1[TOS:] = TOS2
    CodeObject.prototype.SLICE_1 = function () {
        var TOS = getValue(Stack.pop());
        var TOS1 = getValue(Stack.pop());
        Stack.push(TOS1.slice(TOS, TOS1.length)); /////////////////////////////////////////////////////////////////////////
        this.pc += 1;
    };
    CodeObject.prototype.SLICE_2 = function () {
        var TOS = getValue(Stack.pop());
        var TOS1 = getValue(Stack.pop());
        Stack.push(TOS1.slice(0, TOS)); /////////////////////////////////////////////////////////////////////////
        this.pc += 1;
    };
    CodeObject.prototype.SLICE_3 = function () {
        var TOS = getValue(Stack.pop());
        var TOS1 = getValue(Stack.pop());
        var TOS2 = getValue(Stack.pop());
        Stack.push(TOS2.slice(TOS1, TOS)); /////////////////////////////////////////////////////////////////////////
        this.pc += 1;
    };
    CodeObject.prototype.STORE_SLICE_0 = function () {
        var TOS = getValue(Stack.pop());
        var TOS1 = getValue(Stack.pop());
        for (var i = 0; i < TOS.length; i++) {
            TOS[i] = TOS1[i];
        }
        Stack.push(TOS);
        this.pc += 1;
    };
    CodeObject.prototype.STORE_SLICE_1 = function () {
        var TOS = getValue(Stack.pop());
        var TOS1 = getValue(Stack.pop());
        var TOS2 = getValue(Stack.pop());
        for (var i = TOS; i < TOS1.length; i++) {
            TOS1[i] = TOS2[i - TOS];
        }
        Stack.push(TOS1);
        this.pc += 1;
    };
    CodeObject.prototype.STORE_SLICE_2 = function () {
        var TOS = getValue(Stack.pop());
        var TOS1 = getValue(Stack.pop());
        var TOS2 = getValue(Stack.pop());
        for (var i = 0; i < TOS; i++) {
            TOS1[i] = TOS2[i];
        }
        Stack.push(TOS1);
        this.pc += 1;
    };
    CodeObject.prototype.STORE_SLICE_3 = function () {
        var TOS = getValue(Stack.pop());
        var TOS1 = getValue(Stack.pop());
        var TOS2 = getValue(Stack.pop());
        var TOS3 = getValue(Stack.pop());
        for (var i = TOS1; i < TOS; i++) {
            TOS2[i] = TOS3[i - TOS1];
        }
        Stack.push(TOS2);
        this.pc += 1;
    };
    CodeObject.prototype.DELETE_SLICE_0 = function () {
        var TOS = getValue(Stack.pop());
        TOS.splice(0, TOS.length);
        Stack.push(TOS); /////////////////////////////////////////////////////////////////////////
        this.pc += 1;
    };
    CodeObject.prototype.DELETE_SLICE_1 = function () {
        var TOS = getValue(Stack.pop());
        var TOS1 = getValue(Stack.pop());
        TOS1.splice(TOS, TOS1.length);
        Stack.push(TOS1); /////////////////////////////////////////////////////////////////////////
        this.pc += 1;
    };
    CodeObject.prototype.DELETE_SLICE_2 = function () {
        var TOS = getValue(Stack.pop());
        var TOS1 = getValue(Stack.pop());
        TOS1.splice(0, TOS);
        Stack.push(TOS1); /////////////////////////////////////////////////////////////////////////
        this.pc += 1;
    };
    CodeObject.prototype.DELETE_SLICE_3 = function () {
        var TOS = getValue(Stack.pop());
        var TOS1 = getValue(Stack.pop());
        var TOS2 = getValue(Stack.pop());
        TOS2.splice(TOS1, TOS);
        Stack.push(TOS2); /////////////////////////////////////////////////////////////////////////
        this.pc += 1;
    };
    CodeObject.prototype.STORE_MAP = function () {
        var val = getValue(Stack.pop());
        var key = getValue(Stack.pop());
        var dic = getValue(Stack.pop());
        dic[key] = val; /////////////////////////////////////////////////////////////////////////
        Stack.push(dic);
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_ADD = function () {
        this.BINARY_ADD();
    };
    CodeObject.prototype.INPLACE_SUBTRACT = function () {
        this.BINARY_SUBTRACT();
    };
    CodeObject.prototype.INPLACE_MULTIPY = function () {
        this.BINARY_MULTIPLY();
    };

    //without from_future_import division
    CodeObject.prototype.INPLACE_DIVIDE = function () {
        this.BINARY_DIVIDE();
    };
    CodeObject.prototype.INPLACE_MODULO = function () {
        this.BINARY_MODULO();
    };
    CodeObject.prototype.STORE_SUBSCR = function () {
        var TOS = getValue(Stack.pop());
        var TOS1 = getValue(Stack.pop());
        var TOS2 = getValue(Stack.pop());
        TOS1[TOS] = TOS2; /////////////////////////////////////////////////////////////////////////
        this.pc += 1;
    };
    CodeObject.prototype.DELETE_SUBSCR = function () {
        var TOS = getValue(Stack.pop());
        var TOS1 = getValue(Stack.pop());
        delete TOS1[TOS]; /////////////////////////////////////////////////////////////////////////
        this.pc += 1;
    };
    CodeObject.prototype.BINARY_LSHIFT = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(lshift(TOS1, TOS));
        this.pc += 1;
    };
    CodeObject.prototype.BINARY_RSHIFT = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(rshift(TOS1, TOS));
        this.pc += 1;
    };
    CodeObject.prototype.BINARY_AND = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(and(TOS1, TOS));
        this.pc += 1;
    };
    CodeObject.prototype.BINARY_XOR = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(xor(TOS1, TOS));
        this.pc += 1;
    };
    CodeObject.prototype.BINARY_OR = function () {
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        Stack.push(or(TOS1, TOS));
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_POWER = function () {
        this.BINARY_POWER();
    };
    CodeObject.prototype.GET_ITER = function () {
        var TOS = getValue(Stack.pop());
        var TOS = TOS.iter();
        Stack.push(TOS); /////////////////////////////////////////////////////////////////////////
        this.pc += 1;
    };
    CodeObject.prototype.PRINT_EXPR = function () {
        var TOS = Stack.pop();
        if (isVerbose) {
            printToOutput('LOGGED TO CONSOLE: --------------------- ' + str(TOS), false);
        } else {
            printToOutput(str(TOS), true, true);
        }
        this.pc += 1;
    };
    CodeObject.prototype.PRINT_ITEM = function () {
        var TOS = Stack.pop();
        if (TOS instanceof internedString) {
            TOS = byteObject.interned_list[TOS.index];
        }
        if (isVerbose) {
            printToOutput('LOGGED TO CONSOLE: --------------------- ' + str(TOS), false);
        } else {
            printToOutput(str(TOS), true, true);
        }
        this.pc += 1;
    };
    CodeObject.prototype.PRINT_NEWLINE = function () {
        if (isVerbose) {
            printToOutput('LOGGED TO CONSOLE: --------------------- ', false);
        } else {
            printToOutput('\n', true, true);
        }
        this.pc += 1;
    };
    CodeObject.prototype.PRINT_ITEM_TO = function () {
        if (isVerbose) {
            printToOutput('NOT WORKING - SHOULD PRINT TO FILE: --------------------- ', false);
        } else {
            printToOutput('<PRINT_ITEM_TO> NOT FUNCTIONAL', true, true);
        }
        this.pc += 1;
    };
    CodeObject.prototype.PRINT_NEWLINE_TO = function () {
        if (isVerbose) {
            printToOutput('NOT WORKING - SHOULD PRINT NEWLINE TO FILE: --------------------- ', false);
        } else {
            printToOutput('<PRINT_NEWLINE_TO> NOT FUNCTIONAL', true, true);
        }
        this.pc += 1;
    };
    CodeObject.prototype.INPLACE_LSHIFT = function () {
        this.BINARY_LSHIFT();
    };
    CodeObject.prototype.INPLACE_RSHIFT = function () {
        this.BINARY_RSHIFT();
    };
    CodeObject.prototype.INPLACE_AND = function () {
        this.BINARY_ADD();
    };
    CodeObject.prototype.INPLACE_XOR = function () {
        this.BINARY_XOR();
    };
    CodeObject.prototype.INPLACE_OR = function () {
        this.BINARY_OR();
    };
    CodeObject.prototype.BREAK_LOOP = function () {
        //move the program to the end of the block by going ahead the size of the block
        var block = BlockStack.pop();
        this.pc = block.end;
        BlockStack.push(block);
    };
    CodeObject.prototype.WITH_CLEANUP = function () {
        this.pc += 1;
    };
    CodeObject.prototype.LOAD_LOCALS = function () {
        var locals = {};
        for (var i = 0; i < this.names.length; i++) {
            var name = this.names[i];
            if (typeof name === 'string') {
                locals[name] = null;
            } else if (name instanceof internedString) {
                locals[byteObject.interned_list[name.index]] = null;
            } else if (name instanceof FunctionObject) {
                locals[name.func_name] = name;
            } else
                printToOutput('problems with LOAD_LOCALS');
        }
        Stack.push(locals);
        this.pc += 1;
    };

    // Returns TOS to the caller function
    CodeObject.prototype.RETURN_VALUE = function () {
        this.returnedValue = Stack.pop();
        this.pc += 1;
    };

    // Implements 'from module import *'
    CodeObject.prototype.IMPORT_STAR = function () {
        this.pc += 1;
    };
    CodeObject.prototype.EXEC_STMT = function () {
        this.pc += 1;
    };
    CodeObject.prototype.YIELD_VALUE = function () {
        this.pc += 1;
    };
    CodeObject.prototype.POP_BLOCK = function () {
        var block = BlockStack.pop();
        if (block.flag) {
            this.pc = block.end + 1;
            Stack.push(block.value);
        } else {
            this.pc += 1;
        }
    };
    CodeObject.prototype.END_FINALLY = function () {
        this.pc += 1;
    };

    // Creates a new class object
    CodeObject.prototype.BUILD_CLASS = function () {
        //methods dictionary
        var TOS = Stack.pop();

        //tuple of the names for base classes
        var TOS1 = Stack.pop();

        //the class name
        var TOS2 = Stack.pop();
        var newClass = new classObject(TOS2, TOS1, TOS);
        Stack.push(newClass);
        this.pc += 1;
    };

    /****** Opcodes from here have an argument obtained by accessing the byte code ******/
    CodeObject.prototype.STORE_NAME = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var name = Stack.pop();
        this.names[index] = name;
        this.pc += 3;
    };
    CodeObject.prototype.DELETE_NAME = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.names.splice(index, 1);
        this.pc += 3;
    };
    CodeObject.prototype.UNPACK_SEQUENCE = function () {
        var numItems = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();
        for (var i = numItems - 1; i >= 0; i--) {
            Stack.push(TOS[i]);
        }
        this.pc += 3;
    };
    CodeObject.prototype.FOR_ITER = function () {
        var incrCounter = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();

        //if(!(TOS instanceof Iterator)){
        //     if(TOS instanceof Array || TOS instanceof String){
        //         TOS = new Iterator(0, TOS.length);
        //     }else if(TOS instanceof Object){
        //         TOS = new Iterator(0, TOS.size);
        //     }
        // }
        var newVal = TOS.next();
        if (newVal != -1) {
            Stack.push(TOS);
            Stack.push(newVal);
            this.pc += 3;
        } else {
            this.pc += incrCounter + 3;
        }
    };
    CodeObject.prototype.LIST_APPEND = function () {
        var value = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.STORE_ATTR = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        var attr = this.names[index];
        if (attr instanceof internedString) {
            attr = byteObject.interned_list[attr.index];
        }
        if (TOS == 'self') {
            this.self[attr] = TOS1;
        } else {
            TOS[attr] = TOS1;
        }
        this.pc += 3;
    };
    CodeObject.prototype.DELETE_ATTR = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();
        delete TOS[this.names[index]];
        this.pc += 3;
    };
    CodeObject.prototype.STORE_GLOBAL = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var name = Stack.pop();
        this.names[index] = name;
        this.pc += 3;
    };
    CodeObject.prototype.DELETE_GLOBAL = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.names.splice(index, 1);
        this.pc += 3;
    };
    CodeObject.prototype.DUP_TOPX = function () {
        var numItemsDup = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var dupItems = [];
        if (numItemsDup <= 5) {
            for (var i = 0; i < numItemsDup; i++) {
                dupItems[i] = Stack.pop();
            }
            for (i = numItemsDup; i >= 0; i--) {
                Stack.push(dupItems[i]);
                Stack.push(dupItems[i]);
            }
        } else {
            printToOutput('Warning: Number of items to duplicate is greater than 5.');
        }
        this.pc += 3;
    };
    CodeObject.prototype.LOAD_CONST = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        printToOutput('index=' + index.toString());
        Stack.push(this.consts[index]);
        printToOutput(this.consts[index]);
        this.pc += 3;
    };
    CodeObject.prototype.LOAD_NAME = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var name = this.names[index];
        if (name instanceof internedString) {
            Stack.push(byteObject.interned_list[name.index]);
        } else {
            Stack.push(name);
        }
        this.pc += 3;
    };
    CodeObject.prototype.BUILD_TUPLE = function () {
        var numItems = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var tuple = [];
        for (var i = 0; i < numItems; i++) {
            tuple[i] = Stack.pop();
        }
        Stack.push(tuple);
        this.pc += 3;
    };
    CodeObject.prototype.BUILD_LIST = function () {
        var numItems = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var list = [];
        for (var i = 0; i < numItems; i++) {
            list[i] = Stack.pop();
        }
        Stack.push(list);
        this.pc += 3;
    };
    CodeObject.prototype.BUILD_SET = function () {
        var numItems = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.BUILD_MAP = function () {
        var numnumEntries = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        Stack.push({}); // ignoring num entries for now - javascript doesn't presize anything
        this.pc += 3;
    };
    CodeObject.prototype.LOAD_ATTR = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var attr = this.names[index];
        printToOutput('attr=' + attr);
        if (attr instanceof internedString) {
            attr = byteObject.interned_list[attr.index];
            printToOutput('interned version=' + attr);
        }
        var TOS = Stack.pop();
        printToOutput('TOS=' + TOS);
        if (TOS == 'self') {
            Stack.push(this.self[attr]);
        } else if (attr in builtIns) {
            Stack.push(attr);
            Stack.push(TOS);
        } else if (TOS instanceof classObject) {
            Stack.push(TOS.methods[attr]);
        } else {
            Stack.push(TOS[attr]);
        }
        this.pc += 3;
    };
    CodeObject.prototype.COMPARE_OP = function () {
        var opname = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var cmp_op = ['<', '<=', '==', '!=', '>', '>=', 'in', 'not in', 'is', 'is not', 'exception match', 'BAD'];
        var TOS = getValue(Stack.pop());
        var TOS1 = getValue(Stack.pop());
        if (cmp_op[opname] == '<') {
            Stack.push(TOS1 < TOS);
        }
        if (cmp_op[opname] == '<=') {
            Stack.push(TOS1 <= TOS);
        }
        if (cmp_op[opname] == '==') {
            Stack.push(TOS1 == TOS);
        }
        if (cmp_op[opname] == '!=') {
            Stack.push(TOS1 != TOS);
        }
        if (cmp_op[opname] == '>') {
            Stack.push(TOS1 > TOS);
        }
        if (cmp_op[opname] == '<=') {
            Stack.push(TOS1 >= TOS);
        }
        if (cmp_op[opname] == 'in') {
            Stack.push(TOS1 in TOS);
        }
        if (cmp_op[opname] == 'not in') {
            Stack.push(!(TOS1 in TOS));
        }
        if (cmp_op[opname] == 'is') {
            Stack.push(TOS1 == TOS);
        }
        if (cmp_op[opname] == 'is not') {
            Stack.push(TOS1 != TOS);
        }
        if (cmp_op[opname] == 'exception match') {
            Stack.push(TOS1 == TOS);
        }
        if (cmp_op[opname] == 'BAD') {
            Stack.push(TOS1 == TOS);
        }
        this.pc += 3;
    };
    CodeObject.prototype.IMPORT_NAME = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.IMPORT_FROM = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.JUMP_FORWARD = function () {
        var delta = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += delta + 3;
    };
    CodeObject.prototype.JUMP_IF_FALSE_OR_POP = function () {
        var target = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();
        if (!TOS) {
            this.pc = target;
            Stack.push(TOS);
        } else {
            this.pc += 3;
        }
    };
    CodeObject.prototype.JUMP_IF_TRUE_OR_POP = function () {
        var target = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();
        if (TOS) {
            this.pc = target;
            Stack.push(TOS);
        } else {
            this.pc += 3;
        }
    };
    CodeObject.prototype.JUMP_ABSOLUTE = function () {
        var target = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc = target;
    };
    CodeObject.prototype.POP_JUMP_IF_FALSE = function () {
        var target = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();
        if (!TOS) {
            this.pc = target;
        } else {
            this.pc += 3;
        }
    };
    CodeObject.prototype.POP_JUMP_IF_TRUE = function () {
        var target = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();
        printToOutput(TOS);
        if (TOS) {
            this.pc = target;
        } else {
            this.pc += 3;
        }
    };
    CodeObject.prototype.LOAD_GLOBAL = function () {
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        Stack.push(this.names[index]);
        this.pc += 3;
    };
    CodeObject.prototype.CONTINUE_LOOP = function () {
        //start of loop(absolute)
        var start = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc = start;
    };
    CodeObject.prototype.SETUP_LOOP = function () {
        //pushes block of size delta bytes
        var delta = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var start = this.pc + 3;
        var block = new Block(delta, start, 'loop');
        BlockStack.push(block);
        this.pc += 3;
    };
    CodeObject.prototype.SETUP_EXCEPT = function () {
        //target address(relative)
        var delta = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var start = this.pc + 3;
        var block = new Block(delta, start, 'except');
        BlockStack.push(block);
        this.pc += 3;
    };
    CodeObject.prototype.SETUP_FINALLY = function () {
        //target address(relative)
        var delta = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var start = this.pc + 3;
        var block = new Block(delta, start, 'finally');
        BlockStack.push(block);
        this.pc += 3;
    };
    CodeObject.prototype.LOAD_FAST = function () {
        //local variable number
        var varNum = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var item = this.varnames[varNum];
        if (item instanceof internedString) {
            Stack.push(byteObject.interned_list[item.index]);
        } else {
            Stack.push(item);
        }
        this.pc += 3;
    };
    CodeObject.prototype.STORE_FAST = function () {
        var varNum = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.varnames[varNum] = Stack.pop();
        this.pc += 3;
    };
    CodeObject.prototype.DELETE_FAST = function () {
        var varNum = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        delete this.varnames[varNum];
        this.pc += 3;
    };
    CodeObject.prototype.RAISE_VARARGS = function () {
        //number of raise arguments(1,2 or 3)
        var numArg = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var args = [];
        for (var i = 0; i < numArg; i++) {
            args[i] = Stack.pop();
        }
        if (numArg == 0) {
            throw 'Exception Error';
        }
        if (numArg == 1) {
            throw 'Exception Error: ' + args[0].toString();
        }
        if (numArg == 2) {
            throw 'Exception Error: ' + args[0].toString() + ', Parameters: ' + args[1].toString();
        }
        if (numArg == 3) {
            throw 'Exception Error: ' + args[0].toString() + ', Parameters: ' + args[1].toString() + ', Traceback: ' + args[2].toString();
        }
        this.pc += 3;
    };

    /* CALL_FUNCTION_XXX opcodes defined below depend on this definition */
    CodeObject.prototype.CALL_FUNCTION = function () {
        // Parse Operand Bytecode
        // argc is the operand from the bytecode (low bit = number of positional args, high bit = number of keyword args)
        var numArgs = this.code[this.pc + 1];
        var numKwargs = this.code[this.pc + 2];

        // Retrieve arguments from Stack and add to varnames
        var args = [];
        var kwargs = [];
        for (var i = 0; i < numKwargs; i++) {
            var val = Stack.pop();
            kwargs[i] = [Stack.pop(), val];
        }
        for (i = 0; i < numArgs; i++) {
            args[numArgs - 1 - i] = Stack.pop();
        }

        // Initialize variables depending on function_object type
        var function_object = Stack.pop();
        var isBuiltIn = (function_object in builtIns);
        var isClass = (function_object instanceof classObject);
        var varnamesOriginal = [];
        var varnamesNew = [];
        var argcount = 0;
        var defaults = [];
        if (isBuiltIn) {
            function_object = builtIns[function_object];
            varnamesOriginal = getArgNames(function_object);
            console.log(varnamesOriginal);
            argcount = function_object.length;
        } else if (isClass) {
            var class_object = function_object;
            for (var methodKey in class_object.methods) {
                var method = class_object.methods[methodKey];
                if (method instanceof FunctionObject) {
                    method.func_code.self = class_object.self;
                }
            }
            function_object = class_object.methods['__init__'];
            varnamesOriginal = function_object.func_code.varnames.slice(0);
            argcount = function_object.func_code.argcount;
            defaults = function_object.func_defaults;
        } else {
            varnamesOriginal = function_object.func_code.varnames.slice(0);
            argcount = function_object.func_code.argcount;
            defaults = function_object.func_defaults;
        }

        for (var i = 0; i < numKwargs; i++) {
            var key = kwargs[i][0];
            if (key instanceof internedString) {
                key = byteObject.interned_list[key.index];
            }
            printToOutput('key=' + key);
            var keyFound = false;
            for (var j = 0; j < varnamesOriginal.length; j++) {
                var varnamesKey = varnamesOriginal[j];
                if (varnamesKey instanceof internedString) {
                    varnamesKey = byteObject.interned_list[varnamesKey.index];
                }
                printToOutput('varnames key=' + varnamesKey);
                if ((key == varnamesKey) && (!keyFound)) {
                    varnamesNew[j] = kwargs[i][1];
                    printToOutput('setting kwarg in varnames');
                    keyFound = true;
                }
            }
        }

        // If it's a class object, put 'self' in position zero
        if (isClass) {
            varnamesNew[0] = 'self';
        }

        //Fill up remaining variable names using the positional arguments
        var counter = 0;
        for (i = 0; i < argcount; i++) {
            if ((varnamesNew[i] == undefined) && (counter < args.length)) {
                varnamesNew[i] = args[counter];
                counter += 1;
            }
        }

        // Get default values for any unspecified variable left
        counter = defaults.length;
        for (i = argcount - 1; i >= 0; i--) {
            if ((varnamesNew[i] == undefined) && (counter > 0)) {
                varnamesNew[i] = defaults[counter - 1];
                counter -= 1;
            }
        }

        for (i = 0; i < varnamesOriginal.length; i++) {
            if (varnamesNew[i] == undefined) {
                varnamesNew[i] = varnamesOriginal[i];
            }
        }

        //Execute Function
        var returnedValue;
        if (isBuiltIn) {
            returnedValue = function_object.apply(null, varnamesNew);
            console.log(returnedValue);
            if (returnedValue == 'NotImplemented') {
                returnedValue = null;
            }
        } else {
            // Overwrite function's varnames list
            function_object.func_code.varnames = varnamesNew.slice(0);

            while (function_object.func_code.pc < function_object.func_code.code.length) {
                // op code
                var opcode = function_object.func_code.code[function_object.func_code.pc];

                // call opcode
                printToOutput(OpCodeList[opcode]);
                function_object.func_code[OpCodeList[opcode]]();
                printToOutput(Stack);
            }

            // Reset varnames
            function_object.func_code.varnames = varnamesOriginal.slice(0);

            // Push class object back onto stack
            if (isClass) {
                Stack.push(class_object);
            }
            returnedValue = function_object.func_code.returnedValue;

            // Reset function object's counter
            function_object.func_code.pc = 0;
        }

        // Push the return value onto the stack (could be a None? value)
        if (!(returnedValue === null)) {
            Stack.push(returnedValue);
        }

        // Increment parent's program counter
        this.pc += 3;
    };
    CodeObject.prototype.MAKE_FUNCTION = function () {
        //number of defaults found below TOS
        var argc = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var code_object = Stack.pop();
        var defaults = [];
        for (var i = 0; i < argc; i++) {
            defaults[i] = Stack.pop();
        }
        var newFunction = new FunctionObject(code_object, defaults);
        var funName = code_object.name;
        if (funName instanceof internedString) {
            newFunction.func_name = byteObject.interned_list[funName.index];
        } else {
            newFunction.func_name = funName;
        }
        if (code_object.consts.length > 0) {
            var doc_string = code_object.consts[0];
            if (typeof doc_string == 'string' || doc_string instanceof String) {
                newFunction.func_doc = doc_string; // not fool proof but better than nothing
            }
        }
        Stack.push(newFunction);
        this.pc += 3;
    };
    CodeObject.prototype.BUILD_SLICE = function () {
        var numItems = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();
        var TOS1 = Stack.pop();
        if (numItems == 2) {
            Stack.push([TOS1, TOS]);
        }
        if (numItems == 3) {
            Stack.push([Stack.pop(), TOS1, TOS]);
        }
        this.pc += 3;
    };
    CodeObject.prototype.MAKE_CLOSURE = function () {
        // creates a new function object sets its freevars
        var argc = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var code_object = Stack.pop();
        var cells = Stack.pop();
        var defaults = [];
        for (var i = 0; i < argc; i++) {
            defaults[i] = Stack.pop();
        }
        var newFunction = new FunctionObject(code_object, defaults);
        newFunction.func_closure = cells; // don't know what this is for
        for (i = 0; i < cells.length; i++) {
            newFunction.func_code.freevars[i] = cells[i];
        }
        Stack.push(newFunction);
        this.pc += 3;
    };
    CodeObject.prototype.LOAD_CLOSURE = function () {
        //load from cellvars
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        if (index < this.cellvars.length) {
            Stack.push(this.cellvars[index]);
        } else {
            Stack.push(this.freevars[this.cellvars.length - index]);
        }
        this.pc += 3;
    };
    CodeObject.prototype.LOAD_DEREF = function () {
        //load from freevars
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        Stack.push(this.freevars[index]);
        this.pc += 3;
    };

    //Stores TOS into the cell contained in slot i of the cell and free variable storage.
    CodeObject.prototype.STORE_DEREF = function () {
        //store in cellvars
        var index = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        var TOS = Stack.pop();
        this.cellvars[index] = TOS;
        this.pc += 3;
    };

    /* The next 3 opcodes must be contiguous and satisfy
    (CALL_FUNCTION_VAR - CALL_FUNCTION) & 3 == 1  */
    CodeObject.prototype.CALL_FUNCTION_VAR = function () {
        //number args + (number kwargs<<8)
        var argc = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.CALL_FUNCTION_KW = function () {
        //number args + (number kwargs<<8)
        var argc = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };
    CodeObject.prototype.CALL_FUNCTION_VAR_KW = function () {
        //number args + (number kwargs<<8)
        var argc = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };

    CodeObject.prototype.SETUP_WITH = function () {
        var delta = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };

    /* Support for opargs more than 16 bits long */
    CodeObject.prototype.EXTENDED_ARG = function () {
        var ext = this.code[this.pc + 1] + Math.pow(2, 8) * this.code[this.pc + 2];
        this.pc += 3;
    };

    /***** have to determine what type of arguments these take *****/
    CodeObject.prototype.SET_ADD = function () {
        this.pc += 3;
    };
    CodeObject.prototype.MAP_ADD = function () {
        this.pc += 3;
    };
    return CodeObject;
})();

// Defines class object
var classObject = (function () {
    // maybe add a 'self' property here to hold all the variables? should default to this.self = {} + methods should have func_globals set to self
    function classObject(name, bases, methods) {
        this.name = name;
        this.bases = bases;
        this.methods = methods;
        this.self = {};
    }
    return classObject;
})();

// Defines class for a function object
var FunctionObject = (function () {
    function FunctionObject(code_object, defaults) {
        this.func_code = code_object;
        this.func_defaults = defaults;
    }
    return FunctionObject;
})();

var internedString = (function () {
    function internedString(index) {
        this.index = index;
    }
    return internedString;
})();

//Iterator object implemented to use for Python iterators
var Iterator = (function () {
    //pass in the bounds
    function Iterator(low, high) {
        this.curIndex = low;
        this.high = high;
    }
    //returns itself
    Iterator.prototype.iter = function () {
        return this;
    };

    //returns next element or StopIteration if nothing is left
    Iterator.prototype.next = function () {
        if (this.curIndex > this.high) {
            //stop iteration
            return -1;
        } else {
            this.curIndex += 1;
            return (this.curIndex - 1);
        }
    };
    return Iterator;
})();

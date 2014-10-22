/// <reference path="Parsers.ts" />
/// <reference path="Log.ts" />

// Assume verbose output requested
var isVerbose = true;

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
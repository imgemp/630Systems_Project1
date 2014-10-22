/// <reference path="NumericObjects.ts" />
function abs(x: any){
	if(x instanceof Complex){
		var x2 = Math.pow(x.real,2);
		var xi2 = Math.pow(x.imag,2);
		return sqrt((x2+xi2));
	}else if ((x instanceof Integer) || (x instanceof Float) || (x instanceof Long)) {
		return Math.abs(x);
	}else{
		return 'NotImplemented';
	}
}
//iterator
function all(){
	
}
//iterator
function any(){
	
}
function basestring(){}
function bin(){}
function bool(){}
function bytearray(){}
function callable(){}
function chr(i : number){
	if( i <= 255 && i >= 0){
		return String.fromCharCode(i);
	}else{
		return "ValueError";
	}
}
function classmethod(){}
function cmp(x, y){
	if(x === y){
		return 0;
	}else if( x > y){
		return -1;
	}else if( x > y){
		return 1;
	}

}
function compile(){}
function complex(){}
function delattr(){}
function dict(){}
function dir(){}
function divmod(){}
function enumerate(){}
function eval(){}
function execfile(){}
function file(){}
function filter(){}
function floater(){}
function format(){}
function frozenset(){}
function getattr(){}
function func_globals(){}
function hashattr(){}
function hash(){}
function help(){}
function hex(){}
function id(){}
function input(){}
function inter(){}
function isinstance(){}
function issubclass(){}
function iter(){}
function len(){}
function list(){}
function locals(){}
function longer(){}
function map(){}
function max(){}
function memoryview(){}
function min(){}
function next(){}
function object(){}
function oct(){}
function open(){}
function ord(){}
function pow(x, y, z?){}
function print(){}
function property(){}
function range(){}
function raw_input(){}
function reduce(){}
function reload(){}
function repr(){}
function reversed(){}
function round(){}
function set(){}
function setattr(){}
function slice(){}
function sorted(){}
function staticmethod(){}
function str(){}
function sum(){}
function super1(){}
function tuple(){}
function type(){}
function unichar(){}
function unicode(){}
function vars(){}
function xrange(){}
function zip(){}
function _import_(){}
function apply(){}
function buffer(){}
function coerce(){}
function intern(){}
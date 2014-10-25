/// <reference path="NumericObjects.ts" />

function getValue(object) {

	if (object instanceof Numeric) {
		if (object instanceof Complex) {
			return object.real;
		} else {
			return object.value;
		}
	} else {
		return object;
	}

}

function getArgNames(func) {

	var reg = /\(([\s\S]*?)\)/;
	var args = reg.exec(func);
	if (args) { 
    	var arg_names = args[1].split(',').map(Function.prototype.call, String.prototype.trim);
    	return arg_names;
    } else { return []; }

}

// console.log(getArgNames(getArgNames));

// function abs(x: any): any{
// 	if(x instanceof Complex){
// 		var x2 = Math.pow(x.real,2);
// 		var xi2 = Math.pow(x.imag,2);
// 		return Math.sqrt((x2+xi2));
// 	}else if ((x instanceof Integer) || (x instanceof Float) || (x instanceof Long)) {
// 		return Math.abs(x);
// 	}else{
// 		return 'NotImplemented';
// 	}
// }
//iterator
function all(){
	
}
//iterator
function any(){
	
}
function basestring(){

}
function bin(x: any):any{
	if( x instanceof Integer){
		return x.toString(2);
	}
}
function bool(x?:any) : boolean{
	var xVal = x || false;
	if(xVal != false){
		if( xVal == 'None' || xVal == ''){
			xVal = false;
		}else{
			xVal = true;
		}
	}
	return xVal;
}
function bytearray(){}
function callable(obj: any){

}
function chr(i : number){
	if( i <= 255 && i >= 0){
		return String.fromCharCode(i);
	}else{
		return "ValueError";
	}
}
function classmethod(func: any){

}
function cmp(x:any, y:any):number{
	if(x === y){
		return 0;
	}else if( x > y){
		return -1;
	}else if( x > y){
		return 1;
	}

}
function compile(){}
// function complex(){}
function delattr(obj:any, attrName: String){
	delete obj.attrName; 
}
function dict(){}
function dir(){}
// function divmod(){}
function enumerate(){}
function eval1(){}
function execfile(){}
function file(){}
function filter(){}
function floater(){}
function format(){}
function frozenset(){}
function getattr(obj: any, attrName:String, dfault?:any): any{
	var dflt = dfault || false;
	if(obj.attrName != null){
		return obj.attrName;
	}else if(dflt != false){
		return dflt
	}else{
		return "AttributeError"
	}
}
function func_globals(){}
function hashattr(){}
function hash(){}
function help(){}
// function hex(){}
function id(obj: any){}
function input(){}
function inter(){}
function isinstance(){}
function issubclass(){}
function iter(){}
function len(s:any): number{
	return s.length;
}
function list(){}
function locals(){}
function longer(){}
function map(){}
function max(){}
function memoryview(){}
function min(){}
function next(){}
function object(){
	return new Object;
}
// function oct(){}
function open1(){}
function ord(c){
	if(c.length > 1){
		return "TypeError";
	}else{
		return c.charCodeAt(0);
	}
}
// function pow(x, y, z?){}
function print1(){}
function property(){}
function range(){}
function raw_input(){}
function reduce(){}
function reload(){}
function repr(){}
function reversed(){}
function round(num: any, ndigits?:number){
	
}
function set(){}
function setattr(){}
function slice(){}
function sorted(){}
function staticmethod(){}


function str(object: any): string {
	var err: string;
	try { err = 'str('+object.constructor.name+') NotImplemented'; }
	catch(err) { err = 'Object not defined.'; }
	var result: string;
	if (object instanceof Numeric) {
		result = object.__str__();
		if (result == 'NotImplemented') {
			throw err;
		} else {
			return result;
		}
	} else {
		try {
			return object.toString();
		} catch(err) {
			throw err;
		}
	}

}


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
// function coerce(){}
function intern(){}
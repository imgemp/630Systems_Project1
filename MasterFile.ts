// Start Node

var fs = require('fs');
var bytecode;
fs.readFile('foo.pyc', function (err, data) {
	if (err) throw err;
	bytecode = data;
});
var magic_number = bytecode.slice(0,4); //magic number
var time_stamp = bytecode.slice(4,8); //time stamp
//check magic number against python 2.7 (03f3 0d0a)
var my_version = [3,243,13,10];
// var my_version:Array<number> = [3,243,13,10];
for (var i=0; i++; i<4) {
	if (magic_number.readUInt8(i) != my_version[i]) {
		console.log("Not right version!");
		// exit program
	}
}
i = 0;
while (String.fromCharCode(bytecode.slice(8+4*i,12+4*i).readUInt8(0)) != 'c') {
	i = i + 1;
	if (i>100) {
		return;
	}
}
i = 8+4*i+1;
var argcount = bytecode.slice(i,i+4).readUInt32LE(0);
var nlocals = bytecode.slice(i+4,i+8).readUInt32LE(0);
var stacksize = bytecode.slice(i+8,i+12).readUInt32LE(0);
var flags = bytecode.slice(i+12,i+16).readUInt32LE(0);
/// <reference path="Globals.ts" />

//Function to format and produce the desired output of opcodes
function printToOutput(input: any,skipReturn?: boolean,isProgram?: boolean) {
	var output;
	if (input !== null) {
		try {
			if ((typeof input !== 'string') && (typeof input !== 'undefined') && (input.length>1)) {
				output = [];
				for (var i=0;i<input.length;i++) {
					output[i] = str(input[i]);
				}
			} else {
				output = input.toString();
			}
		} catch(err) {
			throw err;
		}
	} else { output = 'null'; }
    var skipReturn = skipReturn || false;
    var isProgram = isProgram || false;
    if (isVerbose || isProgram) {
        if (!skipReturn) { output += '\n'; }
        (<HTMLInputElement>document.getElementById("logOut")).value += output;
    }
}
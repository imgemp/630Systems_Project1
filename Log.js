/// <reference path="Globals.ts" />
function printToOutput(input, skipReturn, isProgram) {
    var output;
    try  {
        if ((input.length > 1) && (typeof input !== 'string') && (typeof input !== 'undefined')) {
            for (var i = 0; i < input.length; i++) {
                output[i] = str(input[i]);
            }
        } else {
            output = input.toString();
        }
    } catch (err) {
        throw err;
    }
    var skipReturn = skipReturn || false;
    var isProgram = isProgram || false;
    if (isVerbose || isProgram) {
        if (!skipReturn) {
            output += '\n';
        }
        document.getElementById("logOut").value += output;
        // process.stdout.write(output);
    }
}

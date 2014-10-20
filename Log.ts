/// <reference path="Globals.ts" />

function printToOutput(input: string,skipReturn?: boolean,isProgram?: boolean) {
    var output = input.toString();
    var skipReturn = skipReturn || false;
    var isProgram = isProgram || false;
    if (isVerbose || isProgram) {
        if (!skipReturn) { output += '\n'; }
        (<HTMLInputElement>document.getElementById("logOut")).value += output;
        // process.stdout.write(output);
    }
}
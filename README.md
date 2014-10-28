630Systems_Project1
===================

#Ian Gemp and Shaylyn Adams-Python Interpreter
##Description
This project sought to create an in-browser interpreter for Python bytecode files. The .pyc file
can be uploaded via the [website](http://shaylyna.github.io/630Systems_Project1/) which will then be
interpreted and executed in the background by a typescript program. The output will be displayed
on the page in a text area and the user can chose to see just the return value of the program or the entire step by step
program execution.
  
##System Requirements
Since this project utilizes BrowserFS and the NodeJS filesystem, all work is done in browser and is supported
by various browsers, i.e. Chrome, Firefox, Internet Explorer, etc. 

##Dependencies
**Typescript and Node.js**:

npm install -g typescript

<reference path="node.d.ts" />

To compile: tsc MasterFile.ts (which creates a .js file)

**BrowserFS**

npm install -g grunt-cli bower

npm install

See also the [README](https://github.com/jvilk/BrowserFS/blob/master/README.md)

Our program is separated into multiple .ts/.js files that include appropriate references to other files at the beginning. We have designed a test suite for our program that can be run through the website using the testSuite.pyc file we have included. Expected output can be found in the commented section of the test file itself.  

##Known Bugs
As of now our python interpreter does not support iterators. Importing, set and map adds, with statements and a couple other innocuous builtins and opcodes are included but were never implemented. Our program also does not specifically handle longs. It is important to note that this program was built based upon Python 2.7 and other versions will not be parsed. 

##Acknowledgements
This project was delegated by Emery Berger for 630 Systems module at UMass Amherst. John Vilk aided with
BrowserFs incorporation and support.

js-indentator User's Guide
===========

## Introduction to the project

First of all we will say a "JavaScript indentator" is a program that process some input valid JavaScript 
source code string and output a transformation of that code, most commonly programs for 
indenting / formatting / prettify the code. 

With that concept in mind then, this project can be defined as a framework for defining "JavaScript indentators" in JavaScript. This project comes with a general JavaScript parser utility (see src/jsindentator.js) and several JavaScript Indentator implementations, that can be used as examples 
or basis for building new ones. For example, some static javascript code 
indentators like style1, style2, other more configurable like variable1, and other utilities like prettyfy1 that generates prettified html from sources. 

The objective is you can perform some basic indenting / formatting stuff using configurable implementation but also have clear example of doing complex stuff by hand, this means, implement your own "javascript indentators" easily.


##A note about AST parsers

Since it is based on esprima javascript parser, the javascript source code is accessed throu an AST (abstract syntax tree) API. For example, the javascript code 

    function(a){return 1;}

is decomposed on a root object "FunctionDeclaration" that contains other object attributes like "a list os parameters" and a "Block of code", which itself contains a "block", which itself contains  "return statement", which itself contains "the expression 1*1", and so on. 

So this AST way mean that any JavaScript code is decomposed in a tree of conceptual objects, which branches are complex language objects like "a function" and which leaf are very atomic/simple concepts, like a number. 


## AST Visitor Types (Language Concepts)

Like mentioned above, in AST parsers the target language (JavaScript) is decomposed in small pieces, for example a function declaration like function f(a) {return a; } is decomposed in smaller parts, like the function name, function parameters and function body. The body contain statements like if, 
while, for, var and so on. 

These parsers visit each node from the tree roots to the leaves so we need to know what each type of tree node means and what contains. 

TODO: idea for document this - using jsdoc ?  For each of those, an AST Visitor type is defined for example 
, VariableDeclaration, ForInStatement, ReturnStatement, etc. 

this project, js-indentator, implement some utilities and examples that can be used to generate some 
kind of output from a javascript input source.  

The following is a list of supported JavaScript language concepts supported by the parser. 
In summary are the AST types supported by esprima plus some other artificial ones 
(like Block and Line for comments. )  

TODO: list all visitor types
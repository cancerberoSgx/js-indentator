js-indentator
=============

This project born as a javascript indentation tool based on esprima JavaScript parser. Now it is a set of example tools in an unified simple format that perform some task over some javascript code input, for example not only indenting but also extracting information, code prettifying, etc. 

This project can be usefull for those that need to easily define javascript-sourcecode-analizying tools like mentioned. 

It can be run on the browser and on the desktop using nodejs. 

Since it is based on esprima javascript parser, the javascript source code is accessed throu an AST (abstract syntax tree) API. For xample, the javascript code 

	function(a){return 1;}

is decomposed on a root object "FunctionDeclaration" that contains other object attributes like "a list os parameters" and a "Block of code", which itself contains a "block", which itself contains  "return statement", which itself contains "the expression 1*1", and so on. 

So this AST way mean that any JavaScript code is decomposed in a tree of conceptual objects, which branches are complex language objects like "a function" and which leaf are very atomic/simple concepts, like a number. 

Online Demo
=============
http://cancerberosgx.github.io/js-indentator/jsindentator/test/formattingjstest1.html

Compiling it
=============
Install nodejs on your system and: 

	cd jsindentator
	npm install 
	grunt

If all goes fine, then files will be available under the build/ folder. 


*Warning*: this is a very new, fresh project, and it needs more testing before parsing production code. It is not ready, not yet.
 
## Using it

File test/formattingtest1.html show how to use all the build-in styles. In general it is: 


	<!-- load javascript dependencies -->
	<script src="../lib/esprima.js" type="text/javascript"></script>
	<script src="../lib/underscore.js" type="text/javascript"></script>
	<script src="../src/jsindentator.js" type="text/javascript"></script>
	
	<!-- load or define at least one syntax style, in this case we use styles.variable1 
	because we can configure almost everithing using a josn object.  -->
	<script src="../src/styles/style_variable1.js" type="text/javascript"></script>
	
	<!-- ......... -->
	
	<script>
	//Now the real usage code: 
	
	//first, the code we want to parse: 
	var code = 'var a = {b: 1, c: false, d: function(e,f){return "hello";}}';
	
	//now use the configured style_variable1 implementation for processing and get the output code.
	var pretty = jsindentator.main(code); 
	</script>


See test/*.html files for more examples. 

Also, notice that production ready files are available in the folder build/*.js each separated 
module or the file js-indentator-all.min.js that contains everything.  Those files are generated using *gruntjs*. 


## Using it in the desktop/server with Node Js

Also you can run the JavaScript indentator tool from command line using nodejs using 
the script *indent*. Just make sure you have installed the *required nodejs modules* (you need to do this only once):

	cd jsindentator
	npm install
	npm link

Then you are ready to:

	indent " " /path/to/some.js > some_indented.js


## Introduction to the project

First of all we will say a "JavaScript indentator" is a program that process some input valid JavaScript 
source code string and output a transformation of that code, most commonly programs for 
indenting / formatting / prettify the code. 

With that concept in mind then, this project can be defined as a framework for defining 
"JavaScript indentators" in JavaScript. This project comes with a general JavaScript parser utility 
(see src/jsindentator.js) and several JavaScript Indentator implementations, that can be used as examples 
or basis for building new ones. For example, some static javascript code 
indentators like style1, style2, other more configurable like variable1, and other utilities 
like prettyfy1 that generates prettified html from sources. 

The objective is you can perform some basic indenting / formatting stuff using configurable implementation but also have 
clear example of doing complex stuff by hand.


## Available implementation examples. 



## AST Visitor Types (Language Concepts)

In AST parsers the target language (JavaScript) is decomposed in small pieces, 
for example a function declaration like function f(a) {return a; } is decomposed in smaller parts, 
like the function name, function parameters and function body. The body contain statements like if, 
while, for, var and so on. For each of those, an AST Visitor type is defined for example 
, VariableDeclaration, ForInStatement, ReturnStatement, etc. 

this project, js-indentator, implement some utilities and examples that can be used to generate some 
kind of output from a javascript input source.  

The following is a list of supported JavaScript language concepts supported by the parser. 
In summary are the AST types supported by esprima plus some other artificial ones 
(like Block and Line for comments. )  

TODO: list all visitor types




TODO / ideas

* javascript function call linking (like the prettyprit but function calls are links to function definition. )
* code ast types charts
* in the html example, support native file drag and drop (html5)
* a general style based on underscore templates

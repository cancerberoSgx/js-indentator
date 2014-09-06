js-indentator
=============

Online Demos
=============
http://cancerberosgx.github.io/js-indentator/jsindentator/test/

*Warning*: This is a new, investigation project that expose a number of utilities for processing JavaScript code. For example, indenting, formatting, prettify. minifying, extracting meta information like jsdocs, etc. 

This project born as a javascript indentation tool based on esprima JavaScript parser. Now it is more like a framework for easily processing javascript code somehow. This is, programs that need to parse javascript code and output some result. 

This project can be usefull for those that need to easily define javascript-source code-analizying tools like mentioned. Main objective is let the user easily define its own javascript parsing tools for its personal purposes. 

In general using it means registering listeners for certain language parts, like function definitions, comments, and those listeners will be called when those units are visited b the AST parser. This means you will get that unit parsed, inspect it some how for extracting information and sotre that information somewhere so it is accessible when the parsing is done. 

It can be run on the browser and on the desktop using nodejs. 

User Guide
===========

TODO: link


Compiling it
=============
Install nodejs on your system and: 

	cd jsindentator
	npm install 
	grunt

If all goes fine, then files will be available under the build/ folder. just open jsindentator/test/index.html. Also you can start the developement server with 'grunt run'. 

 
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


## About the files

jsindentator/src/jsindentator.js is the main framework file. As you can see is small heavily dependent on esprima AST parser. 

Then the jsindentator/src/styles/* contains several implementations that use the framework somehow. For each of them there is a jsindentator/test/*.html file showing an example of it in an html page. 

The most important of these 'styles implementation' is style_clean.js - by default dumps the javascript minified, but in general, new implementations should extend it because it is guaranteed that all the AST tree nodes will be visited. In other words is the official JavaScript language 'walker'. 

Other implementations like style1, style2, ```style_variable1```, clean are only javascript code indenters - this is dump valid javascript strings - it can be used as javascript text editors plugins for indenting plain old javascript text files. style_variable1 is a configurable approach.

Other liks ```style_prettify1```, ```style_prettify_spaces1``` will output the give javascript code in HTML - with alignation and colors. 

Others like style_tree1 and style_springy_graph will help show the code as a tree or graph visually. 

There is a last example implementaiton worth mention, jsdocgenerator1. Proably this one will have its own project. It will extract any jsdoc information from comments and generate a javascript object with all the jsdoc information like classes, methods, params, extens, modules, etc. 




## TODO / ideas
* testing that at least the reference implementation Clean don't break the code and well preserve the comments. 
* javascript function call linking (like the prettyprit but function calls are links to function definition. )
* code ast types charts, like a chart for each concept count, other chart for expression vs declaration vs statement
* in the html example, support native file drag and drop (html5)
* a general style based on underscore templates
* compose an API doc for ast js tree nodes

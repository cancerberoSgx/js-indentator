js-indentator
=============

Online Demos
=============
http://cancerberosgx.github.io/js-indentator/jsindentator/test/

*Warning*: This is a new, investigation project that expose a number of utilities for indenting, formatting, prettify. minifying, JavaScript code. Don't use these tools for production code! They are not ready, not yet. It is known that at least comments are not well supported (it will destroy, at least, your JavaScript comments). 

This project born as a javascript indentation tool based on esprima JavaScript parser. Now it is a set of example tools in an unified simple parse format that perform some task over some javascript code input, for example not only indenting but also extracting information, code prettifying, etc. 

This project can be usefull for those that need to easily define javascript-source code-analizying tools like mentioned. Main objective is let the user easily define its own javascript parsing tools for its personal purposes. 

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

If all goes fine, then files will be available under the build/ folder. 

=======
A javascript indentation tool based on esprima JavaScript parser that can be run on the browser. 
Online Demo : http://cancerberosgx.github.io/js-indentator/jsindentator/test/formattingjstest1.html


 
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



## Available implementation examples. 

TODO





## TODO / ideas
* testing that at least the reference implementation Clean don't break the code and well preserve the comments. 
* javascript function call linking (like the prettyprit but function calls are links to function definition. )
* code ast types charts, like a chart for each concept count, other chart for expression vs declaration vs statement
* in the html example, support native file drag and drop (html5)
* a general style based on underscore templates
* compose an API doc for ast js tree nodes

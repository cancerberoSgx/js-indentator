
(function() {
	
var ns = jsindentator, visit=ns.visit, print=ns.print, indent=ns.printIndent;

if(!ns.styles)
	ns.styles={};

///////////////////////////////////////////////////////////////////////////
// DEFAULT CONFIGURATION - ALL CONFIGURABLE VARIABLES WITH DOCUMENTATION
///////////////////////////////////////////////////////////////////////////
/* A little introduction. 
 * 
 * This is a configurable style that each relevant part of the language is configurable by the user. 
 * For example, the user may indicate how he want to print the "var " or new keywords. All these 
 * relevant parts of the language are configurable as templates and each value will be evaluated so
 * you can iterate, conditions and calling built in utilities for blockquote, indentation, etc. 
 * Template example code example: 
 * 
 * VAR: 'return "var \n\n"'
 * 
 * will define that two new lines are added before every 'var' keyword. 
 * 
 * The templates will be simply valid strings that will be evaluated with pure eval() (so be careful) 
 * and must be a valid function body that returns an string, being that string what the 
 * user want to print in the case of that particular language concept. 
 * This allows the user to use any javascript statements as needed for printing the ast node.
 * Also the properties can be functions, for example: 
 * 
 * 	LITERAL: 				function(node, ns, _){
		//if the literal is an string in double quotes print a nasty warning comment. 
		if(node.raw.indexOf('"')===0) {
			print(' /* TODO: HEY, we use single quotes, fix this literal: *hug!/'+ node.raw);
		}
		else {
			print(node.raw);
		}
	}
	
	If it is a string, then the string itself must be the result of the output and use helper functions that generate strings, like ns.Indent()
	On the other side, if it is a function, then the function itself must call the print statements manually, 
	like ns.print() and ns.indent(), just like visitors objects do. 
 * 
 * The javascript template code will have available in its context
 * 1) the 'node' ast input object 
 * 2) the 'ns' namespace object 
 * 3) and the _ underscore library object. 
 * See ns.evalStr sources for looking at what is exactly done. 
 * 
 * * TODO: 
 * * configuration option for "always use curly braces in blocks" (even if they are not mandatory). Currently this always uses curly braces.
 * * the same for mandatory colons.  
 */
 
var variable1DefaultConfig = ns.config = { /* this style's configuration is defined in its own config namespace */
	
	/*general style properties*/
		
	tab : '\t',
	newline : '\n',
	
	/*variable1 only styles*/
	
	VAR: 					'return "var "',
	VAR_COMMA: 				'return ", "',
	VAR_COMMA_NEWLINE: 		'return ns.Indent() + "," + ns.tab',
	VAR_DECL_INIT: 			'return " = "',
	STMT_SEMICOLON: 		'return "; "+ ns.Indent() ',
	
	FUNCTION: 				'return "function "',
	FUNCTION_PAREN_LEFT:	'return " ( "',
	FUNCTION_PAREN_RIGHT: 	'return " ) "',
	FUNCTION_PARAM_COMMA: 	'return", "',
	FUNCTION_CURLY_LEFT:	'return "{" + ns.Indent()',
	FUNCTION_CURLY_RIGHT: 	'return "}" + ns.Indent()',
	
	OPERAND_UPDATE: 		'return " "+node.operator+" "; ',
		
	FOR: 					'return "for"; ', 
	FOR_COLON: 				'return "; "; ', 
	FOR_PAREN_LEFT: 		'return " ( "; ',
	FOR_PAREN_RIGHT: 		'return " ) " + ns.Indent(); ',
	FOR_CURLY_LEFT: 		'return ns.Indent()+" { "+ ns.Indent() ; ',
	FOR_CURLY_RIGHT: 		'return " { "; ',
	
	SQUARE_LEFT: 			'return " [ "; ',
	SQUARE_RIGHT: 			'return " ] "; ',
	
	CALL_COMMA: 			'return ", "; ',
	CALL_PAREN_LEFT: 		'return " ( "; ', 
	CALL_PAREN_RIGHT: 		'return " ) "; ', 
	
	BYNARY_OPERATOR: 		'return node.operator; ',
	
	OBJECT_CURLY_LEFT: 		'return "{"; ',
	OBJECT_CURLY_RIGHT: 	'return "}"; ',
	OBJECT_COMMA:			'return  ns.Indent(false, ns.blockCount-1) + "," + ns.tab;  ', //object literals comma-in-the-next-line custom nerd style. 
	
	RETURN: 'return ns.Indent() + "return"; ', //any doubts?
	QUESTION: 'return " ? "; ', 
	COLON: 'return " : "; ', 
	
	SEQUENCE_PAREN_LEFT: 'return "("; ', 
	SEQUENCE_COMMA: 'return ", "; ',
	SEQUENCE_PAREN_RIGHT: 'return ")"; ',
	
	SWITCH: 'return ns.Indent() + "switch"; ', 
	SWITCH_PAREN_LEFT: 'return "("; ', 
	SWITCH_PAREN_RIGHT: 'return ")"+ns.Indent(); ', 
	SWITCH_CURLY_LEFT: 'return "{"; ',
	SWITCH_CURLY_RIGHT: 'return ns.Indent() + "}"; ',
	
	SWITCH_CASE: 'return ns.Indent() + node.test==null ? "default" : "case "; ', 
	SWITCH_COLON: 'return ":"; ', 
	BREAK: 'return "break"; ', 
	
	WHILE: 'return "while"; ', 
	WHILE_PAREN_LEFT: 'return "("; ', 
	WHILE_PAREN_RIGHT: 'return ")"; ', 
	WHILE_CURLY_LEFT: 'return "{"; ', 
	WHILE_CURLY_RIGHT: 'return "}"; ',
	
	OPERATOR_ASSIGNMENT: 'return " "+node.operator+" "; ', 	
	
	OPERATOR_DOT: 'return "."; ', 
	
	THIS: 'return " this"; ',
	
	DO: 'return "do "; ', 
	DO_CURLY_LEFT: 'return ns.Indent() + "{"; ', 
	DO_CURLY_RIGHT: 'return  ns.Indent() + "}"; ', 
	
	NEW: 'return "new "; ', 
	NEW_PAREN_LEFT: 'return "( "; ', 
	NEW_PAREN_RIGHT: 'return ")"; ', 
	NEW_COMMA: 'return ", "; ', 
	
	WITH: 'return  ns.Indent() + "with  "; ', 
	WITH_PAREN_LEFT: 'return "("; ', 
	WITH_PAREN_RIGHT: 'return ")"; ', 
	WITH_CURLY_LEFT: 'return "{" ', 
	WITH_CURLY_RIGHT: 'return  ns.Indent() +"}"; ', 
	
	LITERAL: 'return node.raw; ',
			
	/* function example: a simple type literal like strings, number, boolean, null, undefined, etc. Not object or functions.*/ 
//,	LITERAL: 				function(node, ns, _){
//		/*if the literal is an string in double quotes print a nasty warning comment.*/ 
//		if(node.raw.indexOf('"')===0) {
//			ns.print(' /* TODO: HEY, we use single quotes, fix this literal: */'+ node.raw);
//		}
//		else {
//			ns.print(node.raw);
//		}
//	}
	
	"":""
,	IDENTIFIER: 			'return node.name'
	
	//Block comment (using /* */)
,	"Block": 				'ns.Indent() + "/* " + node.value + " */"'
	
	//line comment (using //) 
,	"Line": 				'ns.Indent() + "// " + node.value '
	
}; 



ns.Indent = function(nonl, num) {
	var s = [];	
	if(!nonl)
		s.push(ns.newline); 
	var top = num ? num : ns.blockCount; 
	for(var i = 0; i < top; i++) 
		s.push(ns.tab); 
	return s.join(''); 
}; 


//,	_printIndent: function(num) {
//		for(var i = 0; i<num; i++) {
//			ns.print(ns.tab); 
//		}
//	}

ns.createRenderer = function(s) {
	if(_.isFunction(s)){
		return s;
	}
	else {
		var buf = []; //, quoted = s;//'\''+s.replace(/'/g, '\\\'')+'\'';
		buf.push('(function(node, ns, _){');
//		buf.push('  return ('+quoted+'); ');
		buf.push(s);
		buf.push('})'); 
		var str = buf.join(''); 
		try {
			var fn = eval(str); 
			var wrapped  = _.wrap(fn, function() {
				var node = arguments[1], ns=arguments[2], _=arguments[3]; 
				ns.print(fn.apply(fn, [node, ns, _]));
			});
			return wrapped;
		} catch (e) {
			console.log('"ERROR evaluating renderer '+s+'\noutput: '+str)
			throw e; 
		}	
 	
	}

}; 



jsindentator.styles.variable1 = {
		
	setStyleConfig: function(newConfig) {
		ns.config = variable1DefaultConfig; 
		_.each(_.keys(newConfig), function(k){
			if(k) {
				ns.config[k] = newConfig[k];
//				console.log('setStyleConfig: '+k+" - "+newConfig[k]); 
			}
		});
//		for(var i in newConfig) {
//			if(i)
//				ns.config[i]=newConfig[i];
//		}				
		ns.styles.variable1.installStyle(); //rebuild the variables with the new configuration. 
	}	

,	installStyle: function() {
		ns.variables = {};
		_.each(_.keys(ns.config), function(k){
			if(k) try {
				ns.variables[k] = ns.createRenderer(ns.config[k]); 
//				console.log('variables: '+k+" - "+ns.variables[k]); 
			} catch (ex) {
				console.log("ERROR PARSING VARIABLE: ", k, ex); 
			}
		});
	}
	
,	"VariableDeclaration" : function(node, config) {
		if(!config || !config.noFirstNewLine) //var decls in for stmts
			indent(); 
		ns.variables.VAR(node, ns, _); 
		for ( var i = 0; i < node.declarations.length; i++) {
			visit(node.declarations[i]); 
			if(i< node.declarations.length-1) {
//				if((!config || !config.noFirstNewLine) && ns.variables.VAR_COMMA_NEWLINE) {
				if(!config || !config.noFirstNewLine) {
					ns.variables.VAR_COMMA_NEWLINE(node, ns, _); 
				}
				else {
					debugger; 
					print(ns.variables.VAR_COMMA(node, ns, _)); 
				}
			}	 
		}
		if(!config || !config.noLastSemicolon) //this is a statement! so we may need to print a semicolon
			print(ns.variables.STMT_SEMICOLON(node, ns, _)); 
	}

,	"VariableDeclarator" : function(node) {
//		ns.print(node.id.name);
		visit(node.id);
//		debugger; 
		if(node.init) {
			ns.variables.VAR_DECL_INIT(node, ns, _); 
			visit(node.init);
		}
	}

,	"Literal" : function(node) {
		ns.variables.LITERAL(node, ns, _);
	}
,	"Identifier": function(node) {
		ns.variables.IDENTIFIER(node, ns, _);
	}
,	"FunctionExpression": function(node) {
		ns.variables.FUNCTION(node, ns, _);
		visit(node.id);
		
		print(ns.variables.FUNCTION_PAREN_LEFT(node, ns, _)); 
		for( var i = 0; i < node.params.length; i++) {
			visit(node.params[i]); 
			if(i < node.params.length-1)
				print(ns.variables.FUNCTION_PARAM_COMMA(node, ns, _));					
		}
		print(ns.variables.FUNCTION_PAREN_RIGHT(node, ns, _));
		if(node.body.body.length>0) {
			print(ns.variables.FUNCTION_CURLY_LEFT(node, ns, _));
			ns.blockCount++;	
			visit(node.body); 
			ns.blockCount--;
//			indent();
//			print('}')
			print(ns.variables.FUNCTION_CURLY_RIGHT(node, ns, _));
		}
		else {
//			print('{}');  	
			print(ns.variables.FUNCTION_CURLY_LEFT(node, ns, _));
			print(ns.variables.FUNCTION_CURLY_RIGHT(node, ns, _));
		}
			
	}
,	"BlockStatement": function(node) {	
		for ( var i = 0; i < node.body.length; i++) {
			visit(node.body[i]);
		}
	}
,	"UpdateExpression": function(node) {				  
		if(node.prefix) {
//			print(node.operator);
			print(ns.variables.OPERAND_UPDATE(node, ns, _));
			visit(node.argument); 
		}
		else {
			visit(node.argument); 
//			print(node.operator);
			print(ns.variables.OPERAND_UPDATE(node, ns, _));
		}
	}
,	"ForStatement": function(node) {
//		indent(); 
//		print('for('); 
		print(ns.variables.FOR(node, ns, _));
		print(ns.variables.FOR_PAREN_LEFT(node, ns, _));
		visit(node.init, {noFirstNewLine: true});
		visit(node.test);
//		print('; ');
		print(ns.variables.FOR_COLON(node, ns, _));
		visit(node.update);
//		print(')');
//		indent();
		print(ns.variables.FOR_PAREN_RIGHT(node, ns, _));
//		print('{'); 
		print(ns.variables.FOR_CURLY_LEFT(node, ns, _));
		ns.blockCount++;
		visit(node.body);
		ns.blockCount--;
//		indent(); 
//		print('}'); 
		print(ns.variables.FOR_CURLY_RIGHT(node, ns, _));
	}

,	"ArrayExpression": function(node) {	
//		print('['); 
		print(ns.variables.SQUARE_LEFT(node, ns, _));
		for ( var i = 0; i < node.elements.length; i++) {
			visit(node.elements[i]);
			if(i < node.elements.length-1)
				print(', ');
		}
//		print(']'); 
		print(ns.variables.SQUARE_RIGHT(node, ns, _));
	}

,	"ExpressionStatement": function(node) {
//		indent(); 
		visit(node.expression);
		print(ns.variables.STMT_SEMICOLON(node, ns, _)); //print(';'); 
	}
,	"CallExpression": function(node) {
		if(node.callee.type==="FunctionExpression"){//hack - parenthesis around functions
//			print('(');		
			print(ns.variables.CALL_PAREN_LEFT(node, ns, _));
		}
		visit(node.callee); 
		if(node.callee.type==="FunctionExpression"){//hack - parenthesis around functions
//			print(')');
			print(ns.variables.CALL_PAREN_RIGHT(node, ns, _));
		}
	
//		print(' ( '); 
		print(ns.variables.CALL_PAREN_LEFT(node, ns, _));
		for ( var i = 0; i < node.arguments.length; i++) {
			visit(node.arguments[i]);
			if(i < node.arguments.length-1)
//				print(', ');
				print(ns.variables.CALL_COMMA(node, ns, _));
		}
//		print(' ) '); 
		print(ns.variables.CALL_PAREN_RIGHT(node, ns, _));
	}
,	"BinaryExpression": function(node) {
		visit(node.left); 
//		print(' '+node.operator+' '); 
		print(ns.variables.BYNARY_OPERATOR(node, ns, _));
		visit(node.right); 
	}

,	"ObjectExpression": function(node) {
//		if(node.properties.length===0) {
////			print('{}'); 
//			print(ns.variables.OBJECT_CURLY_LEFT(node, ns, _));
//			print(ns.variables.OBJECT_CURLY_RIGHT(node, ns, _));
//			return; 
//		}
//		print('{'); 
		print(ns.variables.OBJECT_CURLY_LEFT(node, ns, _));
		ns.blockCount++;
//		indent();
		for ( var i = 0; i < node.properties.length; i++) {
			var p = node.properties[i];			
			visit(p.key); 
			print(': '); 
			visit(p.value);
			if(i < node.properties.length-1) {
				print(ns.variables.OBJECT_COMMA(node, ns, _));
				
//				ns.print(ns.newline); 
//				ns._printIndent(ns.blockCount-1);
//				print(','+ns.tab); 
			}
		}
		ns.blockCount--;
//		indent();
//		print('}'); 
		print(ns.variables.OBJECT_CURLY_RIGHT(node, ns, _));
	}
,	"ReturnStatement": function(node) {
//		indent();	
//		print('return '); 
		print(ns.variables.RETURN(node, ns, _));
		visit(node.argument); 
		print(ns.variables.STMT_SEMICOLON(node, ns, _)); 
	}
,	"ConditionalExpression": function(node) {
		visit(node.test); 
//		print(' ? '); 
		print(ns.variables.QUESTION(node, ns, _));
		visit(node.consequent);
//		print(' : '); 
		print(ns.variables.COLON(node, ns, _));
		visit(node.alternate);
	}

,	"SwitchStatement": function(node) {
//		indent();
//		print('switch (');
		print(ns.variables.SWITCH(node, ns, _));
		print(ns.variables.SWITCH_PAREN_LEFT(node, ns, _));
		visit(node.discriminant); 
//		print(')');
//		indent();
		print(ns.variables.SWITCH_PAREN_RIGHT(node, ns, _));
//		print('{');
		print(ns.variables.SWITCH_CURLY_LEFT(node, ns, _));
		for(var i = 0; i < node.cases.length; i++) {
			visit(node.cases[i]); 
		}

//		indent();
//		print('}'); 
		print(ns.variables.SWITCH_CURLY_RIGHT(node, ns, _));
	}
,	"SwitchCase": function(node) {
//		indent();
//		print(node.test==null ? 'default' : 'case ');
		print(ns.variables.SWITCH_CASE(node, ns, _));
		visit(node.test); 
//		print(':');
		print(ns.variables.SWITCH_COLON(node, ns, _));
		ns.blockCount++;		
		for(var i = 0; i < node.consequent.length; i++) {	
			visit(node.consequent[i]); 
		}
		ns.blockCount--;
	}
,	"EmptyStatement": function(node) {
		// print(';');
		print(ns.variables.STMT_SEMICOLON(node, ns, _)); 
	}
,	"BreakStatement": function(node) {
//		indent(); 
//		print('break;');
		print(ns.variables.BREAK(node, ns, _)); 
	}

,	"WhileStatement": function(node) {
//		indent(); 
//		print('while ( ');
		print(ns.variables.WHILE(node, ns, _));
		print(ns.variables.WHILE_PAREN_LEFT(node, ns, _));
		visit(node.test); 
//		print(' ) ');
		print(ns.variables.WHILE_PAREN_RIGHT(node, ns, _));
//		indent();
//		print('{'); 
		print(ns.variables.WHILE_CURLY_LEFT(node, ns, _));		
		ns.blockCount++;
		visit(node.body);
		ns.blockCount--;		
//		indent();
//		print('}'); 
		print(ns.variables.WHILE_CURLY_RIGHT(node, ns, _));
	}
,	"AssignmentExpression": function(node) {
		visit(node.left);
//		print(' '+node.operator+' '); 
		print(ns.variables.OPERATOR_ASSIGNMENT(node, ns, _));
		visit(node.right); 
	}
,	"MemberExpression": function(node) {
		visit(node.object);
//		print('.'); 
		print(ns.variables.OPERATOR_DOT(node, ns, _));
		visit(node.property); 
	}

,	"ThisExpression": function(node) {
//		print('this');  
		print(ns.variables.THIS(node, ns, _));
	}

,	"SequenceExpression": function(node) {
//		print('( ');   
		print(ns.variables.SEQUENCE_PAREN_LEFT(node, ns, _));
		for ( var i = 0; i < node.expressions.length; i++) {
			visit(node.expressions[i]);
			if(i < node.expressions.length-1)
//				print(', ');
				print(ns.variables.SEQUENCE_COMMA(node, ns, _));
		}
//		print(' )');
		print(ns.variables.SEQUENCE_PAREN_RIGHT(node, ns, _));
	}
,	"DoWhileStatement": function(node) {
//		indent();
//		print('do');
		print(ns.variables.DO(node, ns, _));		
//		indent();
//		print('{'); 
		print(ns.variables.DO_CURLY_LEFT(node, ns, _));	
		ns.blockCount++;
		visit(node.body);
		ns.blockCount--;
//		indent();
//		print('}');
		print(ns.variables.DO_CURLY_RIGHT(node, ns, _));	
//		indent();		
//		print('while ( ');
		print(ns.variables.WHILE(node, ns, _));
		print(ns.variables.WHILE_PAREN_LEFT(node, ns, _));	
		visit(node.test);
//		print(' )');
		print(ns.variables.WHILE_PAREN_RIGHT(node, ns, _));
		print(ns.variables.STMT_SEMICOLON(node, ns, _));
	}
,	"NewExpression": function(node) {
//		print('new '); 
		print(ns.variables.NEW(node, ns, _));	
		visit(node.callee); 
//		print('('); 
		print(ns.variables.NEW_PAREN_LEFT(node, ns, _));
		for ( var i = 0; i < node.arguments.length; i++) {
			visit(node.arguments[i]);
			if(i < node.arguments.length-1)
//				print(', ');
				print(ns.variables.NEW_COMMA(node, ns, _));
		}
//		print(')'); 
		print(ns.variables.NEW_PAREN_RIGHT(node, ns, _));
	}
,	"WithStatement": function(node) {
//		indent();
//		print('with ( '); 
		print(ns.variables.WITH(node, ns, _));
		print(ns.variables.WITH_PAREN_LEFT(node, ns, _));
		visit(node.object); 
//		print(' )'); 
		print(ns.variables.WITH_PAREN_RIGHT(node, ns, _));
//		indent();
//		print('{')
		print(ns.variables.WITH_CURLY_LEFT(node, ns, _));
		ns.blockCount++;
		visit(node.body);
		ns.blockCount--;
//		indent();
//		print('}');
		print(ns.variables.WITH_CURLY_RIGHT(node, ns, _));
		print(ns.variables.STMT_SEMICOLON(node, ns, _));	
//		indent();
	}
,	"IfStatement": function(node, config) {
		if(!config || !config.noFirstNewLine)
			indent(); 
		print('if ( '); 
		visit(node.test); 
		print(' )'); 
		indent();
		
		print('{');
		ns.blockCount++;
		visit(node.consequent);
		ns.blockCount--;
		indent();
		print('}');

		if(node.alternate) {
			indent();
			print('else ');
			if(node.alternate.test==null) {
				indent();
				print('{');
				ns.blockCount++;
			}
			visit(node.alternate, {noFirstNewLine: true});
			if(node.alternate.test==null) {
				ns.blockCount--;
				indent();
				print('}');
			}
		}
	}

,	"FunctionDeclaration": function(node, config) {
		indent(); 
		print('function ');
		visit(node.id); 
		print(' ( '); 
		if(node.params) for ( var i = 0; i < node.params.length; i++) {
			visit(node.params[i]); 
			if(i< node.params.length-1)
				print(', '); 		 
		}
		print(' ) '); 
		indent();
		print('{');
		ns.blockCount++;
		visit(node.body); 
		ns.blockCount--;
		indent();
		print('}');
	}
,	"UnaryExpression": function(node) {
		print(node.operator+" ");
		visit(node.argument); 
	}
,	"LogicalExpression": function(node) {
		visit(node.left); 
		print(' '+node.operator+' '); 
		visit(node.right); 
	}

,	"TryStatement": function(node) {
		indent();
		print('try');
		indent();
		print('{');
		ns.blockCount++;
		visit(node.block); 
		ns.blockCount--;
		indent();
		print('}');
		for ( var i = 0; i < node.handlers.length; i++) {
			visit(node.handlers[i]); 
		}
		indent();
		print('finally'); 
		indent();
		print('{');
		ns.blockCount++;
		visit(node.finalizer); 
		ns.blockCount--;
		indent();
		print('}');
	}
,	"CatchClause": function(node) {
		console.log(node); 
		indent();
		print('catch ( '); 
		node.param && visit(node.param); 
//		if(node.params) for ( var i = 0; i < node.params.length; i++) {
//			visit(node.params[i]); 
//			if(i< node.params.length-1)
//				print(', '); 		 
//		}
		print(' ) ');
		indent();
		print('{');
		ns.blockCount++;
		visit(node.body); 
		ns.blockCount--;
		indent();
		print('}');
	}
,	"ThrowStatement": function(node) {
		indent();
		print('throw '); 
		visit(node.argument);
		print(ns.variables.STMT_SEMICOLON(node, ns, _));//print(';')
	}
,	"ForInStatement": function(node) {
		indent();
		print("for ( "); 
		visit(node.left, {noFirstNewLine: true, noLastSemicolon: true}); 	
		print(' in '); 
		visit(node.right); 
		print(' )')
		
		indent();
		print('{');
		ns.blockCount++;
		visit(node.body); 
		ns.blockCount--;
		indent();
		print('}');
		print(ns.variables.STMT_SEMICOLON(node, ns, _));
	}
,	"ContinueStatement": function(node){
		indent();
		print('continue'); 
		print(ns.variables.STMT_SEMICOLON(node, ns, _));
	}


,	"Block": function(node) {/* support for block comments like this one*/
		indent();
		print('/* '); 
		print(node.value); 
		print(' */'); 
//		indent(); 
	}
,	"Line": function(node) {//support for line comments like this one
		indent(); 
		print('// '); 
		print(node.value); 
		indent(); 
	}


}	


})();
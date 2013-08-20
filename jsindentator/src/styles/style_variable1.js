
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
	STMT_SEMICOLON: 		'return "; "',
	
	FUNCTION: 				'return "function "',
	FUNCTION_LP:			'return " ( "',
	FUNCTION_RP: 			'return" ) "',
	FUNCTION_PARAM_COMMA: 	'return", "',
	FUNCTION_BODY_LP:		'return "{" + ns.Indent()'
	
	/*a simple type literal like strings, number, boolean, null, undefined, etc. Not object or functions.*/ 
,	LITERAL: 				function(node, ns, _){
		/*if the literal is an string in double quotes print a nasty warning comment.*/ 
		if(node.raw.indexOf('"')===0) {
			ns.print(' /* TODO: HEY, we use single quotes, fix this literal: */'+ node.raw);
		}
		else {
			ns.print(node.raw);
		}
	}
,	IDENTIFIER: 			'return node.name'
	
	//Block comment (using /* */)
,	"Block": 				'ns.Indent() + "/* " + node.value + " */"'
	
	//line comment (using //) 
,	"Line": 				'ns.Indent() + "// " + node.value '
	
}; 



ns.Indent=function(nonl) {
	var s = [];	
	if(!nonl)
		s.push(ns.newline); 
	for(var i = 0; i<ns.blockCount; i++) 
		s.push(ns.tab); 
	return s.join(''); 
}


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
		
		print(ns.variables.FUNCTION_LP(node, ns, _)); 
		for( var i = 0; i < node.params.length; i++) {
			visit(node.params[i]); 
			if(i < node.params.length-1)
				print(ns.variables.FUNCTION_PARAM_COMMA(node, ns, _));					
		}
		print(ns.variables.FUNCTION_RP(node, ns, _));
		if(node.body.body.length>0) {
			print(ns.variables.FUNCTION_BODY_LP(node, ns, _));
			ns.blockCount++;	
			visit(node.body); 
			ns.blockCount--;
			indent();
			print('}')
		}
		else {
			print('{}');  
		}
			
	}
,	"BlockStatement": function(node) {	
		for ( var i = 0; i < node.body.length; i++) {
			visit(node.body[i]);
		}
	}
,	"UpdateExpression": function(node) {				  
		if(node.prefix) {
			print(node.operator);
			visit(node.argument); 
		}
		else {
			visit(node.argument); 
			print(node.operator);
		}
	}
,	"ForStatement": function(node) {
		indent(); 
		print('for('); 
		visit(node.init, {noFirstNewLine: true});
		visit(node.test);
		print('; ');
		visit(node.update);
		print(')');
		indent();
		print('{'); 
		ns.blockCount++;
		visit(node.body);
		ns.blockCount--;
		indent(); 
		print('}'); 
	}
,	"ArrayExpression": function(node) {	
		print('['); 
		for ( var i = 0; i < node.elements.length; i++) {
			visit(node.elements[i]);
			if(i < node.elements.length-1)
				print(', ');
		}
		print(']'); 
	}

,	"ExpressionStatement": function(node) {
		indent(); 
		visit(node.expression);
		print(ns.variables.STMT_SEMICOLON(node, ns, _)); //print(';'); 
	}
,	"CallExpression": function(node) {
		if(node.callee.type==="FunctionExpression"){//hack - parenthesis around functions
			print('(');		
		}
		visit(node.callee); 
		if(node.callee.type==="FunctionExpression"){//hack - parenthesis around functions
			print(')');
		}
	
		print(' ( '); 
		for ( var i = 0; i < node.arguments.length; i++) {
			visit(node.arguments[i]);
			if(i < node.arguments.length-1)
				print(', ');
		}
		print(' ) '); 
	}
,	"BinaryExpression": function(node) {
		visit(node.left); 
		print(' '+node.operator+' '); 
		visit(node.right); 
	}

,	"ObjectExpression": function(node) {
		if(node.properties.length===0) {
			print('{}'); 
			return; 
		}
		print('{'); 
		ns.blockCount++;
		indent();
		for ( var i = 0; i < node.properties.length; i++) {
			var p = node.properties[i];			
			visit(p.key); 
			print(': '); 
			visit(p.value);
			if(i < node.properties.length-1) {
				ns.print(ns.newline); 
				ns._printIndent(ns.blockCount-1);
				print(','+ns.tab); 
			}
		}
		ns.blockCount--;
		indent();
		print('}'); 
	}
,	"ReturnStatement": function(node) {
		indent();	
		print('return '); 
		visit(node.argument); 
		print(ns.variables.STMT_SEMICOLON(node, ns, _)); 
	}
,	"ConditionalExpression": function(node) {
		visit(node.test); 
		print(' ? '); 
		visit(node.consequent);
		print(' : '); 
		visit(node.alternate);
	}

,	"SwitchStatement": function(node) {
		indent();
		print('switch (');
		visit(node.discriminant); 
		print(')');
		indent();
		 print('{'); 
		for(var i = 0; i < node.cases.length; i++) {
			visit(node.cases[i]); 
		}

		indent();
		print('}'); 
	}
,	"SwitchCase": function(node) {
		indent();
		print(node.test==null ? 'default' : 'case ');
		visit(node.test); 
		print(':');
		ns.blockCount++;
		
		for(var i = 0; i < node.consequent.length; i++) {	
			visit(node.consequent[i]); 
		}
		ns.blockCount--;
	}
,	"EmptyStatement": function(node) {
	print(ns.variables.STMT_SEMICOLON(node, ns, _));//print(';'); 
	}
,	"BreakStatement": function(node) {
		indent(); 
		print('break;');
	}

,	"WhileStatement": function(node) {
		indent(); 
		print('while ( ');
		visit(node.test); 
		print(' ) ');
		indent();
		print('{'); 
		
		ns.blockCount++;
		visit(node.body);
		ns.blockCount--;
		
		indent();
		print('}'); 
	}
,	"AssignmentExpression": function(node) {
		visit(node.left);
		print(' '+node.operator+' '); 
		visit(node.right); 
	}
,	"MemberExpression": function(node) {
		visit(node.object);
		print('.'); 
		visit(node.property); 
	}

,	"ThisExpression": function(node) {
		print('this');  
	}

,	"SequenceExpression": function(node) {
		print('( ');   
		for ( var i = 0; i < node.expressions.length; i++) {
			visit(node.expressions[i]);
			if(i < node.expressions.length-1)
				print(', ');
		}
		print(' )');
	}
,	"DoWhileStatement": function(node) {
		indent();
		print('do');
		
		indent();
		print('{')
		ns.blockCount++;
		visit(node.body);
		ns.blockCount--;
		indent();
		print('}');	
		indent();
		
		print('while ( ');
		visit(node.test);
		print(' )');
		print(ns.variables.STMT_SEMICOLON(node, ns, _));
	}
,	"NewExpression": function(node) {
		print('new '); 
		visit(node.callee); 
		print('('); 
		for ( var i = 0; i < node.arguments.length; i++) {
			visit(node.arguments[i]);
			if(i < node.arguments.length-1)
				print(', ');
		}
		print(')'); 
	}
,	"WithStatement": function(node) {
		indent();
		print('with ( '); 
		visit(node.object); 
		print(' )'); 
		indent();
		print('{')
		ns.blockCount++;
		visit(node.body);
		ns.blockCount--;
		indent();
		print('}');
		print(ns.variables.STMT_SEMICOLON(node, ns, _));	
		indent();
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

(function() {
var ns = jsindentator, visit=ns.visit, print=ns.print, indent=ns.printIndent;

if(!ns.styles)ns.styles={};
ns.config={}; //this style's configuration is defined in its own config namespace
ns.config["VAR"]='var ';
ns.config["VAR_COMMA"]=', ';
ns.config["VAR_DECL_NEWLINE='ns.Indent()+","+ns.tab;'; //all values are eval() uated and the objects _ and ns are available
ns.config.VAR_DECL_INIT=' = '; 
ns.config.STMT_SEMICOLON='; ';//the semicolon after a statement. 
ns.config.FUNCTION='function /* FFF*/'; 
ns.config.FUNCTION_LP=' ( ';
ns.config.FUNCTION_RP=' ) ';
ns.config.FUNCTION_PARAM_COMMA=', ';
ns.config.FUNCTION_BODY_LP='"{"+ns.Indent()'; 


ns.Indent=function(nonl) {
	var s = [];	
	if(!nonl)
		s.push(ns.newline); 
	for(var i = 0; i<ns.blockCount; i++) 
		s.push(ns.tab); 
	return s.join(''); 
}

ns.evalStr = function(s) {
	var buf = [], quoted = '\''+s.replace(/'/g, '\\\'')+'\''; 
	buf.push('(function(_, ns){');
	buf.push('  return ('+quoted+'); ');
	buf.push('})'); 
	var fn = eval(buf.join('')); 
	return fn(_, ns); 	
}; 

//compile all variables:


jsindentator.styles.variable1 = {
	installStyle: function() {
		ns.variables = {};
		for(var i in ns.config) {
			debugger; 
			ns.variables[i] = ns.evalStr(ns.config[i]); 
		}
	}
	
,	"VariableDeclaration" : function(node, config) {
		if(!config || !config.noFirstNewLine) //var decls in for stmts
			indent(); 
		print(ns.variables.VAR); 
		for ( var i = 0; i < node.declarations.length; i++) {
			visit(node.declarations[i]); 
			if(i< node.declarations.length-1) {
//				if((!config || !config.noFirstNewLine) && ns.variables.VAR_DECL_NEWLINE) {
				if(!config || !config.noFirstNewLine) {
					ns.variables.VAR_DECL_NEWLINE; 
				}
				else {
					print(ns.variables.VAR_COMMA); 
				}
			}	 
		}
		if(!config || !config.noLastSemicolon) //this is a statement! so we may need to print a semicolon
			print(ns.variables.STMT_SEMICOLON); 
	}

,	"VariableDeclarator" : function(node) {
		ns.print(node.id.name);
		debugger; 
		if(node.init) {
			print(ns.variables.VAR_DECL_INIT); 
			visit(node.init);
		}
	}

,	"Literal" : function(node) {
		if(node.raw.indexOf('"')===0||node.raw.indexOf('\'')===0) {
			//we do not force to configured string quotes because changing it can invalidate the output js but we warned it.
			//print(ns.quote+node.value+ns.quote); 
			print(node.raw);
	//		ns.log('String literal with incorrect quotes. Position: '+ns.printNodePosition(node)+' - value: '+node.raw+); 
		}
		else {
			print(node.raw);
		}
	}
,	"Identifier": function(node) {
		print(node.name || ''); 
	}
,	"FunctionExpression": function(node) {
		print(ns.variables.FUNCTION);
		visit(node.id);
		
		print(ns.variables.FUNCTION_LP); 
		for( var i = 0; i < node.params.length; i++) {
			visit(node.params[i]); 
			if(i < node.params.length-1)
				print(ns.variables.FUNCTION_PARAM_COMMA);					
		}
		print(ns.variables.FUNCTION_RP);
		if(node.body.body.length>0) {
			print(ns.variables.FUNCTION_BODY_LP);
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
		print(ns.variables.STMT_SEMICOLON); //print(';'); 
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
		print(ns.variables.STMT_SEMICOLON); 
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
	print(ns.variables.STMT_SEMICOLON);//print(';'); 
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
		print(ns.variables.STMT_SEMICOLON);
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
		print(ns.variables.STMT_SEMICOLON);	
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
		print(ns.variables.STMT_SEMICOLON);//print(';')
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
		print(ns.variables.STMT_SEMICOLON);
	}
,	"ContinueStatement": function(node){
		indent();
		print('continue'); 
		print(ns.variables.STMT_SEMICOLON);
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
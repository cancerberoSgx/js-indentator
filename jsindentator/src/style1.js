
// in this code node name means javascript language ast nodes like expression, declaration, statement, etc, not DOM or xml nodes!
// rules for indentation: 1) who call visit(anIndentedBlock) is responsible of incrementing and decrementing the indentation counter. 2) statements are responsible of indenting before and printing a last ';'
(function() {
var ns = jsindentator, visit=ns.visit, print=ns.print, indent=ns.printIndent; 
jsindentator.visitorsStyle1 = {
	
	"VariableDeclaration" : function(node, config) {
		if(!config || !config.noFirstNewLine) //var decls in for stmts
			indent(); 
		print('var '); 
		for ( var i = 0; i < node.declarations.length; i++) {
			visit(node.declarations[i]); 
			if(i< node.declarations.length-1) {
				if(!config || !config.noFirstNewLine) {
					indent(); 
					print(','+ns.tab); 	
				}
				else {
					print(', '); 
				}
			}	 
		}
		if(!config || !config.noLastSemicolon) 
			print('; '); 
	}

,	"VariableDeclarator" : function(node) {
		ns.print(node.id.name);
		if(node.init) {
			print(" = "); 
			visit(node.init);
		}
	}

,	"Literal" : function(node) {
		if(node.raw.indexOf('"')===0||node.raw.indexOf('\'')===0) {
			print(ns.quote+node.value+ns.quote); 
		}
		else {
			print(node.raw);
		}
	}
,	"Identifier": function(node) {
		print(node.name || ''); 
	}
,	"FunctionExpression": function(node) {
		print('function ');
		visit(node.id);
		print(' ( '); 
		for( var i = 0; i < node.params.length; i++) {
			visit(node.params[i]); 
			if(i < node.params.length-1)
				print(', ');					
		}
		print(' ) ');
		if(node.body.body.length>0) {
			indent();
			print('{')
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
		print(';'); 
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
		print(';'); 
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
		print(';'); 
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
		print(' );');
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
		print('};');	
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
		print(';')
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
	}
,	"ContinueStatement": function(node){
		indent();
		print('continue;'); 
	}

}	
})();
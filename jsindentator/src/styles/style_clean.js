
// in this code node name means javascript language ast nodes like expression, declaration, statement, etc, not DOM or xml nodes!
// style clean can be used for those concrete data generation tools only for make sure every ast node is iterated. 
// It also support the config.saveParents config prop for saving the parent node
// TODO: only single line code supported !
(function() {
var ns = jsindentator, print=ns.print; 
if(!jsindentator.styles)jsindentator.styles={};
var visit=function(child, config, parent) {
	config=config||{};
	config.parentNode=parent?parent:null;		
	ns.visit(child, config)
}
jsindentator.styles.clean = {
	
	"VariableDeclaration" : function(node, config) {
		print('var '); 
		for ( var i = 0; i < node.declarations.length; i++) {
			visit(node.declarations[i]); 
			if(i< node.declarations.length-1)
				print(','); 		 
		}
		if(!config || !config.noLastSemicolon) 
			print(';'); 
	}

,	"VariableDeclarator" : function(node, config) {
//		ns.print(node.id.name);
		visit(node.id);
		if(node.init) {
			print("="); 
			visit(node.init);
		}
	}
	
	

,	"Literal" : function(node) {
		print(node.raw); 
	}
,	"Identifier": function(node) {
		print(node.name || ''); 
	}
,	"FunctionExpression": function(node) {
		print('function ');
		visit(node.id);
		print('('); 
		for( var i = 0; i < node.params.length; i++) {
			visit(node.params[i]); 
			if(i < node.params.length-1)
				print(',');					
		}
		print('){');
		ns.blockCount++;
		visit(node.body); 
		ns.blockCount--;
		print('}'); 
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
		print('for('); 
		visit(node.init, {noFirstNewLine: true});
//				print('; '); 
		visit(node.test);
		print(';');
		visit(node.update);
		print('){'); 
//				ns.printIndent(); 
		ns.blockCount++;
		visit(node.body);
		ns.blockCount--;
//		ns.printIndent(); 
		print('};'); 
	}
,	"ArrayExpression": function(node) {	
		print('['); 
		for ( var i = 0; i < node.elements.length; i++) {
			visit(node.elements[i]);
			if(i < node.elements.length-1)
				print(',');
		}
		print(']'); 
	}

,	"ExpressionStatement": function(node) {
		visit(node.expression);
		print(';'); 
	}
,	"CallExpression": function(node) {	
		if(node.callee.type==="FunctionExpression"){print('(');ns.blockCount++;}//hack - parenthesis around functions
		visit(node.callee)
		if(node.callee.type==="FunctionExpression"){print(')');ns.blockCount--;}//hack - parenthesis around functions
		print('('); 
		for ( var i = 0; i < node.arguments.length; i++) {
			visit(node.arguments[i]);
			if(i < node.arguments.length-1)
				print(',');
		}
		print(')'); 
	}
,	"BinaryExpression": function(node) {
		visit(node.left); 
		print(node.operator==='in'?' in ':node.operator); 
		visit(node.right); 
	}

,	"ObjectExpression": function(node) {
		print('{'); 
		ns.blockCount++;
		for ( var i = 0; i < node.properties.length; i++) {
			var p = node.properties[i];
			
			visit(p.key); //Identifier
			print(':'); 
			visit(p.value); //*Expression
			if(i < node.properties.length-1) {
				print(','); 
			}
		}
		ns.blockCount--;
		print('}'); 
	}
,	"ReturnStatement": function(node) {
		print('return '); 
		visit(node.argument); 
		print(';'); 
	}

,	"ConditionalExpression": function(node) {
		visit(node.test); 
		print('?'); 
		visit(node.consequent);
		print(':'); 
		visit(node.alternate);
	}
,	"EmptyStatement": function(node) {
		print(';'); 
	}

,	"SwitchStatement": function(node) {
		print('switch(');
		visit(node.discriminant); 
		print('){');
		for(var i = 0; i < node.cases.length; i++) {
			visit(node.cases[i]); 
		}
		print('}'); 
	}
,	"SwitchCase": function(node) {
		print(node.test==null ? 'default' : 'case ');
		visit(node.test); 
		print(':'); 
		for(var i = 0; i < node.consequent.length; i++) {			
			visit(node.consequent[i]); 
		}
	}
,	"BreakStatement": function(node) {
		print('break;');
	}

,	"WhileStatement": function(node) {
		print('while(');
		visit(node.test); 
		print('){');
		ns.blockCount++;
		visit(node.body);
		ns.blockCount--;
		print('}'); 
	}
,	"AssignmentExpression": function(node) {
		visit(node.left);
		print(node.operator); 
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
		print('(');   
		for ( var i = 0; i < node.expressions.length; i++) {
			visit(node.expressions[i]);
			if(i < node.expressions.length-1)
				print(',');
		}
		print(')');
	}
,	"DoWhileStatement": function(node) {
		print('do{');
		visit(node.body);
		print("}while(");
		visit(node.test);
		print(');');
	}

,	"NewExpression": function(node) {
		print('new '); 
		visit(node.callee); 
		print('('); 
		for ( var i = 0; i < node.arguments.length; i++) {
			visit(node.arguments[i]);
			if(i < node.arguments.length-1)
				print(',');
		}
		print(')'); 
	}
,	"WithStatement": function(node) {
		print('with('); 
		visit(node.object); 
		print(')'); 
		print('{')
		ns.blockCount++;
		visit(node.body);
		ns.blockCount--;
		print('};');
	}

,	"IfStatement": function(node, config) {
		print('if('); 
		visit(node.test); 
		print(')'); 		
		print('{');
		ns.blockCount++;
		visit(node.consequent);
		ns.blockCount--;
		if(node.alternate) {
			print('}else ');//TODO: this space can be better minified
			if(node.alternate.test==null) {
				print('{');
				ns.blockCount++;	
				visit(node.alternate, {noFirstNewLine: true});
				ns.blockCount--;
				print('}');
			}
			else
				visit(node.alternate, {noFirstNewLine: true});
		}
	}

,	"FunctionDeclaration": function(node, config) {
		print('function');
		if(node.id) {
			print(' ');
			visit(node.id); 
		} 
		print('('); 
		if(node.params) for ( var i = 0; i < node.params.length; i++) {
			visit(node.params[i]); 
			if(i< node.params.length-1)
				print(','); 		 
		}
		print('){');
		ns.blockCount++;
		visit(node.body); 
		ns.blockCount--;
		print('}');
	}
,	"UnaryExpression": function(node) {
		print(node.operator);
		visit(node.argument); 
	}
,	"LogicalExpression": function(node) {
		visit(node.left); 
		print(node.operator); 
		visit(node.right); 
	}
,	"TryStatement": function(node) {
		print('try{');
		ns.blockCount++;
		visit(node.block); 
		ns.blockCount--;
		print('}');
		for ( var i = 0; i < node.handlers.length; i++) {
			visit(node.handlers[i]); 
		}
		if(node.finalizer) {
			print('finally'); 
			print('{');
			ns.blockCount++;
			visit(node.finalizer); 
			ns.blockCount--;
			print('}');
		}
	}
,	"CatchClause": function(node) {
		print('catch('); 
		if(node.params) for ( var i = 0; i < node.params.length; i++) {
			visit(node.params[i]); 
			if(i< node.params.length-1)
				print(','); 		 
		}
		print('){');
		ns.blockCount++;
		visit(node.body); 
		ns.blockCount--;
		print('}');
	}
,	"ThrowStatement": function(node) {
		print('throw '); 
		visit(node.argument);
		print(';')
	}

,	"ForInStatement": function(node) {
		print("for("); 
		visit(node.left, {noFirstNewLine: true, noLastSemicolon: true}); 	
		print(' in '); 
		visit(node.right); 
		print(')')		
		print('{');
		ns.blockCount++;
		visit(node.body); 
		ns.blockCount--;
		print('}');
	}
,	"ContinueStatement": function(node){
		print('continue;'); 
	}

,	"Block": function(node) {/* support for block comments like this one*/
	}
,	"Line": function(node) {//support for line comments like this one
	}
}
})();




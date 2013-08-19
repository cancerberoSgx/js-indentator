
// TODO: docs
(function() {
var ns = jsindentator, visit=ns.visit, print=ns.print, indent=ns.printIndent;

if(!jsindentator.styles)jsindentator.styles={};

if(!ns.styles.prettify1)
	ns.styles.prettify1={};

var config = {};

if(!ns.styles.prettify1.config) {
	ns.styles.prettify1.config = config = {
		tag: 'b'
	};
}
var htmlOpen = function(classes) {
	print('<'+config.tag + (classes ? ' class="' + classes + '"' : '') + '>' )
}
,	htmlClose = function() {
	print('</'+config.tag+'>' )
}
,	htmlPrint = function(content, classes) {
	htmlOpen(classes); 
	print(content); 
	htmlClose(); 
}; 

jsindentator.styles.prettify1 = {
	
	"VariableDeclaration" : function(node, config) {
		htmlOpen('VariableDeclaration'+((config&&config.noFirstNewLine)?' noNewLine':'')); 
		if(!config || !config.noFirstNewLine) //var decls in for stmts
			indent(); 
		htmlPrint('var', 'var keyword'); 
		//print('var '); 
		for ( var i = 0; i < node.declarations.length; i++) {
			visit(node.declarations[i]); 
			if(i< node.declarations.length-1) {
				htmlPrint(',', 'comma'); 
//				print(', '); 
//				indent();
//				print(ns.tab); 
			}	 
		}
		if(!config || !config.noLastSemicolon) {
//			print('; ');
			htmlPrint(';', 'semicolon'); 
		}
		htmlClose();
	}

,	"VariableDeclarator" : function(node) {
		htmlOpen('VariableDeclarator'); 
		visit(node.id);
//		htmlPrint(node.id.name, 'identifier');
//		ns.print(node.id.name);
		if(node.init) {
			htmlPrint("=", 'operand');
//			print(" = "); 
			visit(node.init);
		}
		htmlClose();
	}

,	"Literal" : function(node) {
		htmlOpen('Literal'); 
		print(node.raw);
		htmlClose();
	}
,	"Identifier": function(node) {
		htmlOpen('Identifier'); 
		print(node.name);
		htmlClose(); 
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
//			indent();
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
		print('for ( '); 
		visit(node.init, {noFirstNewLine: true});
		visit(node.test);
		print('; ');
		visit(node.update);
		print(' ) ');
//		indent();
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
//				ns.print(ns.newline); 
//				ns._printIndent(ns.blockCount-1);
				print(', ');
				indent();
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
//		indent();
		 print(' {'); 
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
//		indent();
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
		
//		indent();
		print('{')
		ns.blockCount++;
		visit(node.body);
		ns.blockCount--;
		indent();
		print('} ');	
//		indent();
		
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
//		indent();
		print(' {')
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
//		indent();
		
		print(' { ');
		ns.blockCount++;
		visit(node.consequent);
		ns.blockCount--;
		indent();
		print('}');

		if(node.alternate) {
			indent();
			print('else ');
			if(node.alternate.test==null) {
//				indent();
				print(' {');
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
//		indent();
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
//		indent();
		print(' {');
		ns.blockCount++;
		visit(node.block); 
		ns.blockCount--;
		indent();
		print('}');
		for ( var i = 0; i < node.handlers.length; i++) {
			visit(node.handlers[i]); 
		}
		if(node.finalizer) {
			indent();
			print('finally'); 
//			indent();
			print(' {');
			ns.blockCount++;
			visit(node.finalizer); 
			ns.blockCount--;
			indent();
			print('}');
		}
	}
,	"CatchClause": function(node) {
//		console.log(node); 
		indent();
		print('catch ( '); 
		node.param && visit(node.param); 
//		if(node.params) for ( var i = 0; i < node.params.length; i++) {
//			visit(node.params[i]); 
//			if(i< node.params.length-1)
//				print(', '); 		 
//		}
		print(' )');
//		indent();
		print(' {');
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
		
//		indent();
		print(' {');
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
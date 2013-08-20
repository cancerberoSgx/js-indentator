/*
 * a very basic javascript code prettifier to HTML using js-indentator. Available CSS class names: 
 * 
	operators:
	operand, colon, semicolon, paren, curly, coma
	
	keywords: 
	keyword keyword-return keyword-function, keyword-var keyword-for, etc

 */
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
		htmlOpen('VariableDeclaration '+((config&&config.noFirstNewLine)?' noNewLine':'')); 
		if(!config || !config.noFirstNewLine) //var decls in for stmts
			indent(); 
		htmlPrint('var', 'keyword-var keyword'); 
		//print('var '); 
		for ( var i = 0; i < node.declarations.length; i++) {
			visit(node.declarations[i]); 
			if(i< node.declarations.length-1) {
				htmlPrint(',', 'comma operand'); 
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
		htmlPrint(node.raw, 'Literal');
//		htmlOpen('Literal'); 
//		var classStr = '';
//		if(!node.raw)
//			classStr = "literal-false";
//		else if(_.isString(node.raw))
//		TODO: make a html class like litera-string, literal-boolean, literal-number, etc.
//		print(node.raw);
//		htmlClose();
	}
,	"Identifier": function(node) {		
		htmlPrint(node.name, 'Identifier');
	}
,	"FunctionExpression": function(node) {
		htmlOpen('FunctionExpression'); 
//		print('function ');
		htmlPrint('function', 'keyword-function keyword');
		visit(node.id);
//		print(' ( '); 
		htmlPrint('(', 'paren-left');
		for( var i = 0; i < node.params.length; i++) {
			visit(node.params[i]); 
			if(i < node.params.length-1)
//				print(', ');
				htmlPrint(',', 'comma operand'); 
		}
//		print(' ) ');
		htmlPrint(')', 'paren-right'); 
		if(node.body.body.length>0) {
//			indent();
//			print('{')
			htmlPrint('{', 'curly-left');	
//			htmlOpen('block'); 
			ns.blockCount++;	
			visit(node.body); 
			ns.blockCount--;
//			htmlClose();
//			indent();
//			print('}')
			htmlPrint('}', 'curly-right');	
		}
		else {
//			print('{}');
			htmlPrint('{', 'curly-left');	
			htmlPrint('}', 'curly-right');	
		}
		htmlClose();	
	}
,	"BlockStatement": function(node) {	
		htmlOpen('BlockStatement'); 
		for ( var i = 0; i < node.body.length; i++) {
			visit(node.body[i]);
		}
		htmlClose();
	}
,	"UpdateExpression": function(node) {
		htmlOpen('UpdateExpression'); 
		if(node.prefix) {
//			print(node.operator);
			htmlPrint(node.operator, 'operator');	
			visit(node.argument); 
		}
		else {
			visit(node.argument); 
//			print(node.operator);
			htmlPrint(node.operator, 'operator');	
		}
		htmlClose();
	}
,	"ForStatement": function(node) {
		htmlOpen('BlockStatement statement'); 
//		indent();  
//		print('for ( '); 
		htmlPrint('for', 'keyword keyword-for');	
		htmlPrint('(', 'paren-left');
		visit(node.init, {noFirstNewLine: true});
		visit(node.test);
//		print('; ');
		htmlPrint(';', 'semicolon'); 
		visit(node.update);
//		print(' ) ');
		htmlPrint(')', 'paren-right'); 
//		indent();
//		print('{'); 
		htmlPrint('{', 'curly-right');	
		ns.blockCount++;
		visit(node.body);
		ns.blockCount--;
//		indent(); 
//		print('}'); 
		htmlPrint('}', 'curly-right');	
		htmlClose();
	}
,	"ArrayExpression": function(node) {
		htmlOpen('ArrayExpression'); 
//		print('[');
		htmlPrint('[', 'square-left');	
		for ( var i = 0; i < node.elements.length; i++) {
			visit(node.elements[i]);
			if(i < node.elements.length-1)
				print(', ');
		}
//		print(']'); 
		htmlPrint(']', 'square-right');
		htmlClose();
	}

,	"ExpressionStatement": function(node) {
		htmlOpen('ExpressionStatement'); 
//		indent(); 
		visit(node.expression);
//		print(';'); 
		htmlPrint(';', 'semicolon'); 
		htmlClose();
	}
,	"CallExpression": function(node) {
		htmlOpen('CallExpression'); 
		if(node.callee.type==="FunctionExpression"){//hack - parenthesis around functions
//			print('(');		
			htmlPrint('(', 'paren-left'); 
		}
		visit(node.callee); 
		if(node.callee.type==="FunctionExpression"){//hack - parenthesis around functions
//			print(')');
			htmlPrint(')', 'paren-right'); 
		}
	
//		print(' ( '); 
		htmlPrint('(', 'paren-left'); 
		for ( var i = 0; i < node.arguments.length; i++) {
			visit(node.arguments[i]);
			if(i < node.arguments.length-1) {
//				print(', ');
				htmlPrint(',', 'comma operand');
			}
		}
//		print(' ) ');
		htmlPrint(')', 'paren-right');
		htmlClose();
	}
,	"BinaryExpression": function(node) {
		htmlOpen('BinaryExpression');
		visit(node.left); 
		htmlPrint(node.operator, 'operand');
//		print(' '+node.operator+' '); 
		visit(node.right); 
		htmlClose();
	}

,	"ObjectExpression": function(node) {
		htmlOpen('ObjectExpression');
		if(node.properties.length===0) {
//			print('{}'); 
			htmlPrint('{', 'curly-left');	
			htmlPrint('}', 'curly-right');	
			return; 
		}
//		print('{'); 
		htmlPrint('{', 'curly-left');	
		ns.blockCount++;
//		indent();
		for ( var i = 0; i < node.properties.length; i++) {
			var p = node.properties[i];			
			visit(p.key); 
//			print(': '); 
			htmlPrint(node.operator, 'operand colon');
			visit(p.value);
			if(i < node.properties.length-1) {
//				ns.print(ns.newline); 
//				ns._printIndent(ns.blockCount-1);
//				print(', ');
				htmlPrint(',', 'comma operand');
//				indent();
			}
		}
		ns.blockCount--;
//		indent();
//		print('}'); 		
		htmlPrint('}', 'curly-right');
		htmlClose();
	}
,	"ReturnStatement": function(node) {
		htmlOpen('ReturnStatement');
//		indent();	
//		print('return '); 
		htmlPrint('return', 'keyword keyword-return');
		visit(node.argument); 
//		print(';'); 
		htmlPrint(';', 'semicolon'); 
		htmlClose();
	}
,	"ConditionalExpression": function(node) {
		htmlOpen('ConditionalExpression');
		visit(node.test); 
//		print(' ? '); 
		htmlPrint('?', 'question operand');
		visit(node.consequent);
//		print(' : '); 
		htmlPrint(':', 'colon operand');
		visit(node.alternate);
		htmlClose();
	}

,	"SwitchStatement": function(node) {
		htmlOpen('SwitchStatement');
//		indent();
		
//		print('switch');
		htmlPrint('switch', 'keyword keyword-switch');
		htmlPrint('(', 'paren-left');
		
		visit(node.discriminant); 
//		print(')');
		htmlPrint(')', 'paren-right');	
//		indent();
//		 print(' {'); 
		htmlPrint('{', 'curly-left');				
		for(var i = 0; i < node.cases.length; i++) {
			visit(node.cases[i]); 
		}
//		indent();
//		print('}');
		htmlPrint('}', 'curly-right');
		htmlClose();
	}
,	"SwitchCase": function(node) {
		htmlOpen('SwitchCase');
//		indent();		
//		print(node.test==null ? 'default' : 'case ');
		htmlPrint(node.test==null ? 'default' : 'case', 'keyword case');		
		visit(node.test); 
//		print(':');
		htmlPrint(':', 'operand colon');
		ns.blockCount++;		
		for(var i = 0; i < node.consequent.length; i++) {	
			visit(node.consequent[i]); 
		}
		ns.blockCount--;
		htmlClose();
	}
,	"EmptyStatement": function(node) {
		htmlOpen('EmptyStatement');
//		print(';'); 
		htmlPrint(';', 'semicolon');
		htmlClose();
	}
,	"BreakStatement": function(node) {
		htmlOpen('EmptyStatement');
		htmlPrint('break', 'keyword keyword-break');
		htmlPrint(';', 'semicolon');		
		htmlClose();
//		indent(); 
//		print('break;');
	}

,	"WhileStatement": function(node) {
//		indent(); 
//		print('while ( ');
		htmlOpen('EmptyStatement');
		htmlPrint('(', 'paren-left');		
		visit(node.test); 
//		print(' ) ');
		htmlPrint(')', 'paren-right');		
//		indent();
//		print('{'); 
		htmlPrint('{', 'curly-left');			
		ns.blockCount++;
		visit(node.body);
		ns.blockCount--;		
//		indent();
//		print('}'); 		
		htmlPrint('}', 'curly-right');	

	}
,	"AssignmentExpression": function(node) {
		htmlOpen('MemberExpression');
		visit(node.left);
		print(' '+node.operator+' '); 
		visit(node.right); 	
		htmlClose();
	}
,	"MemberExpression": function(node) {
		htmlOpen('MemberExpression');
		visit(node.object);
		htmlPrint('.', 'operand dot');
//		print('.'); 
		visit(node.property); 	
		htmlClose();
	}

,	"ThisExpression": function(node) {
		htmlOpen('ThisExpression');
//		print('this');  
		htmlPrint('this', 'keyword keyword-this');		
		htmlClose();
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
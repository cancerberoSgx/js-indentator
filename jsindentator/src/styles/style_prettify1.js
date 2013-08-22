/*
 * This is a pure HTML Javascript prettifier identifying AST node types with HTML class names and preserving the AST structure in HTML. 
 * 
 * No extra spaces for indentation are added to the markup, only the necessary so this means the spacing must be done in CSS or 
 * dynamically changing the DOM (for example using jquery). 
 * 
 * Available CSS class names:
 * <pre>
	operators:
	operand, colon, semicolon, paren, curly, coma
	
	keywords: 
	keyword keyword-return keyword-function, keyword-var keyword-for, etc
	 </pre>
 * 
 * TODO: 
 * * configuration option for "always use curly braces in blocks" (even if they are not mandatory). Currently this always uses curly braces.
 * * the same for mandatory colons.  

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
		htmlOpen('VariableDeclaration declaration'+((config&&config.noFirstNewLine)?' noNewLine':'')); 
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
		htmlOpen('FunctionExpression expression'); 
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
		htmlOpen('BlockStatement statement'); 
		for ( var i = 0; i < node.body.length; i++) {
			visit(node.body[i]);
		}
		htmlClose();
	}
,	"UpdateExpression": function(node) {
		htmlOpen('UpdateExpression expression'); 
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
		htmlOpen('ArrayExpression expression'); 
//		print('[');
		htmlPrint('[', 'square-left');	
		for ( var i = 0; i < node.elements.length; i++) {
			visit(node.elements[i]);
			if(i < node.elements.length-1)
//				print(', ');
				htmlPrint(',', 'comma operand'); 
		}
//		print(']'); 
		htmlPrint(']', 'square-right');
		htmlClose();
	}

,	"ExpressionStatement": function(node) {
		htmlOpen('ExpressionStatement statement'); 
//		indent(); 
		visit(node.expression);
//		print(';'); 
		htmlPrint(';', 'semicolon'); 
		htmlClose();
	}
,	"CallExpression": function(node) {
		htmlOpen('CallExpression expression'); 
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
		htmlOpen('BinaryExpression expression');
		visit(node.left); 
		htmlPrint(node.operator, 'operand');
//		print(' '+node.operator+' '); 
		visit(node.right); 
		htmlClose();
	}

,	"ObjectExpression": function(node) {
		htmlOpen('ObjectExpression expression');
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
			/* adding an artificial class : object-property*/
			htmlOpen('ObjectProperty');
			visit(p.key); 
//			print(': '); 
			htmlPrint(':', 'operand colon');
			visit(p.value);
			if(i < node.properties.length-1) {
//				ns.print(ns.newline); 
//				ns._printIndent(ns.blockCount-1);
//				print(', ');
				htmlPrint(',', 'comma operand');
//				indent();
			}
			htmlClose();
		}
		ns.blockCount--;
//		indent();
//		print('}'); 		
		htmlPrint('}', 'curly-right');
		htmlClose();
	}
,	"ReturnStatement": function(node) {
		htmlOpen('ReturnStatement statement');
//		indent();	
//		print('return '); 
		htmlPrint('return', 'keyword keyword-return');
		visit(node.argument); 
//		print(';'); 
		htmlPrint(';', 'semicolon'); 
		htmlClose();
	}
,	"ConditionalExpression": function(node) {
		htmlOpen('ConditionalExpression expression');
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
		htmlOpen('SwitchStatement statement');
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
		htmlOpen('EmptyStatement statement');
//		print(';'); 
		htmlPrint(';', 'semicolon');
		htmlClose();
	}
,	"BreakStatement": function(node) {
		htmlOpen('BreakStatement statement');
		htmlPrint('break', 'keyword keyword-break');
		htmlPrint(';', 'semicolon');		
		htmlClose();
//		indent(); 
//		print('break;');
	}

,	"WhileStatement": function(node) {
//		indent(); 
//		print('while ( ');
		htmlOpen('WhileStatement statement');
		htmlPrint('while', 'keyword keyword-while');
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
		htmlPrint(';', 'semicolon');
		htmlClose(); 
	}
,	"AssignmentExpression": function(node) {
		htmlOpen('AssignmentExpression expression');
		visit(node.left);
//		print(' '+node.operator+' '); 
		htmlPrint(node.operator, 'operand');
		visit(node.right); 	
		htmlClose();
	}
,	"MemberExpression": function(node) {
		htmlOpen('MemberExpression expression');
		visit(node.object);
		htmlPrint('.', 'operand dot');
//		print('.'); 
		visit(node.property); 	
		htmlClose();
	}

,	"ThisExpression": function(node) {
		htmlOpen('ThisExpression expression');
//		print('this');  
		htmlPrint('this', 'keyword keyword-this');		
		htmlClose();
	}

,	"SequenceExpression": function(node) {
		htmlOpen('SequenceExpression expression');
//		print('( ');   
		htmlPrint('(', 'paren-left');	
		for ( var i = 0; i < node.expressions.length; i++) {
			visit(node.expressions[i]);
			if(i < node.expressions.length-1)
//				print(', ');
				htmlPrint(',', 'comma operand');
		}
//		print(' )');
		htmlPrint(')', 'paren-right');	
		htmlClose();
	}
,	"DoWhileStatement": function(node) {
//		indent();
		htmlOpen('DoWhileStatement statement');
//		print('do');
		htmlPrint('do', 'keyword keyword-do');
//		indent();
//		print('{')
		htmlPrint('{', 'curly-left');
		ns.blockCount++;
		visit(node.body);
		ns.blockCount--;
//		indent();
//		print('} ');
		htmlPrint('}', 'curly-right');
//		indent();		
//		print('while ( ');
		htmlPrint('while', 'keyword keyword-while');
		htmlPrint('(', 'paren-left');
		visit(node.test);
//		print(' );');
		htmlPrint(')', 'paren-right');
		htmlPrint(';', 'semicolon');
		htmlClose(); 
	}
,	"NewExpression": function(node) {
		htmlOpen('NewExpression expression');
//		print('new '); 
		htmlPrint('new', 'keyword keyword-new');
		visit(node.callee); 
//		print('('); 
		htmlPrint('(', 'paren-left');
		for ( var i = 0; i < node.arguments.length; i++) {
			visit(node.arguments[i]);
			if(i < node.arguments.length-1)
//				print(', ');
				htmlPrint(',', 'comma operand');
		}
//		print(')');
		htmlPrint(')', 'paren-right'); 
		htmlClose(); 
	}
,	"WithStatement": function(node) {
		htmlOpen('WithStatement statement');
//		indent();
//		print('with ( '); 
		htmlPrint('with', 'keyword keyword-with');
		htmlPrint('(', 'paren-left');
		visit(node.object); 
//		print(' )'); 
//		indent();
		htmlPrint(')', 'paren-right');
//		print(' {')
		htmlPrint('{', 'curly-left');
		ns.blockCount++;
		visit(node.body);
		ns.blockCount--;
//		indent();
//		print('};');
		htmlPrint('}', 'curly-right');
		htmlPrint(';', 'semicolon');		
//		indent();
		htmlClose(); 
	}
,	"IfStatement": function(node, config) {
		htmlOpen('IfStatement statement '+((config&&config.noFirstNewLine)?' noNewLine':'')); 
//		if(!config || !config.noFirstNewLine)
//			indent(); 
//		print('if ( '); 
		htmlPrint('if', 'keyword keyword-if');
		htmlPrint('(', 'paren-left');
		visit(node.test); 
//		print(' )'); 
//		indent();
		htmlPrint(')', 'paren-right');
//		print(' { ');
		htmlPrint('{', 'curly-left');
		ns.blockCount++;
		visit(node.consequent);
		ns.blockCount--;
//		indent();
//		print('}');
		htmlPrint('}', 'curly-right');
		
		if(node.alternate) {
//			indent();
//			print('else ');
			htmlPrint('else', 'keyword keyword-else');
			if(node.alternate.test==null) {
//				indent();
//				print(' {');
				htmlPrint('{', 'curly-left');
				ns.blockCount++;
			}
			visit(node.alternate, {noFirstNewLine: true});
			if(node.alternate.test==null) {
				ns.blockCount--;
//				indent();
//				print('}');
				htmlPrint('}', 'curly-right');
			}
		}
		htmlClose(); 
	}

,	"FunctionDeclaration": function(node, config) {
		htmlOpen('FunctionDeclaration declaration');
//		indent(); 
//		print('function ');
		htmlPrint('function', 'keyword keyword-function');
		visit(node.id); 
//		print(' ( ');
		htmlPrint('(', 'paren-left'); 
		if(node.params) for ( var i = 0; i < node.params.length; i++) {
			visit(node.params[i]); 
			if(i< node.params.length-1)
//				print(', '); 	
				htmlPrint(',', 'comma operand');	 
		}
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
		htmlClose(); 
	}
,	"UnaryExpression": function(node) {
		htmlOpen('UnaryExpression expression');
//		print(node.operator+" ");
		htmlPrint(node.operator, 'operand');
		visit(node.argument); 
		htmlClose(); 
	}
,	"LogicalExpression": function(node) {
		htmlOpen('LogicalExpression expression');
		visit(node.left); 
//		print(' '+node.operator+' '); 
		htmlPrint(node.operator, 'operand');
		visit(node.right); 
		htmlClose(); 
	}

,	"TryStatement": function(node) {
		htmlOpen('TryStatement statement');
//		indent();
//		print('try');
		htmlPrint('try', 'keyword keyword-try');
//		indent();
//		print(' {');
		htmlPrint('{', 'curly-left');
		ns.blockCount++;
		visit(node.block); 
		ns.blockCount--;
//		indent();
//		print('}');
		htmlPrint('}', 'curly-right');
		for ( var i = 0; i < node.handlers.length; i++) {
			visit(node.handlers[i]); 
		}
		if(node.finalizer) {
//			indent();
//			print('finally'); 
			htmlPrint('finally', 'keyword keyword-finally');
//			indent();
//			print(' {');
			htmlPrint('{', 'curly-left');
			ns.blockCount++;
			visit(node.finalizer); 
			ns.blockCount--;
//			indent();
//			print('}');
			htmlPrint('}', 'curly-right');
		}
		htmlPrint(';', 'semicolon');
		htmlClose(); 
	}
,	"CatchClause": function(node) {
		htmlOpen('CatchClause');
//		console.log(node); 
//		indent();
//		print('catch ( '); 
		htmlPrint('catch', 'keyword keyword-catch');
		htmlPrint('(', 'paren-left'); 
		node.param && visit(node.param); 
//		if(node.params) for ( var i = 0; i < node.params.length; i++) {
//			visit(node.params[i]); 
//			if(i< node.params.length-1)
//				print(', '); 		 
//		}
//		print(' )');
		htmlPrint(')', 'paren-eight'); 
//		indent();
//		print(' {');
		htmlPrint('{', 'curly-left');
		ns.blockCount++;
		visit(node.body); 
		ns.blockCount--;
//		indent();
//		print('}');
		htmlPrint('}', 'curly-right');
		htmlClose(); 
	}
,	"ThrowStatement": function(node) {
		htmlOpen('ThrowStatement statement');
//		indent();
//		print('throw '); 
		htmlPrint('throw', 'keyword keyword-throw');
		visit(node.argument);
//		print(';')
		htmlPrint(';', 'semicolon');
		htmlClose(); 
	}
,	"ForInStatement": function(node) {
		htmlOpen('ForInStatement statement');
//		indent();
//		print("for ( "); 
		htmlPrint('for', 'keyword keyword-for');
		htmlPrint('(', 'paren-left'); 
		visit(node.left, {noFirstNewLine: true, noLastSemicolon: true}); 	
//		print(' in '); 
		htmlPrint('in', 'keyword keyword-in');
		visit(node.right); 
//		print(' )')
		htmlPrint(')', 'paren-right'); 
		
//		indent();
//		print(' {');
		htmlPrint('{', 'curly-left');
		ns.blockCount++;
		visit(node.body); 
		ns.blockCount--;
//		indent();
//		print('}');
		htmlPrint('}', 'curly-right');
		htmlClose(); 
	}
,	"ContinueStatement": function(node){
		htmlOpen('ContinueStatement statement');
//		indent();
//		print('continue;'); 
		htmlPrint('continue', 'keyword keyword-continue');
		htmlClose(); 
	}

,	"Block": function(node) {/* support for block comments like this one*/
		htmlOpen('Block comment'); 
//		indent();		
//		print('/* ');
		htmlPrint('/*', 'block-comment-start'); 
		
		htmlOpen('comment-value'); 
		print(node.value); 
		htmlClose();
		
//		print(' */'); 
		htmlPrint('*/', 'block-comment-end'); 
//		indent(); 
		htmlClose();
	}
,	"Line": function(node) {//support for line comments like this one
//		indent(); 
		htmlOpen('Line comment'); 
		htmlPrint('//', 'line-comment-prefix'); 
//		print('// '); 
		print(node.value); 
//		indent(); 
		htmlClose();
	}

}	
})();
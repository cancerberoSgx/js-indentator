
// in this code node name means javascript language ast nodes like expression, declaration, statement, etc, not DOM or xml nodes!
// TODO: only single line code supported !
(function() {
var ns = jsindentator, visit=ns.visit, print=ns.print, indent=ns.printIndent; 
jsindentator.visitorsStyle1 = {
	
	"VariableDeclaration" : function(node, config) {
		indent(); 
		print('var '); 
		for ( var i = 0; i < node.declarations.length; i++) {
			visit(node.declarations[i]); 
			if(i< node.declarations.length-1)
				print(ns.newline+','+ns.tab); 		 
		}
		print('; '); 
//		if(!config || !config.noFirstNewLine)
//			indent(); 
	}

,	"VariableDeclarator" : function(node) {
		ns.print(node.id.name+" = ");

//		ns.blockCount++;	
		visit(node.init); 

//		ns.blockCount--;	
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
//	console.log(node); 
		print('function ');
		visit(node.id);
		print('('); 
		for( var i = 0; i < node.params.length; i++) {
			visit(node.params[i]); 
			if(i < node.params.length-1)
				print(', ');					
		}
		print(')');
		if(node.body.body.length>0) {
			indent();
			print('{')
			ns.blockCount++;	
//			indent();		
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
//		if(node.body.length>0)
//			indent();
		for ( var i = 0; i < node.body.length; i++) {
//			indent();
			visit(node.body[i]);
		}
//		print(node.body.length>0?';':''); 
//		indent();
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
//				print('; '); 
		visit(node.test);
		print('; ');
		visit(node.update);
		print(') {'); 
//				indent(); 
		ns.blockCount++;
		visit(node.body);
		ns.blockCount--;
		indent(); 
		print('}'); 
//		indent(); 
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
//		indent(); 
	}
,	"CallExpression": function(node) {
		if(node.callee.type==="FunctionExpression"){print('(');ns.blockCount++;}//hack - parenthesis around functions
		visit(node.callee)
		if(node.callee.type==="FunctionExpression"){print(')');ns.blockCount--;}//hack - parenthesis around functions
	
		print('('); 
		for ( var i = 0; i < node.arguments.length; i++) {
			visit(node.arguments[i]);
			if(i < node.arguments.length-1)
				print(', ');
		}
		print(')'); 
	}
,	"BinaryExpression": function(node) {
		visit(node.left); 
		print(' '+node.operator+' '); 
		visit(node.right); 
	}

,	"ObjectExpression": function(node) {
//			console.log(node); 
		print('{'); 
		ns.blockCount++;
		indent();
		for ( var i = 0; i < node.properties.length; i++) {
			var p = node.properties[i];
			
			visit(p.key); //Identifier
			print(': '); 
			visit(p.value); //*Expression
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
//		indent(); 
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
//		ns.blockCount++;
		for(var i = 0; i < node.cases.length; i++) {
			visit(node.cases[i]); 
		}
//		ns.blockCount--;

		indent();
		print('}'); 
//		indent(); 
	}
,	"SwitchCase": function(node) {
		indent();
		print(node.test==null ? 'default' : 'case ');
		visit(node.test); 
		print(':');
		ns.blockCount++;
//		print(ns.newline); indent();
		
		for(var i = 0; i < node.consequent.length; i++) {	
//			indent();		
			visit(node.consequent[i]); 
		}
		ns.blockCount--;
	}
,	"EmptyStatement": function(node) {
//		indent(); 
		print(';'); 
//		indent(); 
	}
,	"BreakStatement": function(node) {
		indent(); 
		print('break;');
//		indent(); 
	}

,	"WhileStatement": function(node) {
		indent(); 
		print('while ( ');
		visit(node.test); 
		print(' ) ');
		indent();
		print('{'); 
		
		ns.blockCount++;
//		indent();
		visit(node.body);
		ns.blockCount--;
		
		indent();
		print('}'); 
//		indent(); 
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
		ns.blockCount++;
		for ( var i = 0; i < node.expressions.length; i++) {
			visit(node.expressions[i]);
			if(i < node.expressions.length-1)
				print(', ');
		}
		ns.blockCount--;
		print(' )');
	}
,	"DoWhileStatement": function(node) {
		indent();
		print('do');
		indent();
		print('{')
		ns.blockCount++;
//		indent();
		visit(node.body);
		ns.blockCount--;
//		print(ns.newline); 

		indent();
		print('}');	
		indent();
		
		print('while ( ');
		visit(node.test);
		print(' );');
//		indent(); 
	}
}	
})();
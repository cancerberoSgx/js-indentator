
// in this code node name means javascript language ast nodes like expression, declaration, statement, etc, not DOM or xml nodes!
// TODO: only single line code supported !
(function() {
var ns = jsindentator, visit=ns.visit, print=ns.print; 
jsindentator.visitorsStyle1 = {
	
	"VariableDeclaration" : function(node, config) {
		if(!config || !config.noFirstNewLine)
			ns.printIndent(); 
		print('var '); 
		for ( var i = 0; i < node.declarations.length; i++) {
			visit(node.declarations[i]); 
			if(i< node.declarations.length-1)
				print(ns.newline+','+ns.tab); 		 
		}
		print('; '); 
	}

,	"VariableDeclarator" : function(node) {
		ns.print(node.id.name+" = ");
		visit(node.init); 
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
				print(', ');					
		}
		print(')');
		if(node.body.body.length>0) {
			ns.printIndent();
			print('{')
			ns.blockCount++;			
			visit(node.body); 
			ns.blockCount--;
			ns.printIndent();
			print('}')
		}
		else {
			print('{}');  
		}
			
		print('}'); 
	}
,	"BlockStatement": function(node) {	
//		if(node.body.length>0)
//			ns.printIndent();
		for ( var i = 0; i < node.body.length; i++) {
			ns.printIndent();
			visit(node.body[i]);
		}
//		print(node.body.length>0?';':''); 
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
		print('; ');
		visit(node.update);
		print(') {'); 
//				ns.printIndent(); 
		ns.blockCount++;
		visit(node.body);
		ns.blockCount--;
		ns.printIndent(); 
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
		visit(node.expression);
		print(';'); 
	}
,	"CallExpression": function(node) {
		visit(node.callee);
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
		ns.printIndent();
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
		ns.printIndent();
		print('}'); 
	}
,	"ReturnStatement": function(node) {
//				ns.printIndent();	
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
		ns.printIndent();
		print('switch (');
		visit(node.discriminant); 
		print(')');
		ns.printIndent();
		 print('{'); 
//		ns.blockCount++;
		for(var i = 0; i < node.cases.length; i++) {
			visit(node.cases[i]); 
		}
//		ns.blockCount--;

		ns.printIndent();
		print('}'); 
	}
,	"SwitchCase": function(node) {
		ns.printIndent();
		print(node.test==null ? 'default' : 'case ');
		visit(node.test); 
		print(':');
		ns.blockCount++;
//		print(ns.newline); ns.printIndent();
		
		for(var i = 0; i < node.consequent.length; i++) {	
			ns.printIndent();		
			visit(node.consequent[i]); 
		}
		ns.blockCount--;
	}
,	"EmptyStatement": function(node) {
		print(';'); 
	}
,	"BreakStatement": function(node) {
		print('break;');
	}
}	
})();
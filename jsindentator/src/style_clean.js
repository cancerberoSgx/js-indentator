
// in this code node name means javascript language ast nodes like expression, declaration, statement, etc, not DOM or xml nodes!
// TODO: only single line code supported !
(function() {
var ns = jsindentator, visit=ns.visit, print=ns.print; 
jsindentator.visitorsStyleClean = {
	
	"VariableDeclaration" : function(node, config) {
		print('var '); 
		for ( var i = 0; i < node.declarations.length; i++) {
			visit(node.declarations[i]); 
			if(i< node.declarations.length-1)
				print(','); 		 
		}
		print(';'); 
	}

,	"VariableDeclarator" : function(node) {
		ns.print(node.id.name+"=");
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
				print(',');					
		}
		print('){');
		ns.blockCount++;
		visit(node.body); 
		ns.blockCount--;
//				ns.printIndent();
//		ns.printIndent(); 
		print('}'); 
	}
,	"BlockStatement": function(node) {		
//		ns.printIndent();
		for ( var i = 0; i < node.body.length; i++) {
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
//		ns.printIndent();
		for ( var i = 0; i < node.properties.length; i++) {
			var p = node.properties[i];
			
			visit(p.key); //Identifier
			print(':'); 
			visit(p.value); //*Expression
			if(i < node.properties.length-1) {
//				ns.print(ns.newline); 
//				ns._printIndent(ns.blockCount-1);
				print(','); 
			}
		}
		ns.blockCount--;
//		ns.printIndent();
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


}	
})();





// in this code node name means javascript language ast nodes like expression, declaration, statement, etc, not DOM or xml nodes!
// TODO: only single line code supported !
(function() {
	var ns=window.jsindentator = {};
	_.extend(ns, {
		visitors : {
			
			//example: var a = 1, f = function(){}
			"VariableDeclaration" : function(node) {
				ns.print('var '); 
				for ( var i = 0; i < node.declarations.length; i++) {
					var decl= node.declarations[i]; 
					ns.print(decl.id.name+" = ");
					ns.visit(decl.init); 
					if(i< node.declarations.length-1)
						ns.print(ns.newline+','+ns.tab); 		 
				}
				ns.print(';'+ns.newline); 
			}
	
			//example: 2, "seba", false
//		,	"Literal" : function(node, print) {	
//			}
		,	"Identifier": function(node, print) {
				print(node.name); 
			}
		,	"ObjectExpression": function(node, print) {
			console.log(node); 
				print('{'); 
				ns.blockCount++;
				ns.printIndent();
				for ( var i = 0; i < node.properties.length; i++) {
					var p = node.properties[i];
					
					ns.visit(p.key); //Identifier
					print(': '); 
					ns.visit(p.value); //*Expression
					if(i < node.properties.length-1) {
//						if(i!=0)
						ns.print(ns.newline); 
						ns._printIndent(ns.blockCount);
//						print(ns.newline); 
//						print(',\t'); 
//						ns.printIndent();
					}
				}
				ns.blockCount--;
				ns.printIndent();
				print('}'); 
			}			
		}
	,	doDefaultChildrenVisiting: function(node) {
			if(node.body) {
				_(syntax.body).each(function(child){
					ns.visit(child); 
				}); 
			}
		}
	,	logMessages: []
	,	log: function(msg) {
			logMessages.push(msg); 
		}
	,	blockCount: 0 //for block indentation
	,	print: function(str) {
			ns.buffer.push(str); 
		}
	,	_printIndent: function(num) {
			for(var i = 0; i<num; i++) {
				ns.print(ns.tab); 
			}
		}
	,	printIndent: function(nonl) {
			if(!nonl)
				ns.buffer.push(ns.newline); 
			ns._printIndent(ns.blockCount); 
		}
	,	tab: '\t'
	,	newline: '\n'
	,	originalCode: function(node) {
			return ns.code.substring(node.loc.start.column, node.loc.end.column); 
		}
	,	buffer: []
	,	main: function (code, config) {
			if(config)
				_.extend(ns, config); 
			ns.code = code;
			var syntax = null, parseex=null;
			try {
				syntax = esprima.parse(code, {loc : true});
			}catch(ex){parseex=ex;}
			if(syntax==null) {
				alert("JAVASCRIPT PARSING ERROR: "+parseex);
				return; 
			}
			ns.buffer = [];
			_(syntax.body).each(function(node){
				ns.visit(node); 
			}); 		

//			console.log(syntax.body); 
			return ns.buffer.join('');  
		}
	 ,	visit: function(node) {
			var visitor = ns.visitors[node.type]; 
			if(visitor) {
				visitor(node, ns.print); 
			}
			else {
				ns.buffer.push(ns.originalCode(node));
			}
		}
	});
		
})();
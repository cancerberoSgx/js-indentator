// in this code node name means javascript language ast nodes like expression, declaration, statement, etc, not DOM or xml nodes!
(function() {
	var ns=window.jsindentator = {};
	_.extend(ns, {
			quote: '\''
		,	tab: '\t'
		,	newline: '\n'
		
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
	,	originalCode: function(node) {
//			return ns.code.substring(node.loc.start.column, node.loc.end.column); //only for code without newlines
			if(!node.range)return ''; 
			if(node.range.length==1)
				return ns.code.substring(node.range[0], node.range[0+1]); 
			else
				return ns.code.substring(node.range[0], node.range[1]); 
		}
	,	buffer: []
	,	main: function (code, config) {
			if(config)
				_.extend(ns, config); 
			ns.code = code;
			var syntax = null, parseex=null;
			try {
				syntax = esprima.parse(code, {
//					loc : true 
//				,	
				range: true
//				,	tokens: true
					}				
				);
			}catch(ex){parseex=ex;}
			if(syntax==null) {
				alert("JAVASCRIPT PARSING ERROR: "+parseex);
				return; 
			}
			ns.buffer = [];
//			console.log(syntax); 
			_(syntax.body).each(function(node){
				ns.visit(node); 
			}); 
			return ns.buffer.join('');  
		}
	/* this is the public visit() method which all the visitors will call for sub concept instances, like for example the FunctionExpression will call for render its parameter expression and its body statements. the visit method will delegate to registered visitor for the given type of by default, if no visitor is registered for that concept it will just dump the original code. */ 
	 ,	visit: function(node, config) {
		 	if(!node) {
//		 		console.log("WARNING - null node", node);
		 		return; 
		 	}
			var visitor = ns.visitors[node.type]; 
//			console.log("visiting", node, ns.originalCode(node)); 
			if(visitor) {
				visitor(node, config); 
			}
			else {
				var origCode = ns.originalCode(node);
				console.log("WARNING - Language concept not supported ", node, origCode); 
				ns.buffer.push(origCode);
			}
		}
		
	,	logMessages: []
	,	log: function(msg) {
			logMessages.push(msg); 
		}
//	doDefaultChildrenVisiting: function(node) {
//	if(node.body) {
//		_(syntax.body).each(function(child){
//			ns.visit(child); 
//		}); 
//	}
//}
	});
		
})();
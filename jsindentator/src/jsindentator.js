
// in this code node name means javascript language ast nodes like expression, declaration, statement, etc, not DOM or xml nodes!
// TODO: only single line code supported !
(function() {
	var ns=window.jsindentator = {};
	_.extend(ns, {
		visitors : {
			//example: var a = 1, f = function(){}
			"VariableDeclaration" : function(node) {
				var buf = ns.buffer;
				buf.push('var '); 
				for ( var i = 0; i < node.declarations.length; i++) {
					var decl= node.declarations[i]; 
					buf.push(i===0?'':', '); //separator
// 					var visit(decl.init); //val = decl.init.raw || visit
					buf.push(decl.id.name+" = ");
					visit(decl.init); 
				}
//				_(node.declarations).each(function(decl){
//					buf.push(buf.length===0?'':', '); //separator
//// 					var visit(decl.init); //val = decl.init.raw || visit
//					buf.push(decl.id.name+" = ");
//					visit(decl.init)
//				}); 
				buf.push('; '); 
				console.log(node); 
			}
		}
	,	doDefaultChildrenVisiting: function(node) {
			if(node.body) {
				_(syntax.body).each(function(child){
					ns.visit(child); 
				}); 
			}
		}
	,	blockCount: 0 //for block indentation
	,	print: function(str) {
			ns.buffer.push(str); 
		}
	,	printLine: function(lineStr) { //please use this for printing an entire indented line. 
			for(var i = 0; i<blockCount; i++)
				buf.push(ns.indentStr); 
			buf.push(lineStr); 
		}
	,	indentStr: '\t'
	,	originalCode: function(node) {
			return ns.code.substring(node.loc.start.column, node.loc.end.column); 
		}
	,	buffer: []
	,	main: function (code) {
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
				visit(node); 
			}); 		
			return ns.buffer.join('');  
		}
	});
	
	function visit(node){
		var visitor = ns.visitors[node.type]; 
		if(visitor) {
			visitor(node); 
		}
		else {
			ns.buffer.push(ns.originalCode(node));
		}
	}
	alert(main("var s = 2, f = function(a){}; "));
	
})();
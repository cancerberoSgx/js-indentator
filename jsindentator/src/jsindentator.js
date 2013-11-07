// in this code node name means javascript language ast nodes like expression, declaration, statement, etc, not DOM or xml nodes!
//var GLOBALOBJECT=this; //must be outside any function

//(function() {
	
//	var _ = null, esprima=null; 
//	if(typeof window === 'undefined'){ //in node
//		_ = require('underscore'); 
//		esprima = require('esprima'); 
//	}
//	else {
//		_=window._;
//		esprima = window.esprima; 
//	}
	
	jsindentator={}; //global
	var ns = jsindentator = {};
	
	_.extend(ns, {
		
		blockCount: 0 //for block indentation
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
	
	,	styles: {}
	
	,	originalCode: function(node) {
//			return ns.code.substring(node.loc.start.column, node.loc.end.column); //only for code without newlines
			if(!node.range)return ''; 
			if(node.range.length==1)
				return ns.code.substring(node.range[0], node.range[0+1]); 
			else
				return ns.code.substring(node.range[0], node.range[1]); 
		}
	,	buffer: []
	,	setStyle: function(style) {
			ns.visitors=style; 
			if(style.installStyle && _.isFunction(style.installStyle)) {
				style.installStyle();
			}
		}
	,	main: function (code, config) {
			//configdebugger;
			if(config && !ns.visitors.setStyleConfig) {
				_.extend(ns, config); 
			}
			else if(config && ns.visitors.setStyleConfig) {
				ns.visitors.setStyleConfig(config); 
			}
			
			ns.code = code;
			
			var syntax = null, parseex=null;
			try {
				syntax = esprima.parse(code, {
					raw: true						
				,	range: true
				,	comment: true
//				,	tokens: true
//				,	loc : true
					}				
				);
			}
			catch(ex){
				parseex=ex;
			}
			if(!syntax) {
				console.log("JAVASCRIPT PARSING ERROR: "+parseex);
				return; 
			}
			ns.syntax = syntax; 
			ns.buffer = [];
//			ns.syntax.comments=syntax.comments; 
//			console.log(syntax); 
			_(syntax.body).each(function(node){
				ns.visit(node); 
			}); 
			
			//postRender
			ns.buffer = ( ns.visitors.postRender && ns.visitors.postRender() ) || ns.buffer;
			
			return ns.buffer.join('');  
		}
	/* this is the public visit() method which all the visitors will call for sub concept instances, like for example the FunctionExpression will call for render its parameter expression and its body statements. the visit method will delegate to registered visitor for the given type of by default, if no visitor is registered for that concept it will just dump the original code. */ 
	 ,	visit: function(node, config, parentNode) {
		 	if(!node) {
//		 		console.log("WARNING - null node", node);
		 		return; 
		 	}	 	
		 	
		 	//do the visiting
			var visitor = ns.visitors[node.type]; 
//			console.log("visiting", node, ns.originalCode(node)); 
			if(visitor) {
				ns._checkComments(node);
				visitor.apply(ns.visitors, [node, config]); 
//				visitor(node, config); 
			}
			else {
				var origCode = ns.originalCode(node);
				console.log("WARNING - Language concept not supported ", node, origCode); 
				ns.buffer.push(origCode);
			}
		}

	 //in esprima there are no comment nodes, just comment meta information so we need to build the comments by our self. TODO: make this work OK. 
	 ,	_checkComments: function(node) {
		 	var previousNodeRange=ns._comments_currentNodeRange || [0,0]; 
		 	ns._comments_currentNodeRange=node.range || [0,0]; 
		 	
		 	for ( var i = 0; i < ns.syntax.comments.length; i++) { //TODO: do it efficient- save previsou comment node.
				var c = ns.syntax.comments[i]; 
//				console.log('COMPARING', c.range, previousNodeRange, ns._comments_currentNodeRange); 
				if(c.range[0] >= previousNodeRange[1] && c.range[1] <= ns._comments_currentNodeRange[0]) {
					ns.visit(c); 
					break; 
				}
			}
	 	}
		
	,	logMessages: []
	,	log: function(msg) {
			logMessages.push(msg); 
		}
	,	setConfig: function(config) {
			_.extend(ns, config); 
		}
//	doDefaultChildrenVisiting: function(node) {
//	if(node.body) {
//		_(syntax.body).each(function(child){
//			ns.visit(child); 
//		}); 
//	}
//}
	});
	
	//ns object is ready - register as nodejs module
//	if(module && module.exports){
//		module.exports.main=ns.main;
//		module.exports.setStyle=ns.setStyle; 
//	}
//})();
//this extractor will extract information about class inheritance of backbonejs&requirejs based code.

(function() {

var ns = jsindentator; 
if(!ns.styles) ns.styles={}; 

var extractor1 = ns.styles.backboneRequireOOInfoExtraction = {};
_.extend(extractor1, ns.styles.clean);//we extends from a base that support all the language so we do a full ast iteration. 
_.extend(extractor1, {		
	installStyle: function() {
		this.data1=[];
	}
,	postRender: function(){	
		return this.data1;
	}
,	"Identifier": function(node, config) {
	
// 		var parentClass = null, thisClass=null;  
		
		if(node.name==='define'&& node.parentNode && node.parentNode.type==="CallExpression" && 
				node.parentNode.arguments.length>2) {
// 			thisClass=node.parentNode.arguments[0].value; 
			this.currentDefineClass=node.parentNode.arguments[0].value; 
// 			this.data1.push("1 thisClass found: "+thisClass); 
		}
		//TODO. else if node.name==='define' log it some way
		else if(node.name==='extend' && node.parentNode.type==="MemberExpression") {
			var parentClass = node.parentNode.object.name;
			
			this.data1.push(this.currentDefineClass+" extends "+parentClass); 
		}
		//TODO. else if node.name==='extend' log it some way
	}
}); 
})();
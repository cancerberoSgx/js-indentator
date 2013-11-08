//this extractor doesn't even use vistors, it just extract comments and use the postRender method to only dump jsdoc  related information
(function() {

//	var _ = null, jsindentator=null; 
//	if(typeof window === 'undefined'){ //in node
//		_ = require('underscore');  
//		jsindentator = require()
//	}
//	else {
//		_=window._;
//	}
	
var ns = jsindentator, visit=ns.visit, print=ns.print, indent=ns.printIndent; 
if(!ns.styles) ns.styles={}; 

//if(!jsindentator.styles.style) jsindentator.styles.style1={};

//add some config props
ns.quote = '\''; 
ns.tab = '\t';
ns.newline = '\n';

//http://stackoverflow.com/questions/498970/how-do-i-trim-a-string-in-javascript
var stringFullTrim = function(s){return s.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};
 
jsindentator.styles.jsdocgenerator1 = {
//	'StyleName': 'style1'
		
	installStyle: function() {
		this.data=[];
//		this.datacount=0; 
	}
,	postRender: function(){	
//		this.datacount=++;
		return this.data.join('\nJSDOC'+': '); 
	//at this time all the 
	}
	

,	"Block": function(node) {	
		var s = stringFullTrim(node.value); 
		if(s.indexOf('/**')==0) {
			this.data.push({text: s});
		}	
//		indent();
//		print('/* '); 
//		print(node.value); 
//		print(' */'); 
////		indent(); 
	}
//,	"Line": function(node) {//support for line comments like this one
//		indent(); 
//		print('// '); 
//		print(node.value); 
//		indent(); 
//	}

}; 

//ns object is ready - register as nodejs module
//if(module && module.exports){
//	module.exports.style1=jsindentator.styles.style1; 
//}
})();
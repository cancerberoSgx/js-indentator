/*jshint laxcomma:true*/
//extract comments and use the postRender method to only dump jsdoc related information



(function() {

	//http://stackoverflow.com/questions/498970/how-do-i-trim-a-string-in-javascript
	var stringFullTrim = function(s){return s.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};


	//@class jsDocMaker
	//@constructor JsDocMaker
	var JsDocMaker = function()
	{
		this.annotationRegexp = /(\s+@\w+)/gi;
		this.classAnnotationRegexp = /(\s+@class)/gi;
		this.methodAnnotationRegexp = /(\s+@method)/gi;
		this.propertyAnnotationRegexp = /(\s+@property)/gi;
	}; 

	// @method unifyLineComments unify adjacents Line comment nodes into one in the ns.syntax.coments generated after visiting. 
	JsDocMaker.prototype.unifyLineComments = function()
	{
		var i = 0;
		while(i < this.comments.length - 1)
		{
			var c = this.comments[i]
			,	next = this.comments[i+1]; 
			if(c.type==='Line' && next.type==='Line')
			{
				c.value += ' ' + next.value; 
				this.comments.splice(i+1, 1); 
			}
			i++;
		}
	}; 

	JsDocMaker.prototype.dumpString = function(s)
	{
		var r = []; 
		for (var i = 0; i < s.length; i++) 
		{
			r.push(s.charCodeAt(i)); 
		}
		return r.join(',');
	}; 

	//@method parse	@return {Array} array of class description - with methods, and methods containing params. 
	JsDocMaker.prototype.parse = function(comments)
	{
		this.comments = comments;

		//we do the parsing block b block. We unify adjacents line comments in 1	
		this.unifyLineComments();

		var self = this;
		var classes = {}; 
		var currentClass = null, currentMethod = null;
		_(this.comments).each(function(node)
		{
			//TODO: let the user mark some comment block somehow to let the parser to ignore it.
			var parsed = self.parseUnit(node.value); 
			delete parsed.theRestString; 

			if(parsed.annotation==='class')
			{
				if(!classes[parsed.name])
				{
					classes[parsed.name] = parsed; 
				}
				currentClass = classes[parsed.name]; 
			}
			if(parsed.annotation==='method' && currentClass)
			{
				currentClass.methods = currentClass.methods || {};
				currentClass.methods[parsed.name] = parsed;
				currentMethod = parsed;
			}
			if(parsed.annotation==='param' && currentClass)
			{
				currentMethod.params = currentMethod.params || {};
				currentMethod.params[parsed.name] = parsed; 
			}
			if(parsed.annotation==='extends' && currentClass)
			{
				currentClass.children['extends'] = parsed;
			}			
		}); 

		return classes;
	};

	// @method {Unit} parseUnit parse a simple substring like '@annotation {Type} a text' into an object {annotation, type, text} object.
	// syntax: @method {String} methodName blabla @return {Number} blabla @param {Object} p1 blabla
	JsDocMaker.prototype.parseUnitRegexp = /\s*@(\w+)\s*(\{\w+\}){0,1}\s*(\w+){0,1}(.*)\s*/; 
	
	JsDocMaker.prototype.parseUnit = function(str)
	{
		var parsed = this.parseUnitSimple(str); 
		if(parsed.theRestString)
		{
			var s = parsed.theRestString; 
			var child;
			while((child = this.parseUnitSimple(s)))
			{
				parsed.children = parsed.children || {}; 
				parsed.children[child.name] = child; 
				s = child.theRestString; 
			}
		}
		return parsed; 
	}; 

	JsDocMaker.prototype.parseUnitSimple = function(str) 
	{	
		if(!str)return null;		
		str = stringFullTrim(str); 
		var result = this.parseUnitRegexp.exec(str);
		// console.log(result)
		if(!result || result.length<4)
		{
			return null;  //TODO: notify error?
		}
		var text = result[4] || '';
			
		var splitted = this.splitAndPreserve(text, this.annotationRegexp) || [''];  
		text = splitted[0]; 
		splitted.splice(0,1); 
		return {
			annotation: result[1]
		,	type: result[2]
		,	name: result[3]
		,	text: text
		,	theRestString: splitted.join('')
		};
	}; 

	JsDocMaker.prototype.splitAndPreserve = function(string, replace)
	{
		var marker = '_%_%_';
		var splitted = string.replace(replace, marker+'$1');
		if(splitted.length<2)
		{
			return null; //TODO: notify error?
		}
		splitted = splitted.split(marker);
		return splitted; 
	}; 
	
	JsDocMaker.prototype.error = function(msg)
	{
		console.error('Error detected: ' + msg); 
		throw msg;
	}; 
	var maker = new JsDocMaker();


	//now, create a js-indentator installable	
	var ns = jsindentator;
	if(!ns.styles) ns.styles={}; 
	var impl = ns.styles.jsdocgenerator1 = {};
	_.extend(impl, ns.styles.clean);//we extends from a base that support all the language so we do a full ast iteration. 
	_.extend(impl, {
		postRender: function()
		{
			impl.jsdocClasses = maker.parse(ns.syntax.comments);
		}
	}); 

})();

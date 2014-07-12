//literrally, trash


/*
	JsDocMaker.prototype.parseUnit = function(node)
	{
		var rr = this.parseUnit(' '+node.value + ' '); 

		console.log(rr)
	};

	JsDocMaker.prototype.visit = function(node, config, parentNode, parentPropertyName, previousNode)
	{		
		// debugger;
		// console.log(node.type, this.previousNode && this.previousNode.type)
		//we parse the jsdocs in Units, each unit can be a class, a method or a param. 
		// All units contains the properties name and type. The json names correspond to @annotations
		if(node.type === 'Line' || node.type === 'Block')
		{
		// console.log(node)
			this.comments.push(node); 
		}
		this.previousNode = node;
	}; 

		debugger;
		console.log(node.value, rr)

		var splitted = this.splitAndPreserve(node.value);
		// console.log(splitted); 
		var lastText = '';
		var unit = {}; 
		for (var i = 0; i < splitted.length; i++) 
		{
			var val = splitted[i]; 
			if(val.match(this.classAnnotationRegexp))
			{

			}
			if(val.match(this.methodAnnotationRegexp))
			{

			}
			if(val.match(this.propertyAnnotationRegexp))
			{

			}
			else
			{
				lastText = val;
			}
		}
		return unit;



		var theRestResult = this.parseUnit(theRest, parent || this); 
		if(theRestResult) {

		}
		var theRestData = [];
		var result; 
		while((result = this.parseUnitRegexp.exec(theRest)) && result.length>3)
		{

			theRest = result[3]; 
		}
		var text = this.parseUnitRec(theRest, theRestData) || theRest; 

		TODO be recursive here - theRest can contain not only the text but more 



		parent = parent || this;
		theNewRest = theNewRest || [];

		var result = this.parseUnitRegexp.exec(str); 
		console.log(str, result, this.dumpString(str)); 
		

		var outputParent = {
			annotation: result[1]
		,	type: result[2]
		};
		var rest = result[3], restResult; 
		while((restResult = this.parseUnitRegexp.exec(rest)))
		{
			var outputChild = {
				annotation: restResult[1]
			,	type: restResult[2]
			};
		}

		, theNewRest = []; 
		theRest = parseUnit(theRest, parent, theNewRest);
		return outputParent;		

	JsDocMaker.prototype.parseUnitBuild = function(result) {
		var o = {
			annotation: result[1]
		,	type: result[2]
		,	text: result[3]
		};
		return o;
	}; 

	JsDocMaker.prototype.parseUnitRec = function(str, output)
	{
		str = stringFullTrim(str); 
		var result = this.parseUnitRegexp.exec(string); 
	}
	split and preserve 

	*/
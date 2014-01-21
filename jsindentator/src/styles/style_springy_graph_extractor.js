//this extractor will extract a graph data, in this particular case, with the format supported by springfy (http://dhotson.github.io/springy/springy.j)
//for building the graph, this implementation will override the method ns.visit and will accept the springy 
// graph object as parameter which will be poblated when main() is called. 
// in the graph, the relationship (edge) A -> B means that the language entity A contains the entity B like the WhileStatement contains a Block. 

(function() {

	var ns = jsindentator; 
	if(!ns.styles) ns.styles={}; 

	var impl = ns.styles.springy_graph_extractor = {}, nodes, edges, map;
	var fillColors = {
		'Expression': '#ff9999'
	,	'Statement': '#9999ff'
	,	'Identifier': '#99ff99'
	}; 
	var getColor = function(colors, name) {
		for(var key in colors) {
			if(name.indexOf(key)!=-1)
				return colors[key];
		}
		return '#ffffff'; 
	}
	_.extend(impl, ns.styles.clean);//we extends from a base that support all the language so we do a full ast iteration. 
	_.extend(impl, {		
		installStyle: function() {
			impl.jsdata={nodes: {}, edges: []};
			nodes = impl.jsdata.nodes; 
			edges = impl.jsdata.edges; 
			impl.counter=1;
			impl.jsGraphSyntaxMap={};
			map = impl.jsGraphSyntaxMap; 
		}
	,	getNodeName: function(node, config, parentNode, parentPropertyName) {
			var nodeName = node.name ? node.name+'-' : '';
			if(parentPropertyName) {
				nodeName += parentPropertyName
			}
			var label = nodeName+'('+node.type+')'; 
			return label;
		}
	,	setNode: function(node, config, parentNode, parentPropertyName, force) {
			if(force || node && !node.jsdataid) {
				if(!node.jsdataid) {				
					node.jsdataid = impl.counter++;	
					map[node.jsdataid]={
						node: node, 
						config: config, 
						parentNode: parentNode, 
						parentPropertyName: parentPropertyName
					}; 
				}
				
				// node.jsNodeName = nodeName;
				var label = impl.getNodeName(node, config, parentNode, parentPropertyName);
				var fillColor = getColor(fillColors, node.type);
				var dblclick = function(e){
					var graphNode = this;
					var nodeId = graphNode.data.jsdataid; 
					var node = map[nodeId].node; 
					// debugger;
					var code = ns.originalCode(node); 
					code = code.substring(0, Math.min(code.length, 120)); 
					alert(code); 
				}; 
				var val = {
					label: label, fillColor: fillColor, 
					ondoubleclick: dblclick, jsdataid: node.jsdataid
				}; 
				nodes[node.jsdataid+'']=val; 
			}
		}
	,	visit: function(node, config, parentNode, parentPropertyName) {
			if(parentPropertyName)	{
				impl.setNode(node, config, parentNode, parentPropertyName, true);
			}
			impl.setNode(node, config, parentNode, parentPropertyName);
			impl.setNode(parentNode);
			if(parentNode && node) {
				if((parentNode.jsdataid+'').indexOf('[')===0) {

				}
				edges.push([parentNode.jsdataid+'', node.jsdataid+'']);
			}
			
		}
	}); 

})();
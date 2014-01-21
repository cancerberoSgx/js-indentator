// this extractor will extract a tree data - each node is poblated with a children property that is an object mapping id->node
// usage : 
// jsindentator.setStyle(jsindentator.styles.style_tree1);
// jsindentator.styles.style_tree1.syntax.body

(function() {

	var ns = jsindentator; 
	if(!ns.styles) ns.styles={}; 

	var self = ns.styles.style_tree1 = {}; 

	_.extend(self, ns.styles.clean);//we extends from a base that support all the language so we do a full ast iteration. 
	_.extend(self, {		
		installStyle: function() {
			self.counter=1;
			self.nodes = {}; //Objct id->node
			// self.jsGraphSyntaxMap={};
			// map = self.jsGraphSyntaxMap; 
		}

	,	getNodeName: function(node, config, parentNode, parentPropertyName) {
			var nodeName = node.name ? node.name+'-' : '';
			if(parentPropertyName) {
				nodeName += parentPropertyName; 
			}
			var label = nodeName+'('+node.type+')'; 
			return label;
		}
	,	visit: function(node, config, parentNode, parentPropertyName) {
			self.addNode(node, config, parentNode, parentPropertyName); 
			// if(parentPropertyName)	{
			// 	self.setNode(node, config, parentNode, parentPropertyName, true);
			// }
			// self.setNode(node, config, parentNode, parentPropertyName);
			// self.setNode(parentNode);
			// if(parentNode && node) {
			// 	if((parentNode.jsdataid+'').indexOf('[')===0) {

			// 	}
			// }			
		}
		/**
		@method addNode
		@param parentNode {ASTNode} must be already be added
		*/
	,	addNode: function(node, config, parentNode, parentPropertyName) {
			if(!node.treeId) {
				node.treeId=self.counter++;				
				self.nodes[node.treeId] = node;
				node.children = {};
			}			
			node.label = self.getNodeName(node, config, parentNode, parentPropertyName);
			if(parentNode && !parentNode.treeId) {
				parentNode.treeId=self.counter++;
				self.nodes[parentNode.treeId] = parentNode;
				parentNode.children = {}; 
				node.parentNode = parentNode;
			}
			if(parentNode) {
				// if(!parentNode.treeId || !self.nodes[parentNode.treeId]) {
				// 	debugger;
				// 	throw new Error('parentNode '+parentNode+' must be addNode() first than its children!'); 
				// }
				self.parentPropertyName=parentPropertyName;
				if(!parentNode.children) {
					parentNode.children = {};//children nodes id->Node mapping
				}
				parentNode.children[node.treeId] = node;
			}
		}
	,	getRootNodes: function() {
			var roots = [];
			for(var id in self.nodes) {
				var node = self.nodes[id];
				if(!node.parentNode) {
					roots.push(node);
				}
			}
			return roots;
		}


	}); 


})();




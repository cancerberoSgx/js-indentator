/* 
 * this is a js node application for running the indentator from the command 
 * line (efficient). Do not include this on the browser, instead use ./src/*.js.
 * @author: sgurin
 */


var usage = function(){
	console.log('ERROR, incorrect amount of arguments given, at least 2 parameters config and inputFile are required. ');
	console.log('Usage: node indent.js "{}" aJsFile.js');	
	console.log('Where the third parameter "{}" is a valid json object with the following configuration options:')		
	console.log('initialIndentationLevel: is the initial indentation level, default is 0');
	console.log('style: a string indicating the formatting style or data extraction tool. for example style1, style2, clean, etc. Example {style: \"clean\"}');
	
	var s = ''; 
	for(var i in styleFiles) s+=i+', ';	
	console.log('style: one of '+s);
	process.exit(1);
}

,	configStr = process.argv[2]
,	filename = process.argv[3]
,	config=null
,	styleFiles={
		style1: './src/styles/style1.js'
	,	style2: './src/styles/style2.js'
	,	clean: './src/styles/style_clean.js'
	,	variable1: './src/styles/style_variable1.js'
	,	backboneRequireOOInfoExtractor1: './src/styles/backboneRequireOOInfoExtractor1.js'		
	}
,	main = function(){
		if(process.argv.length<4) {
			usage(); 	
		}	
		var _ = require('underscore'), 
			esprima = require('esprima'), 
			fs = require('fs');
	
		try {
//			console.log(configStr); 
			config=eval('('+configStr+')');
//			console.log(config+" - "+config.style); 
		} catch (e) {
			console.log('mal formed configuration json string: '+e); 
			config = {}; 
		}
		
		if(!config)
			config = {}; 
		if(!config.style)
			config.style='style1';
	
		var fs = require('fs'), 
			jsindentatorSrc = fs.readFileSync('./src/jsindentator.js','utf8'), 
			styleFilePath = styleFiles[config.style],
			styleSrc = fs.readFileSync(styleFilePath,'utf8') ;
	
		var GLOBAL=this;
		GLOBAL.syntaxOutput=null;
		var buf = []; 
		buf.push('(function(_, esprima){');
		buf.push(jsindentatorSrc+';');
		buf.push(styleSrc+';'); 
		buf.push('})'); 
		var fn = eval(buf.join('')); 
		fn(_, esprima);  	
		
		jsindentator.setStyle(jsindentator.styles[config.style]);
		if(config.initialIndentationLevel)
			jsindentator.blockCount=config.initialIndentationLevel; //set an initial indentation level
		var code = fs.readFileSync(filename,'utf8'),
			codeOutput = jsindentator.main(code, config);
		
		fs.writeFileSync('jsindentator_output.txt', codeOutput); 
		console.log(codeOutput);
}
main();
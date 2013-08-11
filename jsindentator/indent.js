/* 
 * this is a js node application for running the indentator from the command 
 * line (efficient). Do not include this on the browser, instead use ./src/*.js.
 * @author: sgurin
 */


var usage = function(){
	console.log('ERROR, incorrect amount of arguments given, at least 2 parameters config and '+
			'inputFile are required. \nUsage: "node indent.js \'\{\}\' aJsFile.js"');	
	var s = ''; 
	for(var i in styleFiles) {
		s+=i+', '; 
	}
	console.log('Where styles is one of '+s);
	process.exit(1);
}

,	configStr = process.argv[2]
,	filename = process.argv[3]
,	config=null
,	styleFiles={style1: './src/styles/style1.js'}
,	main = function(){
		if(process.argv.length<4) {
			usage(); 	
		}	
		var _ = require('underscore'), 
			esprima = require('esprima'), 
			fs = require('fs');
	
		try {
			config=eval(configStr); 
		} catch (e) {
			config = {}; 
		}
		if(!config)
			config = {}; 
		if(!config.style)
			config.style='style1';
	
		var fs = require('fs'), 
			jsindentatorSrc = fs.readFileSync('./src/jsindentator.js','utf8'), 
			styleFilePath = styleFiles[config.style],
			styleSrc = fs.readFileSync('./src/styles/style1.js','utf8') ;
	
		var GLOBAL=this;
		GLOBAL.syntaxOutput=null;
		var buf = []; 
		buf.push('(function(_, esprima){');
		buf.push(jsindentatorSrc);
		buf.push(styleSrc); 
		buf.push('})'); 
		var fn = eval(buf.join(';')); 
		fn(_, esprima);  
	
		jsindentator.setStyle(jsindentator.styles.style1);
		var code = fs.readFileSync(filename,'utf8'),
			codeOutput = jsindentator.main(code);
		console.log(codeOutput);
}
main();


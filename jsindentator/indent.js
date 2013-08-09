/* 
 * this is a js node application for running the indentator from the command 
 * line (efficient). Do not include this on the browser, instead use ./src/*.js.
 * @author: sgurin
 */

var availableStyles = [
'style1'
]; 

var usage = function(){
	console.log('ERROR, incorrect amount of arguments given, at least 2 parameters config and inputFile are required. Usage: "node indent.js \\{\\} aJsFile.js"');
	process.exit(1);
}
,	main = function(){
	if(process.argv.length<4) {
		usage(); 
	}
}
,	configStr = process.argv[2]
,	filename = process.argv[3]; 

//console.log(configStr, filename); 
//process.argv.forEach(function (val, index, array) {
//  console.log(index + ': ' + val);
//});

//read file
var fs = require('fs')
//,	filename = "argv[1]"
,	inputSrc = fs.readFileSync(filename,'utf8');

console.log(inputSrc); 
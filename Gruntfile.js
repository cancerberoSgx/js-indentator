var a = 
{
  "name": "browserify-sample",
  "version": "0.1.0",
  "description": "exampl of using browserify",
  "devDependencies": {  	
    "browserify-shim": "~3.0.0"
  }

 ,{
	"browserify": {
	"transform": [ "browserify-shim" ]
	},
	"browser": {
	"x"    :  "./vendor/x.js",
	"x-ui" :  "./vendor/x-ui.js",
	"y"    :  "./vendor/y.js",
	"z"    :  "./vendor/z.js"
	},
	"browserify-shim": {
	"x"    :  "$",
	"x-ui" :  { "depends": [ "x" ] },
	"y"    :  { "exports": "Y", "depends": [ "x:$" ] },
	"z"    :  { "exports": "zorro", "depends": [ "x:$", "y:YNOT" ] }
	}
}

}



module.exports = function(grunt) {

var jsSrcFiles = [ 
    'jsindentator/src/jsindentator.js' 
,	'jsindentator/src/styles/style1.js'
,	'jsindentator/src/styles/style2.js'
,	'jsindentator/src/styles/style_clean.js'
,	'jsindentator/src/styles/style_variable1.js'
,	'jsindentator/src/styles/style_prettify1.js'
,	'jsindentator/src/styles/style_prettify_spaces1.js'
,	'jsindentator/src/styles/jsdocgenerator1.js' 
]; 

// Load Grunt tasks declared in the package.json file
require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

// Project configuration.
grunt.initConfig({
	pkg : grunt.file.readJSON('package.json'),
	uglify : {
		options : {
			banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
// mangle: false
		},

		my_target : {
			files : {
				'build/<%= pkg.name %>-jsindentator.min.js' : [ 'jsindentator/src/jsindentator.js' ]
			,	'build/<%= pkg.name %>-style1.min.js' : [ 'jsindentator/src/styles/style1.js' ]
			,	'build/<%= pkg.name %>-style2.min.js' : [ 'jsindentator/src/styles/style2.js' ]
			,	'build/<%= pkg.name %>-style_clean.min.js' : [ 'jsindentator/src/styles/style_clean.js' ]
			,	'build/<%= pkg.name %>-style_variable1.min.js' : [ 'jsindentator/src/styles/style_variable1.js' ]
			,	'build/<%= pkg.name %>-style_prettify1.min.js' : [ 'jsindentator/src/styles/style_prettify1.js' ]
			,	'build/<%= pkg.name %>-style_prettify_spaces1.min.js' : [ 'jsindentator/src/styles/style_prettify_spaces1.js' ]
			,	'build/<%= pkg.name %>-jsdocgenerator1.min.js' : [ 'jsindentator/src/styles/jsdocgenerator1.js' ]
		
			,	'build/<%= pkg.name %>-all.min.js' : jsSrcFiles
			}
		}
	}

	,
	jshint : {
		all : jsSrcFiles

		,
		options : {
			"predef" : [ '_', 'console', 'define' ],
			"laxcomma" : true
		}
	}
			,
		connect : {
			server : {
				options : {
					port : 8080,
					base : '.'
				// keepalive: true
				}
			}
		}

		,
		watch : {
		,			
			apidoc : {
				files : jsSrcFiles,
				tasks : [ 'yuidoc' ]
			}


// livereload : {
// options : {
// livereload : true
// },
// files : [ 'sgxjseditors/src/jseditors-html5.js' ]
// }

		// options: {
		// livereload: true
		// }
			},

	,
	yuidoc : {
		compile : {
			name : '<%= pkg.name %>',
			description : '<%= pkg.description %>',
			version : '<%= pkg.version %>',
			url : '<%= pkg.homepage %>',
			options : {
				paths : 'jsindentator/src',
				outdir : 'apidoc'
			}
		}
	}

});



	grunt.registerTask('run', [ 'connect', 'watch' ]);
grunt.registerTask('default', [ 'uglify' ]);

};
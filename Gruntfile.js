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
// Project configuration.
grunt.initConfig({
	pkg : grunt.file.readJSON('package.json'),
	uglify : {
		options : {
			banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
//			mangle: false
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
});


// Load the plugin that provides the "uglify" task.
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-jshint');

// Default task(s).
grunt.registerTask('default', [ 'uglify' ]);

};
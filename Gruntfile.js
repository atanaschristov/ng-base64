'use strict';

module.exports = function (grunt) {

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Configurable paths
	var config = {
		src: 'src',
		dist: 'dist',
		tests: 'tests',
		mainFile: 'ng-base64'
	};

	// Define the configuration for all the tasks
	grunt.initConfig({

		// Project settings
		config: config,

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						// '.tmp',
						'<%= config.dist %>/*'
					]
				}]
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			src: [
				'Gruntfile.js',
				'<%= config.src %>/{,*/}*.js',
			],
			test: [
				'<%= config.tests %>/{,*/}*.js'
			]
		},
		copy: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.src %>',
					dest: '<%= config.dist %>',
					src: [
						'<%= config.mainFile %>.js'
					]
				}]
			}
		},
		uglify: {
			dist: {
				files: {
					'<%= config.dist %>/<%= config.mainFile %>.min.js': [
						'<%= config.src %>/<%= config.mainFile %>.js'
					]
				}
			}
		},
		karma: {
			// in general the files and the options are configured in karama.conf.js, 
			// but we can overwrite the configuration here 
			options: {
				files: [
					'bower_components/angular/angular.js',
					'bower_components/angular-mocks/angular-mocks.js',
					'<%= config.src %>/**/*.js',
				],
				configFile: 'karma.conf.js',
				logLevel: 'INFO', // OFF, ERROR, WARN, INFO, DEBUG,
				singleRun: true,
				autoWatch: false,
				reporters: ['mocha', 'coverage'], // 'mocha', 'coverage', 'progress', 'dot'
				browsers: ['PhantomJS'] // ,'Chrome', 'Firefox', 'Safari', 'IE', 'Opera'
			},
			unit: {
				// this runs only the unit tests once
				reporters: 'dots',
				files: [{
					src: '<%= config.tests %>/**/*-unit.js'
				}]
			},
			// integration: {
			//	// this runs only the integration tests once
			//	files: [{
			//		src: '<%= config.tests %>/**/*-integration.js'
			//	}]
			// }, // TODO for integration tests
			dev: {
				// this keeps the karma server listening for changes and run all the tests on change
				files: [{
					src: '<%= config.tests %>/**/*.js'
				}],
				singleRun: false,
				autoWatch: true,
			}
		}
	});

	grunt.registerTask('dev', function ( /*target*/ ) {
		grunt.task.run([
			'newer:jshint:test',
			'karma:dev'
		]);
	});

	grunt.registerTask('test', function ( /*target*/ ) {
		grunt.task.run([
			'newer:jshint:test',
			'karma:unit',
			// 'karma:integration' // TODO
		]);
	});

	grunt.registerTask('build', [
		'newer:jshint:src',
		'clean:dist',
		'uglify:dist',
		'copy:dist'
	]);

	grunt.registerTask('default', [
		'test',
		'build'
	]);
};
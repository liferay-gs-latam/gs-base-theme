/**
 * © 2017 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: MIT
 */

'use strict';

var gulp = require('gulp');
var liferayThemeTasks = require('liferay-theme-tasks');
var exec = require('child_process').exec;

liferayThemeTasks.registerTasks({
	gulp: gulp,
	hookFn: function(gulp) {

		gulp.hook('before:build:src', function(done){
			exec('npm run build-webpack', function(error){

				if(error !== null){
					console.log(' ----', '\n', 
								'Webpack is not installed!', '\n',
								'Please run: "npm i webpack"', '\n',
								'----');
				} else {
					done();
					console.log(' ----', '\n',
							'Webpack Production Mode ran successfully', '\n',
							'----');
				}

			});
		});
	}
});

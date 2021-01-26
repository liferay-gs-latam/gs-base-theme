/**
 * © 2017 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: MIT
 */

'use strict';

const gulp = require('gulp');
const liferayThemeTasks = require('liferay-theme-tasks');
const webpack = require('webpack-stream');
const babel = require("gulp-babel");
const replace = require('gulp-string-replace');
const del = require('del');

liferayThemeTasks.registerTasks({

	gulp: gulp,
	hookFn: function(gulp) {

		gulp.hook('before:build:src', function(done) {

			return gulp.src('src/js/app.js')
			.pipe(webpack({
				mode: "development",
				output: {
					filename: "bundle.js"
				},
				module: {
					rules: [
						{
							test: /\.m?js$/,
							exclude: /(node_modules)/,
							use: {
								loader: 'babel-loader',
								options: {
									presets: ["@babel/preset-env"],
								}
							}
						}
					]
				}
			}))
			.pipe(gulp.dest('src/js/dist'))
			.on('end', done);

		})


		gulp.hook('before:build:war', function(done) {

			del(['./build/templates/portal_normal.ftl']);

			return gulp.src(["./src/templates/portal_normal.ftl"])
			.pipe(replace('<!--@timestamp-->', new Date().valueOf()))
			.pipe(gulp.dest('./build/templates/'))
			.on('end', done);

		});
		

	}

 });



 

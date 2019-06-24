
"use strict";

const path = require('path');

let entrypointPath = path.resolve(__dirname + '/src/js');
let outputPath = entrypointPath + '/compiled';

module.exports = {
    entry: entrypointPath + "/index.js",
	output: {
		path: outputPath,
		filename: "bundle.js"
	},
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  };
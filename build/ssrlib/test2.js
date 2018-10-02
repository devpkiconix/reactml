'use strict';

var _fs = require('fs');

var _index = require('./index');

var R = require('ramda');

var srcFile = process.argv[2];

if (!srcFile) {
	console.log("Please pass src file name");
	process.exit(1);
}
var readFile = function readFile(file) {
	return (0, _fs.readFileSync)(file);
};

var main = R.compose(_index.renderYaml, String, readFile);

var appRenderer = main(srcFile);
console.log(appRenderer('App'));
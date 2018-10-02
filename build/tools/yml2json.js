'use strict';

var _fs = require('fs');

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var R = require('ramda');

var parse = function parse(x) {
	return _jsYaml2.default.safeLoad(x);
};

var srcFile = process.argv[2];

if (!srcFile) {
	console.log("Please pass src file name");
	process.exit(1);
}

var readFile = function readFile(file) {
	return (0, _fs.readFileSync)(file);
};
var writeFile = function writeFile(file) {
	return function (content) {
		return (0, _fs.writeFileSync)(file, content);
	};
};
var jsonGen = function jsonGen(obj) {
	return JSON.stringify(obj, null, 2);
};

var outFileName = srcFile.replace(/.yml$|.yaml$/, '.js');

var main = R.compose(writeFile(outFileName), jsonGen, parse, readFile);

main(srcFile);
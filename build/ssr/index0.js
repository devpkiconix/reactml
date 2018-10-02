'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.renderJson = exports.renderYaml = undefined;

var _fs = require('fs');

var _codegen = require('../tools/codegen.js');

var _ramda = require('ramda');

var tap = function tap(msg) {
	return function (x) {
		console.log(msg, x);
		return x;
	};
};
var readFile = function readFile(file) {
	return (0, _fs.readFileSync)(file);
};

var renderComp = function renderComp(Component) {
	return React.createElement(Component, null);
};

var render = function render(yaml, compName) {
	return (0, _ramda.composeP)(renderComp, (0, _ramda.prop)(compName), renderYaml);
};

var renderYaml = exports.renderYaml = function renderYaml(yaml) {
	return Promise.resolve(yaml).then(_codegen.parseYaml).then(tap("before codegen")).then(_codegen.codegenJs2Str).then(tap("after codegen"));
};
var renderJson = exports.renderJson = function renderJson(jsonStr) {
	return Promise.resolve(jsonStr).then(_codegen.parseJson).then(_codegen.codegenJs2Str);
};
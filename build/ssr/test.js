'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.renderJson = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _codegen = require('../tools/codegen.js');

var _ramda = require('ramda');

var tap = function tap(msg) {
	return function (x) {
		console.log(msg, x);
		return x;
	};
};
var renderJson = exports.renderJson = function renderJson(compName) {
	return function (x) {
		return Promise.resolve(x).then(_codegen.parseJson).then(codegenJs2Str).then(render(compName));
	};
};

var render = function render(compName) {
	return renderComp(compName);
};

var renderComp = function renderComp(compName) {
	return function (x) {
		return '<' + compName + ' value={' + x[compName] + '}/>';
	};
};

var codegenJs2Str = function codegenJs2Str(obj) {
	return Promise.resolve(_extends({}, obj, { x: 10
	}));
};

var input = JSON.stringify({ a: 34 });
renderJson('x')(input).then(console.log).catch(console.log);
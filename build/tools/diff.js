'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var R = require('ramda');
var hash = require('object-hash');

var diff = function diff(version1, version2) {
  return hash(version1) === hash(version2);
};

var compare2 = function compare2(prevVersion) {
  return function (compDef, name) {
    return _extends({}, compDef, {
      codegenFlag: diff(prevVersion[name] || 0, compDef) ? false : true
    });
  };
};

var findChangedPure = function findChangedPure(prev) {
  return R.compose(R.mapObjIndexed(compare2(prev)));
};

var findChanged = exports.findChanged = function findChanged(prev, savePrev) {
  return function (components) {
    var diff = findChangedPure(prev)(components);
    savePrev(components);
    return diff;
  };
};

var gPrevVersion = {};

var setPrevVersion = exports.setPrevVersion = function setPrevVersion(components) {
  return gPrevVersion = components;
};
var clearPrevVersion = exports.clearPrevVersion = function clearPrevVersion() {
  return setPrevVersion({});
};

var getPrevVersion = function getPrevVersion() {
  return gPrevVersion;
};

var composableDiff = exports.composableDiff = function composableDiff() {
  return findChanged(getPrevVersion(), setPrevVersion);
};
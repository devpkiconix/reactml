'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var R = require('ramda');
var BEGIN = R.identity;
var componentsLens = exports.componentsLens = R.lensProp('components');
var viewLens = R.lensProp('view');
var childrenLens = R.lensProp('children');
var sansProps = R.omit(['props', 'tag', 'content']);

var normalizeNode = exports.normalizeNode = function normalizeNode(node) {
    if (!node) {
        throw new Error('Cant normalize, node is undefined');
    }
    if (node.content) {
        return R.set(childrenLens, [], node);
    }
    var childNodes = node.children;
    if (!childNodes) {
        childNodes = [];
        if (R.keys(sansProps(node)).length == 1) {
            var tag = R.keys(sansProps(node))[0];
            var childNode = node[tag];
            childNodes = [_extends({ tag: tag }, childNode)];
            node = R.omit([tag], node);
        }
    }
    return R.set(childrenLens, childNodes.map(normalizeNode), node);
};

var normalizeComp = exports.normalizeComp = function normalizeComp(comp) {
    return R.set(viewLens, normalizeNode(comp.view), comp);
};

var normalizeCompArr = R.compose(R.map(normalizeComp), R.prop('components'), BEGIN);

var normalizeChildren = exports.normalizeChildren = function normalizeChildren(spec) {
    return R.set(componentsLens, normalizeCompArr(spec), spec);
};
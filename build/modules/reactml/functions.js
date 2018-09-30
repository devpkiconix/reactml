'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderTree = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ramda = require('ramda');

var _ramdaAdjunct = require('ramda-adjunct');

var _normalize = require('./normalize');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isLeaf = function isLeaf(node) {
    var res = !(0, _ramdaAdjunct.isObject)(node);

    return res;
};
var mapPropName2Value = (0, _ramda.curry)(function (tagGetter, rootProps, dottedName) {
    var value = dottedName;
    if ((0, _ramdaAdjunct.isString)(dottedName) && dottedName.startsWith('...')) {
        value = tagGetter({ tag: dottedName.substr(3) });
    } else if ((0, _ramdaAdjunct.isString)(dottedName) && dottedName.startsWith('..')) {
        value = rootProps[dottedName.substr(2)];
    } else if ((0, _ramdaAdjunct.isString)(dottedName) && dottedName[0] == '.') {
        value = (0, _ramda.path)(dottedName.substr(1).split('.'), rootProps);
    }
    return value;
});

var mapNode2Tag = (0, _ramda.curry)(function (tagFactory, node) {
    if ((0, _ramdaAdjunct.isString)(node)) {
        return node;
    }
    if (!node.tag) {
        throw new Error("Invalid configuration. Specify a tag name");
    }
    return tagFactory[node.tag] || node.tag;
});

var maybeParse = function maybeParse(data) {
    return (0, _ramdaAdjunct.isString)(data) ? (0, _util.fromYaml)(data) : data;
};

var _mapPropsTree = function _mapPropsTree(propGetter, tagGetter, node) {
    var mappedProps = (0, _ramda.map)(propGetter, node.props || {});
    return _extends({}, node, {
        props: mappedProps,
        content: node.content ? propGetter(node.content) : null,
        children: node.children.map(function (child) {
            return _mapPropsTree(propGetter, tagGetter, child);
        })
    });
};

var sansProps = (0, _ramda.omit)(['props', 'tag', 'content']);
var node2children = function node2children(node) {
    var children = node.content ? [node.content] : node.children;

    return children;
};

var traverse = function traverse(basicRender, tagGetter, propGetter) {
    var nodeProcessor = function nodeProcessor(node) {
        var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var children = null,
            mappedChildren = null,
            mappedProps = null;
        if (isLeaf(node)) {
            children = [];
            mappedProps = null;
        } else {
            var _children = node2children(node);
            mappedChildren = _children ? _children.map(nodeProcessor) : null;
            mappedProps = (0, _ramda.map)(propGetter, node.props || {});
            mappedProps.key = key;
        }
        var rendered = basicRender(tagGetter, propGetter, mappedProps, mappedChildren, node);
        return rendered;
    };
    return nodeProcessor;
};

var renderTree = exports.renderTree = function renderTree(propGetter, tagFactory) {
    var tagGetter = mapNode2Tag(tagFactory);
    var treeWalker = traverse(basicRenderReact, tagGetter, propGetter);
    return function (tree) {
        return treeWalker(tree, 0);
    };
};

var codegenTree = function codegenTree(propGetter, _) {
    return function (tree) {
        var tagGetter = function tagGetter(node) {
            return node.tag;
        };

        return traverse(basicRenderCodegen, tagGetter, propGetter)(tree);
    };
};

var basicRenderReact = function basicRenderReact(tagGetter, propGetter, mappedProps, mappedChildren, node) {
    if ((0, _ramdaAdjunct.isString)(node)) {
        return propGetter(node);
    }
    var reactChildren = mappedChildren;
    if (mappedChildren && mappedChildren.length === 0) {
        reactChildren = null;
    }
    return _react2.default.createElement(tagGetter(node), mappedProps, reactChildren);
};

exports.default = {
    isLeaf: isLeaf,
    maybeParse: maybeParse, mapNode2Tag: mapNode2Tag, mapPropName2Value: mapPropName2Value, traverse: traverse,
    renderTree: renderTree, codegenTree: codegenTree, node2children: node2children, normalizeNode: _normalize.normalizeNode
};
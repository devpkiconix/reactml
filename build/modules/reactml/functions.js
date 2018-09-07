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

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isLeaf = function isLeaf(node) {
    return !!(node.content || node.children && node.children.length == 0);
};

var mapPropName2Value = (0, _ramda.curry)(function (tagGetter, rootProps, dottedName) {
    // console.log(`interpreting prop name: [${dottedName}]`);
    var value = dottedName; // default
    if ((0, _ramdaAdjunct.isString)(dottedName) && dottedName.startsWith('...')) {
        // triple tag is a react component
        value = tagGetter({ tag: dottedName.substr(3) });
    } else if ((0, _ramdaAdjunct.isString)(dottedName) && dottedName.startsWith('..')) {
        // Double dot is a function
        value = rootProps[dottedName.substr(2)];
    } else if ((0, _ramdaAdjunct.isString)(dottedName) && dottedName[0] == '.') {
        // single dot is a prop
        value = (0, _ramda.path)(dottedName.substr(1).split('.'), rootProps);
    }
    return value;
});

// Given a reactml node, determine the react
// class/function (i.e. JSX tag)
var mapNode2Tag = (0, _ramda.curry)(function (tagFactory, node) {
    // console.log("node", node)
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
    return node.content ? null : node.children;
};

var traverse = function traverse(basicRender, tagGetter, propGetter) {
    var nodeProcessor = function nodeProcessor(node, key) {
        // console.log('node:', node.id, node)
        var mappedChildren = null;
        if (isLeaf(node)) {
            if (node.content) {
                mappedChildren = [propGetter(node.content)];
            } else {
                // do nothing
            }
        } else {
            var children = node2children(node);
            mappedChildren = children ? children.map(nodeProcessor) : null;
        }
        var mappedProps = (0, _ramda.map)(propGetter, node.props || {});
        mappedProps.key = key;
        var rendered = basicRender(tagGetter, mappedProps, mappedChildren, node);
        return rendered;
    };
    return nodeProcessor;
};

var renderTree = exports.renderTree = function renderTree(propGetter, tagFactory) {
    return function (tree) {
        var tagGetter = mapNode2Tag(tagFactory);
        return traverse(basicRenderReact, tagGetter, propGetter)(tree);
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

var basicRenderReact = function basicRenderReact(tagGetter, mappedProps, mappedChildren, node) {
    // console.log("basicRenderReact", mappedProps)

    return _react2.default.createElement(tagGetter(node), mappedProps, mappedChildren);
};

var basicRenderCodegen = function basicRenderCodegen(tagGetter, mappedProps, mappedChildren, node) {
    var tag = tagGetter(node);
    return '\n<' + tag + ' ' + propsStr + '>\n' + childrenStr + '\n</' + tag + '>\n    ';
};

// Exported functions for reuse and/or testing
exports.default = {
    isLeaf: isLeaf,
    maybeParse: maybeParse, mapNode2Tag: mapNode2Tag, mapPropName2Value: mapPropName2Value, traverse: traverse,
    renderTree: renderTree, codegenTree: codegenTree, node2children: node2children
};
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ramda = require('ramda');

var _ramdaAdjunct = require('ramda-adjunct');

var _util = require('../../modules/reactml/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sansProps = (0, _ramda.omit)(['props', 'tag', 'content']);

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

var isLeaf = function isLeaf(node) {
    switch (node.tag) {
        case 'input':
        case 'textarea':
            return true;
        default:
            break;
    }
    return false;
};

var normalizeTree = function normalizeTree(node) {
    var childNodes = node.children;
    if (!childNodes) {
        childNodes = [];
        if ((0, _ramda.keys)(sansProps(node)).length == 1) {
            var tag = (0, _ramda.keys)(sansProps(node))[0];
            var childNode = sansProps(node)[tag];
            node = (0, _ramda.omit)([tag], node);
            childNodes = [_extends({ tag: tag }, childNode)];
        }
    }
    var children = childNodes.map(normalizeTree);
    return _extends({}, node, { children: children });
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
var mapPropsTree = (0, _ramda.curry)(_mapPropsTree);

var ReactMLNode = function ReactMLNode(_ref) {
    var key = _ref.key,
        tagGetter = _ref.tagGetter,
        node = _ref.node;

    // if (node && node.tag && node.tag == 'Route') {
    //     debugger
    // }
    var tag = tagGetter(node),
        children = node.content ? [node.content] : node.children.map(function (childNode, key) {
        return (0, _ramdaAdjunct.isString)(childNode) ? childNode : ReactMLNode({ key: key, tagGetter: tagGetter, node: childNode });
    });
    console.log('creating ' + node.tag);
    return _react2.default.createElement(tag, _extends({ key: key }, node.props), children.length ? children : null);
};

var render = function render(_deps) {
    return function (rootProps) {
        var tagFactory = rootProps.tagFactory,
            root = rootProps.root,
            stateNodeName = rootProps.stateNodeName,
            tagGetter = mapNode2Tag(tagFactory),
            propGetter = mapPropName2Value(tagGetter, rootProps),
            propMapper = mapPropsTree(propGetter, tagGetter),
            convertToReact = function convertToReact(node) {
            return _react2.default.createElement(ReactMLNode, { tagGetter: tagGetter, node: node });
        },
            pipeline = (0, _ramda.pipe)(maybeParse, normalizeTree, propMapper, convertToReact);

        return pipeline(root);
    };
};

exports.default = { render: render };
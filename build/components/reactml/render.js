'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ramda = require('ramda');

var _normalize = require('../../modules/reactml/normalize');

var _functions = require('../../modules/reactml/functions');

var _functions2 = _interopRequireDefault(_functions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapNode2Tag = _functions2.default.mapNode2Tag,
    mapPropName2Value = _functions2.default.mapPropName2Value,
    renderTree = _functions2.default.renderTree;


var render = function render(_deps) {
    return function (rootProps) {
        var tagFactory = rootProps.tagFactory,
            root = rootProps.root,
            tagGetter = mapNode2Tag(tagFactory),
            propGetter = mapPropName2Value(tagGetter, rootProps),
            pipeline = (0, _ramda.pipe)(_normalize.normalizeNode, renderTree(propGetter, tagFactory));


        return pipeline(root);
    };
};

exports.default = { render: render };
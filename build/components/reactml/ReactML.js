'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ReactML = exports.ReactMLElem = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ramda = require('ramda');

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _dependencies = require('./dependencies');

var _dependencies2 = _interopRequireDefault(_dependencies);

var _render = require('./render');

var _render2 = _interopRequireDefault(_render);

var _validate = require('../../modules/reactml/validate');

var _validate2 = _interopRequireDefault(_validate);

var _normalize = require('../../modules/reactml/normalize');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderer = (0, _ramda.curry)(_render2.default.render)(_dependencies2.default);

var connect = _dependencies2.default.connect,
    withStyles = _dependencies2.default.withStyles;


var defaultToEmpty = (0, _ramda.defaultTo)({});

var state2PropsMaker = function state2PropsMaker(compName, props) {

    var state2propsPath = ['spec', 'components', compName, 'state-to-props'];
    var stateNodeName = props.spec.state.stateNodeName;

    var oState2pathSpec = defaultToEmpty((0, _ramda.path)(state2propsPath, props));
    return function (state) {
        var imPathGet = function imPathGet(dotted) {
            var propPath = [stateNodeName].concat(dotted.split('.'));
            var propVal = state.reactml.getIn(propPath);

            return propVal;
        };
        var mapped = (0, _mapValues2.default)(oState2pathSpec, imPathGet);

        return mapped;
    };
};

var createTags = function createTags(spec, props) {
    var name2func = function name2func(tag) {
        return newTags[tag] || props.tagFactory[tag] || tag;
    };

    var stateNodeName = props.stateNodeName,
        actionLib = props.actionLib;

    var comps = spec.components;
    var compName2Elem = function compName2Elem(def, name, comps) {
        return function (props2) {
            return _react2.default.createElement(ReactMLElem, _extends({}, props2, {
                tagFactory: name2func,
                stateNodeName: stateNodeName,
                spec: spec,
                component: name,
                actionLib: actionLib
            }));
        };
    };

    var newTags = (0, _ramda.mapObjIndexed)(compName2Elem, comps);
    return name2func;
};

var ReactMLElem = exports.ReactMLElem = function ReactMLElem(props) {
    var compName = props.component;
    var compDef = props.spec.components[compName];
    var root = compDef.view;

    var compProps = _extends({ root: root }, props);

    var mapStateToProps = state2PropsMaker(compName, props);
    var connector = connect(mapStateToProps, props.actionLib);
    var stylish = withStyles(defaultToEmpty(compDef.styles));
    return _react2.default.createElement(connector(stylish(renderer)), compProps);
};

var ReactML = exports.ReactML = function ReactML(props) {
    var spec = (0, _normalize.normalizeNode)(props.spec);
    var validationResults = (0, _validate2.default)(spec);
    if (validationResults.errors) {
        return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                'h2',
                null,
                ' Invalid Spec '
            ),
            _react2.default.createElement(
                'pre',
                null,
                JSON.stringify(validationResults),
                ';'
            )
        );
    }

    var tagFactory = createTags(spec, props);

    return _react2.default.createElement(ReactMLElem, _extends({}, props, {
        spec: spec,
        tagFactory: tagFactory
    }));
};
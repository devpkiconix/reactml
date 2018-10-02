'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ReactML = undefined;

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

var _materialUiTagFactory = require('./materialUiTagFactory');

var _materialUiTagFactory2 = _interopRequireDefault(_materialUiTagFactory);

var _validate = require('../../modules/reactml/validate');

var _validate2 = _interopRequireDefault(_validate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderer = (0, _ramda.curry)(_render2.default.render)(_dependencies2.default);

var connect = _dependencies2.default.connect,
    withStyles = _dependencies2.default.withStyles;


var defaultToEmpty = (0, _ramda.defaultTo)({});

var state2PropsMaker = function state2PropsMaker(compName, props) {
    if (!props.spec) {
        debugger;
    }
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

var createTags = function createTags(props) {
    var spec = (0, _ramda.path)(['spec'], props);

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
    var comps = (0, _ramda.path)(['spec', 'components'])(props);
    Object.keys(comps).forEach(function (name) {
        props.tagFactory[name] = function () {
            var props2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return _react2.default.createElement(ReactML, _extends({
                tagFactory: props.tagFactory,
                stateNodeName: props.stateNodeName,
                spec: spec,
                component: name,
                actionLib: props.actionLib
            }, props2));
        };
    });
};

var ReactML = exports.ReactML = function ReactML(props) {
    var spec = (0, _ramda.path)(['spec'], props);

    if (!spec.created) {
        createTags(props);
        spec.created = true;
    }

    var stateNodeName = props.stateNodeName;
    var compName = props.component;
    var compDef = spec.components[compName];
    var styles = compDef.styles;
    var viewDef = compDef.view;

    var compProps = _extends({
        tagFactory: props.tagFactory || _materialUiTagFactory2.default,
        root: viewDef,
        stateNodeName: stateNodeName
    }, props);

    var mapStateToProps = state2PropsMaker(compName, props);
    var connector = connect(mapStateToProps, props.actionLib);
    var stylish = withStyles(defaultToEmpty(styles));
    return _react2.default.createElement(connector(stylish(renderer)), compProps);
};
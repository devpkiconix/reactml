'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ReactML = undefined;

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
            return state.reactml.getIn([stateNodeName].concat(dotted.split('.')));
        };
        var mapped = (0, _mapValues2.default)(oState2pathSpec, imPathGet);
        // console.log(state.reactml.toJS(), "mapped", mapped);
        return mapped;
    };
};

var ReactML = exports.ReactML = function ReactML(props) {
    var stateNodeName = props.stateNodeName;
    var compName = props.component;
    var stylesPath = ['spec', 'components', compName, 'styles'];
    var viewNodePath = ['spec', 'components', compName, 'view'];
    var mapStateToProps = state2PropsMaker(compName, props);
    var actionExtractor = function actionExtractor() {
        return props.actionLib;
    };
    var compProps = {
        tagFactory: props.tagFactory || _materialUiTagFactory2.default,
        root: (0, _ramda.path)(viewNodePath, props),
        // ...mapStateToProps,
        stateNodeName: stateNodeName
    };
    return _react2.default.createElement(connect(mapStateToProps, actionExtractor())(withStyles(defaultToEmpty((0, _ramda.path)(stylesPath, props)))(renderer)), compProps);
};
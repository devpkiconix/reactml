'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.renderYaml = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _immutable = require('immutable');

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _reactRouterDom = require('react-router-dom');

var _reactRouter = require('react-router');

var _redux = require('redux');

var _reactml = require('../modules/reactml');

var _reactml2 = _interopRequireDefault(_reactml);

var _reactRedux = require('react-redux');

var _createMemoryHistory = require('history/createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _ReactML = require('../components/reactml/ReactML');

var _ReactMLHoc = require('../components/reactml/ReactMLHoc');

var _ReactMLHoc2 = _interopRequireDefault(_ReactMLHoc);

var _ArrayMapper = require('../components/reactml/ArrayMapper');

var _ArrayMapper2 = _interopRequireDefault(_ArrayMapper);

var _codegen = require('../tools/codegen.js');

var _util = require('../modules/reactml/util');

var _materialUiTagFactory = require('../components/reactml/materialUiTagFactory');

var _materialUiTagFactory2 = _interopRequireDefault(_materialUiTagFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var defaultTagFactory = _extends({}, _materialUiTagFactory2.default, { ReactMLArrayMapper: _ArrayMapper2.default,
	Switch: _reactRouterDom.Switch, Route: _reactRouterDom.Route, Link: _reactRouterDom.Link
});

var rootReducer = (0, _redux.combineReducers)({
	reactml: _reactml2.default
});

var renderYaml = exports.renderYaml = function renderYaml(yaml) {
	return function (compName) {
		var appTagFactory = defaultTagFactory;
		var actionLib = {};

		var spec = (0, _util.fromYaml)(yaml);

		var App = (0, _ReactMLHoc2.default)(spec, actionLib, appTagFactory, 'inputFlow', compName);
		var store = (0, _redux.createStore)(rootReducer, { reactml: (0, _immutable.fromJS)({
				inputFlow: spec.state.initial
			}) });

		var element = React.createElement(
			'html',
			null,
			React.createElement(
				'body',
				null,
				React.createElement(
					_reactRedux.Provider,
					{ store: store },
					React.createElement(
						_reactRouter.MemoryRouter,
						{ initialEntries: ['/'] },
						React.createElement(App, null)
					)
				)
			)
		);

		return (0, _codegen.prettify)(_server2.default.renderToString(element));
	};
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.history = undefined;

var _redux = require('redux');

var _connectedReactRouter = require('connected-react-router');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

var _createBrowserHistory = require('history/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _modules = require('./modules');

var _modules2 = _interopRequireDefault(_modules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var history = exports.history = (0, _createBrowserHistory2.default)();

var initialState = {};
var enhancers = [];
var middleware = [_reduxThunk2.default, (0, _connectedReactRouter.routerMiddleware)(history)];

if (process.env.NODE_ENV === 'development') {
  var devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  middleware.push(_reduxLogger2.default);
  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

var composedEnhancers = _redux.compose.apply(undefined, [_redux.applyMiddleware.apply(undefined, middleware)].concat(enhancers));

function makeStore() {
  var store = (0, _redux.createStore)((0, _connectedReactRouter.connectRouter)(history)(_modules2.default), initialState, composedEnhancers);
  return store;
}

exports.default = makeStore;
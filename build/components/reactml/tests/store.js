'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _immutable = require('immutable');

var _redux = require('redux');

var _reactml = require('../../../modules/reactml');

var _reactml2 = _interopRequireDefault(_reactml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {};
// const rootReducer = (state, action) => state;


var rootReducer = (0, _redux.combineReducers)({
    reactml: _reactml2.default
});

exports.default = (0, _redux.createStore)(rootReducer, initialState);

// import configureStore from 'redux-mock-store';

// const middlewares = []
// const mockStore = configureStore(middlewares)
// export default mockStore(initialState);
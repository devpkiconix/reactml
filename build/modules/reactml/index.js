'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _immutable = require('immutable');

var _util = require('./util');

var initialState = (0, _immutable.fromJS)({});

exports.default = function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    switch (action.type) {
        case 'REACTML_INIT':
            return state.set(action.stateNodeName, (0, _immutable.fromJS)(action.initial));
        case 'REACTML_UPDATE':
            return (0, _util.setField)(action.name, action.stateNodeName, action.value, state);
        case 'REACTML_APPLY_YML':
            return applyYml(state, action.stateNodeName, action.specTextName, action.specName);
        default:
            break;
    }
    return state;
};

var applyYml = function applyYml(state, stateNodeName, textName, specName) {
    try {
        var value = state.getIn([stateNodeName, textName]);
        var spec = (0, _util.fromYaml)(value);
        var isValid = validateSpec(spec);
        if (isValid) {
            return state.setIn([stateNodeName].concat(specName.split('.'), (0, _immutable.fromJS)(spec))).setIn('specError', null);
        }
    } catch (err) {
        return state.setIn(['specError'], err.toString());
    }
};

var validateSpec = function validateSpec(spec) {
    return true;
}; // for now
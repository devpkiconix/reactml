'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.reactmlSpecChangeValueHandler = exports.setField = exports.reactmlFieldChangeValueHandler = exports.reactmlFieldChangeHandler = exports.dispatchFieldUpdate = exports.fromYaml = exports.toYaml = undefined;

var _immutable = require('immutable');

var _ramda = require('ramda');

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toYaml = exports.toYaml = function toYaml(x) {
    return _jsYaml2.default.safeDump(x, { indent: 2 });
};
var fromYaml = exports.fromYaml = function fromYaml(x) {
    return _jsYaml2.default.safeLoad(x);
};

var dispatchFieldUpdate = exports.dispatchFieldUpdate = function dispatchFieldUpdate(dispatch, name, value) {
    return dispatch({ type: 'REACTML_UPDATE', name: name, value: value });
};

var reactmlFieldChangeHandler = exports.reactmlFieldChangeHandler = function reactmlFieldChangeHandler(name) {
    return function (event) {
        return function (dispatch) {
            dispatchFieldUpdate(dispatch, name, event.target.value);
        };
    };
};
var reactmlFieldChangeValueHandler = exports.reactmlFieldChangeValueHandler = function reactmlFieldChangeValueHandler(name) {
    return function (value) {
        return function (dispatch) {
            dispatchFieldUpdate(dispatch, name, value);
        };
    };
};

var setField = exports.setField = function setField(dottedName, stateNodeName, value, state) {
    return state.setIn(stateNodeName ? (stateNodeName + '.' + dottedName).split('.') : dottedName.split('.'), value);
};

var reactmlSpecChangeValueHandler = exports.reactmlSpecChangeValueHandler = function reactmlSpecChangeValueHandler(name) {
    return function (value) {
        return function (dispatch) {
            dispatchFieldUpdate(dispatch, name, value);
            try {
                var spec = fromYaml(value);
                var isValid = validateSpec(spec);
                if (isValid) {
                    dispatchFieldUpdate(dispatch, 'spec', (0, _immutable.fromJS)(spec));
                    dispatchFieldUpdate(dispatch, 'specError', null);
                }
            } catch (err) {
                dispatchFieldUpdate(dispatch, 'specError', err.toString());
            }
        };
    };
};

var validateSpec = function validateSpec(spec) {
    return true;
};
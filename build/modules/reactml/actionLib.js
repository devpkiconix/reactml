'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var editChangeHandler = function editChangeHandler(fieldName) {
    return function (dispatch) {
        return function (event) {
            var value = event.target.value;
            dispatch({ type: 'REACTML_UPDATE', fieldName: fieldName, value: value });
        };
    };
};

exports.default = {
    editChangeHandler: editChangeHandler
};
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ReactMLArrayMapper = function ReactMLArrayMapper(props) {
    var over = props.over,
        as = props.as,
        component = props.component;
    // console.log("ArrMapper", props)

    if (!(over && as && component)) {
        return _react2.default.createElement(
            'div',
            null,
            ' Loading...'
        );
    }
    var mapped = over.map(function (item, i) {
        // debugger
        var newProps = _extends({}, props, _defineProperty({
            key: i
        }, as, item));
        return _react2.default.createElement(component, _extends({}, newProps));
    });
    return _react2.default.createElement(
        'div',
        null,
        mapped
    );
};

exports.default = ReactMLArrayMapper;
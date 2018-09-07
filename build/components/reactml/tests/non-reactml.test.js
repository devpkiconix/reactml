'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('Test non-reactml renders correctly', function () {
    var tree = _reactTestRenderer2.default.create(_react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
            'span',
            null,
            'hello world'
        )
    )).toJSON();
    expect(tree).toMatchSnapshot();
});
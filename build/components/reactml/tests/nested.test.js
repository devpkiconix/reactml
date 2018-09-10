'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _ReactML = require('../ReactML');

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tagFactory = {};
var lib = {};

describe("Reactml rendering of nested components", function () {
    it('auto-add to tag factory', function () {
        var spec = {
            state: {
                stateNodeName: 'compstate1'
            },
            components: {
                page1: {
                    view: {
                        tag: 'div',
                        children: [{ tag: 'span', content: 'hello world' }, { tag: 'LowLevelComp' }, { tag: 'AnotherLowLevelComp' }]
                    }
                },
                LowLevelComp: {
                    view: { tag: 'span', content: 'low' }
                },
                AnotherLowLevelComp: {
                    view: { tag: 'span', content: 'low too' }
                }
            }
        };
        var tree = _reactTestRenderer2.default.create(_react2.default.createElement(
            _reactRedux.Provider,
            { store: _store2.default },
            _react2.default.createElement(_ReactML.ReactML, {
                tagFactory: tagFactory,
                stateNodeName: 'compstate1',
                spec: spec, component: 'page1',
                actionLib: lib
            })
        )).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
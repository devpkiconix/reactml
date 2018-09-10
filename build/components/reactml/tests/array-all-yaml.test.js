'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _ReactML = require('../ReactML');

var _ArrayMapper = require('../ArrayMapper');

var _ArrayMapper2 = _interopRequireDefault(_ArrayMapper);

var _ReactMLHoc = require('../ReactMLHoc');

var _ReactMLHoc2 = _interopRequireDefault(_ReactMLHoc);

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tagFactory = {};
var lib = {};

var initial = {
    todoList: [{ label: "get milk", done: true }, { label: "buy beans", done: true }, { label: "grind beans", done: true }, { label: "brew coffee", done: false }, { label: "boil milk", done: false }, { label: "mix'em up", done: false }, { label: "enjoy", done: false }]
};

describe("Uninterpreted props", function () {
    beforeEach(function () {
        return _store2.default.dispatch({
            type: 'REACTML_INIT',
            initial: initial,
            stateNodeName: 'todoApp'
        });
    });

    it("array rendering with uninterpreted props", function () {
        var spec = {
            state: {
                stateNodeName: 'todoApp'

            },
            components: {
                Todo: {
                    view: {
                        tag: 'div',
                        children: [{
                            tag: 'input',
                            props: {
                                type: 'checkbox',
                                value: '.todo.done'
                            }
                        }, {
                            tag: 'span',
                            content: '.todo.label'
                        }]
                    }
                },
                todoListView: {
                    'state-to-props': {
                        todoList: 'todoList'
                    },
                    view: {
                        tag: 'div',
                        children: [{
                            tag: 'h4', content: 'Todo List'
                        }, {
                            tag: 'ReactMLArrayMapper',
                            props: {
                                over: '.todoList',
                                as: 'todo',
                                component: '...Todo'
                            }
                        }]
                    }
                }

            }
        };
        var actionLib = {};
        var tagFactory = { ReactMLArrayMapper: _ArrayMapper2.default };
        var compName = 'todoListView';
        var stateNodeName = 'todoApp';

        var TodoApp = (0, _ReactMLHoc2.default)(spec, actionLib, tagFactory, stateNodeName, compName);

        var elem = _reactTestRenderer2.default.create(_react2.default.createElement(
            _reactRedux.Provider,
            { store: _store2.default },
            _react2.default.createElement(TodoApp, null)
        ));

        var tree = elem.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
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

describe("Basic reactml rendering", function () {
    beforeEach(function () {
        return _store2.default.dispatch({
            type: 'REACTML_INIT',
            initial: {
                todoList: [{ label: "get milk", done: true }, { label: "buy beans", done: true }, { label: "grind beans", done: true }, { label: "brew coffee", done: false }, { label: "boil milk", done: false }, { label: "mix'em up", done: false }, { label: "enjoy", done: false }]
            },
            stateNodeName: 'todoApp'
        });
    });
    it('Simple reactml renders correctly', function () {

        var spec = {
            state: {
                stateNodeName: 'compstate1'
            },
            components: {
                page1: {
                    view: {
                        tag: 'div',
                        children: [{ tag: 'span', content: 'hello world' }]
                    }
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

    it('Invalid config file shows errors', function () {
        var spec = {
            state: {
                stateNodeName: 'compstate2'
            },
            components: {
                /* view node should be here */
                page1: {
                    tag: 'div',
                    children: [{ tag: 'span', content: 'hello world' }]
                }
            }
        };
        var tree = _reactTestRenderer2.default.create(_react2.default.createElement(
            _reactRedux.Provider,
            { store: _store2.default },
            _react2.default.createElement(_ReactML.ReactML, {
                tagFactory: tagFactory,
                stateNodeName: 'compstate2',
                spec: spec, component: 'page1',
                actionLib: lib
            })
        )).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("array rendering", function () {
        var spec = {
            state: {
                stateNodeName: 'todoApp',
                initial: {
                    todoList: [{ label: "get milk", done: true }, { label: "buy beans", done: true }, { label: "grind beans", done: true }, { label: "brew coffee", done: false }, { label: "boil milk", done: false }, { label: "mix'em up", done: false }, { label: "enjoy", done: false }]
                }
            },
            components: {
                coffee: {
                    'state-to-props': {
                        todoList: '.todoList'
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
        var Todo = function Todo(_ref) {
            var todo = _ref.todo;
            return _react2.default.createElement(
                'div',
                { className: 'checkbox' },
                _react2.default.createElement(
                    'label',
                    null,
                    _react2.default.createElement('input', { type: 'checkbox', value: todo.get('label'),
                        checked: todo.get('done') }),
                    todo.get('label')
                )
            );
        };

        var actionLib = {};
        var tagFactory = { ReactMLArrayMapper: _ArrayMapper2.default, Todo: Todo };
        var compName = 'coffee';
        var stateNodeName = 'todoApp';

        var TodoList = (0, _ReactMLHoc2.default)(spec, actionLib, tagFactory, stateNodeName, compName);

        var elem = _reactTestRenderer2.default.create(_react2.default.createElement(
            _reactRedux.Provider,
            { store: _store2.default },
            _react2.default.createElement(TodoList, null)
        ));

        var tree = elem.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
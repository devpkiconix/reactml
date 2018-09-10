import React from 'react';
import { Provider } from 'react-redux'
import { ReactML } from '../ReactML';
import ReactMLArrayMapper from '../ArrayMapper';
import ReactMLHoc from '../ReactMLHoc';
import renderer from 'react-test-renderer';
import store from './store';

const tagFactory = {};
const lib = {};

const initial = {
    todoList: [
        { label: "get milk", done: true },
        { label: "buy beans", done: true },
        { label: "grind beans", done: true },
        { label: "brew coffee", done: false },
        { label: "boil milk", done: false },
        { label: "mix'em up", done: false },
        { label: "enjoy", done: false },
    ]
};

describe("Uninterpreted props", () => {
    beforeEach(() => {
        return store.dispatch({
            type: 'REACTML_INIT',
            initial,
            stateNodeName: 'todoApp'
        });
    });

    it("array rendering with uninterpreted props", () => {
        const spec = {
            state: {
                stateNodeName: 'todoApp',

                // NOTE: State initialization is not tested here. That would require
                // multiple redux actions to be processed asynchronously, and seems
                // overly complex to test. For now, we'll test the case where the
                // state has already been initialized.
            },
            components: {
                Todo: {
                    view: {
                        tag: 'div',
                        children: [
                            {
                                tag: 'input',
                                props: {
                                    type: 'checkbox',
                                    value: '.todo.done',
                                },
                            },
                            {
                                tag: 'span',
                                content: '.todo.label',
                            }
                        ]
                    },
                },
                todoListView: {
                    'state-to-props': {
                        todoList: 'todoList'
                    },
                    view: {
                        tag: 'div',
                        children: [
                            {
                                tag: 'h4', content: 'Todo List',
                            },
                            {
                                tag: 'ReactMLArrayMapper',
                                props: {
                                    over: '.todoList',
                                    as: 'todo',
                                    component: '...Todo'
                                }
                            }
                        ]
                    }
                }

            }
        };
        const actionLib = {};
        const tagFactory = { ReactMLArrayMapper, };
        const compName = 'todoListView';
        const stateNodeName = 'todoApp';

        const TodoApp = ReactMLHoc(spec,
            actionLib, tagFactory,
            stateNodeName, compName);

        const elem = renderer
            .create(
                <Provider store={store}>
                    <TodoApp />
                </Provider>);

        const tree = elem.toJSON();
        expect(tree).toMatchSnapshot();
    });
})

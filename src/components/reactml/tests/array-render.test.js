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

describe("Basic reactml rendering", () => {
    beforeEach(() => {
        return store.dispatch({
            type: 'REACTML_INIT',
            initial,
            stateNodeName: 'todoApp'
        });
    });

    it("array rendering", () => {
        const spec = {
            state: {
                stateNodeName: 'todoApp',
                // initial,
            },
            components: {
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
        const Todo = ({ todo }) =>
            <div className="checkbox">
                <label>
                    <input type="checkbox" value={todo.get('label')}
                        checked={todo.get('done')} />
                    {todo.get('label')}
                </label>
            </div>;

        const actionLib = {};
        const tagFactory = { ReactMLArrayMapper, Todo, };
        const compName = 'todoListView';
        const stateNodeName = 'todoApp';

        const TodoList = ReactMLHoc(spec,
            actionLib, tagFactory,
            stateNodeName, compName);

        const elem = renderer
            .create(
                <Provider store={store}>
                    <TodoList />
                </Provider>);

        const tree = elem.toJSON();
        expect(tree).toMatchSnapshot();
    });
})

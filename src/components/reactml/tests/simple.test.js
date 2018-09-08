import React from 'react';
import { Provider } from 'react-redux'
import { ReactML } from '../ReactML';
import ReactMLArrayMapper from '../ArrayMapper';
import ReactMLHoc from '../ReactMLHoc';
import renderer from 'react-test-renderer';
import store from './store';
import functions from '../../../modules/reactml/functions';

const { maybeParse } = functions;

const tagFactory = {};
const lib = {};

describe("Basic reactml rendering", () => {
    beforeEach(() => {
        return store.dispatch({
            type: 'REACTML_INIT',
            initial: {
                todoList: [
                    { label: "get milk", done: true },
                    { label: "buy beans", done: true },
                    { label: "grind beans", done: true },
                    { label: "brew coffee", done: false },
                    { label: "boil milk", done: false },
                    { label: "mix'em up", done: false },
                    { label: "enjoy", done: false },
                ]
            },
            stateNodeName: 'todoApp'
        });
    })
    it('Simple reactml renders correctly', () => {

        const spec = {
            state: {
                stateNodeName: 'compstate1'
            },
            components: {
                page1: {
                    view: {
                        tag: 'div',
                        children: [
                            { tag: 'span', content: 'hello world' }
                        ]
                    }
                }
            }
        };
        const tree = renderer
            .create(
                <Provider store={store}>
                    <ReactML
                        tagFactory={tagFactory}
                        stateNodeName="compstate1"
                        spec={spec} component="page1"
                        actionLib={lib}
                    />
                </Provider>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Invalid config file shows errors', () => {
        const spec = {
            state: {
                stateNodeName: 'compstate2'
            },
            components: {
                /* view node should be here */
                page1: {
                    tag: 'div',
                    children: [
                        { tag: 'span', content: 'hello world' }
                    ]
                }
            }
        };
        const tree = renderer
            .create(
                <Provider store={store}>
                    <ReactML
                        tagFactory={tagFactory}
                        stateNodeName="compstate2"
                        spec={spec} component="page1"
                        actionLib={lib}
                    />
                </Provider>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

})

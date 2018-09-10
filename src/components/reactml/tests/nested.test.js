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

describe("Reactml rendering of nested components", () => {
	it('auto-add to tag factory', () => {
        const spec = {
            state: {
                stateNodeName: 'compstate1'
            },
            components: {
                page1: {
                    view: {
                        tag: 'div',
                        children: [
                            { tag: 'span', content: 'hello world' },
                            { tag: 'LowLevelComp' },
                            { tag: 'AnotherLowLevelComp' },
                        ]
                    }
                },
                LowLevelComp: {
                	view: { tag: 'span', content: 'low' },
                },
                AnotherLowLevelComp: {
                	view: { tag: 'span', content: 'low too' },
                },
            },
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
        expect(tree).toMatchSnapshot();	});
});
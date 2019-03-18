// tslint:disable:variable-name
// tslint:disable:no-any
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { contextualWrapper, contextualView } from '../render';

type ExptState = { count: number; };

interface ExptStore {
    count: number;
    up: () => (state: ExptState) => ExptState;
    down: () => (state: ExptState) => ExptState;
}

const basicView = (props: ExptStore) => (
    <div>
        <h1>{props.count}</h1>
        <button onClick={props.up}>Up</button>
        <button onClick={props.down}>Down</button>
    </div>
);

const basicView2 = ({ count, up, down }: ExptStore) => (
    <React.Fragment>
        <div>Current Counter value: {count}</div>
        <div>
            <button onClick={up}>Incr</button>
            <button onClick={down}>Decr</button>
        </div>
    </React.Fragment>
);
describe("contextual render ", () => {
    it("test", () => {
        const View1 = contextualWrapper(contextualView(basicView));
        const View2 = contextualWrapper(contextualView(basicView2));

        const state1 = { count: 100 };
        const state2 = { count: 3241 };
        const state3 = { count: 1000 };
        const state4 = { count: 32410 };

        const dom1 = View1(state1);
        const dom2 = View2(state2);
        const html1 = renderToString(dom1);
        const html2 = renderToString(dom2);
        expect(html1).toBe(`<div><h1>100</h1><button>Up</button><button>Down</button></div>`);
        expect(html2).toBe(`<div>Current Counter value: <!-- -->3241</div><div><button>Incr</button><button>Decr</button></div>`);

        // re-render same views with different state
        const dom3 = View1(state3);
        const dom4 = View2(state4);
        const html3 = renderToString(dom3);
        const html4 = renderToString(dom4);
        expect(html3).toBe(`<div><h1>1000</h1><button>Up</button><button>Down</button></div>`);
        expect(html4).toBe(`<div>Current Counter value: <!-- -->32410</div><div><button>Incr</button><button>Decr</button></div>`);

    });
});

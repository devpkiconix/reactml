// tslint:disable:variable-name
// tslint:disable:no-any
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { ast2Vocab2, reactRenderer } from './render';
import { Vocab } from './vocabulary';

const { parseF } = require('./parserV5');

export const rtmlRenderTest = (spec: string, baseVocab: Vocab, compName: string, state: any, expected: string, done: jest.DoneCallback) =>
    parseF(spec)
        .map(ast2Vocab2(baseVocab))
        .fork(done, (vocab: Vocab) => {
            const render = reactRenderer(vocab)(state);
            const vdom = render(compName);
            const actual = renderToString(vdom);
            expect(actual).toBe(expected);
            done();
        });

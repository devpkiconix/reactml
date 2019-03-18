// tslint:disable:variable-name
// tslint:disable:no-any
import * as React from 'react';
import { newVocab } from "../rtmlVocab";
import { rtmlRenderTest } from "../testlib";

describe("rtml loop render ", () => {
    it("loop test", (done) => {
        const TableRow = (props: any) => {
            const { account } = props;
            return <div className="row">{account.id}</div>;
        };
        const state = {
            user: {
                accounts: [
                    { id: 1, },
                    { id: 2, },
                ]
            }
        };
        const spec = `loopy = Loop(over="$p:user.accounts" as="account" component="TableRow");`;
        const compName = "loopy";
        const expected = `<div class="row">1</div><div class="row">2</div>`;
        const baseVocab = newVocab({ TableRow });

        rtmlRenderTest(spec, baseVocab, compName, state, expected, done);
    });
});

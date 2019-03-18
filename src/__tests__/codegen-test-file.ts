// tslint:disable:variable-name
// tslint:disable:no-any
import { mapObjIndexed } from 'ramda';
import prettify from '../prettify';
import { codegen } from '../codegenfs';

describe("rtml codegen ", () => {

    it("passing props to components", (done) => {
        const spec = `
        `;
        const inFile = __dirname + `/data/codegentest.rtml`;
        const outFile = __dirname + `/data/codegentest.js`;
        codegen(inFile, outFile)
            .fork((err) => done(new Error(err.toString())), () => done());
    });
});

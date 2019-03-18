"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegenfs_1 = require("../codegenfs");
describe("rtml codegen ", () => {
    it("passing props to components", (done) => {
        const spec = `
        `;
        const inFile = __dirname + `/data/codegentest.rtml`;
        const outFile = __dirname + `/data/codegentest.js`;
        codegenfs_1.codegen(inFile, outFile)
            .fork((err) => done(new Error(err.toString())), () => done());
    });
});
//# sourceMappingURL=codegen-test-file.js.map
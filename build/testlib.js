"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("react-dom/server");
const render_1 = require("./render");
const { parseF } = require('./parserV5');
exports.rtmlRenderTest = (spec, baseVocab, compName, state, expected, done) => parseF(spec)
    .map(render_1.ast2Vocab2(baseVocab))
    .fork(done, (vocab) => {
    const render = render_1.reactRenderer(vocab)(state);
    const vdom = render(compName);
    const actual = server_1.renderToString(vdom);
    expect(actual).toBe(expected);
    done();
});
//# sourceMappingURL=testlib.js.map
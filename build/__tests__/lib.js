"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("react-dom/server");
const viewlang_parser_1 = require("../viewlang-parser");
const viewlang_render_1 = require("../viewlang-render");
exports.rtmlRenderTest = (spec, baseVocab, compName, state, expected, done) => viewlang_parser_1.parseF(spec)
    .map(viewlang_render_1.ast2Vocab2(baseVocab))
    .fork(done, (vocab) => {
    const render = viewlang_render_1.reactRenderer(vocab)(state);
    const vdom = render(compName);
    const actual = server_1.renderToString(vdom);
    expect(actual).toBe(expected);
    done();
});
//# sourceMappingURL=lib.js.map
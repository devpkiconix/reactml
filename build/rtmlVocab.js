"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const vocabulary_1 = require("./vocabulary");
const components_1 = require("./components");
const render_1 = require("./render");
exports.newVocab = (dict) => {
    const vocab = vocabulary_1.newVocab(dict);
    // tslint:disable-next-line:variable-name
    const ReactFragment = React.Fragment;
    // pre-populate with rtml's supplied components
    render_1.addToVocab(vocab, "ReactFragment", ReactFragment);
    render_1.addToVocab(vocab, "Loop", components_1.ArrayMapper(vocab));
    render_1.addToVocab(vocab, "ArrayMapper", components_1.ArrayMapper(vocab)); // alias
    render_1.addToVocab(vocab, "If", components_1.Conditional(vocab));
    render_1.addToVocab(vocab, "Conditional", components_1.Conditional(vocab));
    return vocab;
};
//# sourceMappingURL=rtmlVocab.js.map
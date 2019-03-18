const React = require("react");
import { newVocab as makeBasicVocab, Dict, Vocab } from "./vocabulary";
import { ArrayMapper, Conditional } from "./components";
import { addToVocab } from "./render";

export const newVocab = (dict: Dict | undefined): Vocab => {
    const vocab = makeBasicVocab(dict);

    // tslint:disable-next-line:variable-name
    const ReactFragment = React.Fragment;

    // pre-populate with rtml's supplied components
    addToVocab(vocab, "ReactFragment", ReactFragment);
    addToVocab(vocab, "Loop", ArrayMapper(vocab));
    addToVocab(vocab, "ArrayMapper", ArrayMapper(vocab));// alias
    addToVocab(vocab, "If", Conditional(vocab));
    addToVocab(vocab, "Conditional", Conditional(vocab));
    return vocab;
};

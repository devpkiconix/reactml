"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:variable-name
// tslint:disable:no-any
const React = require("react");
const ramda_1 = require("ramda");
const ramda_2 = require("ramda");
const parser_1 = require("./parser");
const contextual = require("react-contextual");
const Provider = contextual.Provider;
const subscribe = contextual.subscribe;
exports.contextualView = (component) => subscribe()(component);
exports.contextualWrapper = (View) => (state) => {
    // console.log("Rendering wrapped element with props", state);
    return React.createElement(Provider, Object.assign({}, state),
        React.createElement(View, null));
};
exports.renderContextual = (appState) => (View) => (props) => React.createElement(Provider, Object.assign({}, appState),
    React.createElement(View, Object.assign({}, props)));
const stringMapper = (appstate, state) => (propVal) => {
    if (typeof propVal === "string") {
        const parts = propVal.split(":");
        if (parts.length > 1) {
            propVal = { type: parts[0], id: parts[1] };
        }
    }
    if (!(typeof propVal === "object" && propVal.id)) {
        return propVal;
    }
    switch (propVal.type) {
        case "$p": // p = props
            const lens = ramda_1.lensPath(propVal.id.split("."));
            return ramda_1.view(lens, state);
        case "$g": // g = global state
            const glens = ramda_1.lensPath(propVal.id.split("."));
            return ramda_1.view(glens, appstate || {});
        default: break;
    }
    return propVal;
};
const propRe = /(\$[pg]):([a-zA-Z0-9_\.]+)/g;
const Content = (text, key) => (appstate) => (state) => {
    const newText = text.replace(propRe, (_, p1, p2) => stringMapper(appstate, state)({ type: p1, id: p2 }));
    return React.createElement(React.Fragment, { key: key }, newText);
};
const propMapper = (vocab) => (appstate) => (state) => (propVal) => {
    if (typeof propVal === "string") {
        const parts = propVal.split(":");
        if (parts.length > 1) {
            propVal = { type: parts[0], id: parts[1] };
        }
    }
    if (!(typeof propVal === "object" && propVal.id)) {
        return propVal;
    }
    switch (propVal.type) {
        case "$f":
            return exports.vocabLookupReactComp(vocab, propVal.id)(appstate);
        case "$d":
            return vocab.map("domEvtHandle")(propVal.id);
        case "$ps": // p = props
            const pslens = ramda_1.lensPath(propVal.id.split("."));
            return ramda_1.view(pslens, state) || ramda_1.view(pslens, state);
        case "$p": // p = props
            const lens = ramda_1.lensPath(propVal.id.split("."));
            return ramda_1.view(lens, state);
        case "$g": // g = global state
            const glens = ramda_1.lensPath(propVal.id.split("."));
            return ramda_1.view(glens, appstate || {});
        default: break;
    }
    return propVal;
};
const renderChildless = (props) => (Child, key) => React.createElement(Child, Object.assign({}, props, { key }));
exports.ast2Vocab = (ast, vocab) => {
    const renderWithChildren = (def) => (appstate) => (props) => {
        const Elem = exports.vocabLookupReactComp(vocab, def.tag)(appstate)
            || def.tag;
        const WithChildren = def2elemWithProps(Elem, def.children || [])(appstate);
        return renderChildless(props)(WithChildren, 0);
    };
    const hasChildren = (def) => (def.children && def.children.length > 0);
    const objdef2elem = (def, key) => (appstate) => {
        const pMapper = propMapper(vocab)(appstate);
        const Elem = exports.vocabLookupReactComp(vocab, def.tag)(appstate)
            || def.tag;
        const Elem2 = (state) => {
            const props = ramda_2.mapObjIndexed(pMapper(state), def.props);
            if (!hasChildren(def)) {
                return renderChildless(props)(Elem, 0);
            }
            return renderWithChildren(def)(appstate)(props);
        };
        return Elem2;
    };
    const def2elemWithProps = (Elem, elemList) => {
        if (!elemList) {
            throw new Error("Invalid AST node");
        }
        return (appstate) => {
            const renderChildren = (state) => (children) => children
                .map(makeChild(appstate))
                .map(renderChildless(state));
            return (state) => React.createElement(Elem, state, renderChildren(state)(elemList));
        };
    };
    const def2elemNoProps = (Elem, elemList) => {
        if (!elemList) {
            throw new Error("Invalid AST node");
        }
        return (appstate) => {
            const renderChildren = (state) => (children) => children
                .map(makeChild(appstate))
                .map(renderChildless(state));
            return (state) => React.createElement(Elem, null, renderChildren(state)(elemList));
        };
    };
    const makeChild = (appstate) => (child, key) => (typeof child === "string")
        ?
            Content(child, key)(appstate)
        :
            objdef2elem(child, key)(appstate);
    const def2elem = (astNode) => def2elemNoProps(React.Fragment, astNode);
    const elems = ramda_2.mapObjIndexed(def2elem, ast);
    const withName = ramda_2.mapObjIndexed(nameFunction, elems);
    const withMarking = ramda_2.mapObjIndexed(markComponent, withName);
    Object.keys(withName).forEach((name) => vocab.update(name, withName[name]), withMarking);
    return vocab;
};
exports.ast2Vocab2 = (vocab) => (ast) => exports.ast2Vocab(ast, vocab);
exports.addToVocab = (vocab, name, twoStepComp) => {
    const withName = nameFunction(twoStepComp, name);
    const withMarking = markComponent(withName);
    vocab.update(name, withMarking);
};
// Mark our react components with a marker to distinguish
// it from other react components. Our two step react components
// take a appstate param which returns an actual react component.
// This is to accommodate rendering of our components without
// specifying any props in our language. And that is done to
// have a better user experience.
const markComponent = (fn) => {
    fn.vocab_function_type = TWO_STEP_REACT;
    return fn;
};
const isMarked = (fn) => fn.vocab_function_type &&
    fn.vocab_function_type === TWO_STEP_REACT;
// Lookup vocab, and if the looked up function is marked with TWO_STEP_REACT
// type then apply the appstate
exports.vocabLookupReactComp = (vocab, name) => (appstate) => {
    const fn = vocab.map(name);
    if (!fn) {
        return undefined;
    }
    if (isMarked(fn)) {
        return fn(appstate);
    }
    return fn;
};
// Name react element functions to help in debugging
function nameFunction(body, name) {
    return { [name](...args) { return body(...args); } }[name];
}
// Private, don't export this
const TWO_STEP_REACT = Symbol("react comp with appstate");
exports.reactRenderer = (vocab) => (state) => (tag) => {
    const Comp1 = exports.vocabLookupReactComp(vocab, tag);
    const Comp = Comp1 && Comp1(state) || tag;
    return React.createElement(Comp, state);
};
// Courtesy: https://medium.com/front-end-weekly/loading-components-asynchronously-in-react-app-with-an-hoc-61ca27c4fda7
const asyncComponent = (name, importComponent) => {
    return class extends React.Component {
        constructor() {
            super(...arguments);
            this.state = {
                component: null
            };
        }
        componentDidMount() {
            console.log("Importing asynchronously..");
            importComponent()
                .then(({ vocab }) => {
                const component = vocab.map(name);
                console.log(" asynchronous import done.", component);
                this.setState({ component });
            }).catch(console.error);
        }
        render() {
            const fn = this.state.component;
            const C = isMarked(fn) ? fn(this.props) : fn;
            return C ? React.createElement(C, Object.assign({}, this.props)) : null;
        }
    };
};
const asyncElemMaker = (props) => {
    const { rtml, ctx, name } = props;
    if (!!(rtml && ctx && ctx.vocab && ctx.name)) {
        return Promise.reject("Rtml: Invalid props");
    }
    // vocab is updated in place
    return parser_1.parseF(rtml).map(ast => exports.ast2Vocab(ctx.vocab, ast)) // parse
        .promise();
};
exports.Rtml = (props) => {
    const Component = asyncComponent(props.name, () => asyncElemMaker(props));
    return React.createElement(Component, null);
};
//# sourceMappingURL=viewlang-render.js.map
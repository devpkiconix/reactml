"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:variable-name
// tslint:disable:no-any
const React = require("react");
const ramda_1 = require("ramda");
const ramda_2 = require("ramda");
const parseF = require('./parserV5').parseF;
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
const renderChildless = (props) => (Child, key) => {
    return React.createElement(Child, Object.assign({}, props, { key }));
};
exports.ast2Vocab = (ast, vocab) => {
    const renderWithChildren = (def) => (appstate) => (props) => {
        const Elem = exports.vocabLookupReactComp(vocab, def.tag)(appstate)
            || def.tag;
        const props2 = Object.create(props);
        const WithChildren = def2elemWithProps(Elem, def.children || [])(appstate);
        return renderChildless(props2)(WithChildren, 0);
    };
    const hasChildren = (def) => (def.children && def.children.length > 0);
    const objdef2elem = (def, key) => (appstate) => {
        const pMapper = propMapper(vocab)(appstate);
        const Elem = exports.vocabLookupReactComp(vocab, def.tag)(appstate)
            || def.tag;
        const root = Object.create(appstate);
        const Elem2 = (state) => {
            const parentState = Object.create(root);
            const mapped = ramda_2.mapObjIndexed(pMapper(state), def.props);
            Object.keys(state).forEach(name => (parentState[name] = state[name]));
            const childProps = Object.create(parentState);
            Object.keys(mapped).forEach(name => (childProps[name] = mapped[name]));
            if (!hasChildren(def)) {
                return renderChildless(childProps)(Elem, 0);
            }
            return renderWithChildren(def)(appstate)(childProps);
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
            const renderChildren = (state) => (children) => {
                try {
                    const children2 = Array.isArray(children) ? children : [children];
                    return children2
                        .map(makeChild(appstate))
                        .map(renderChildless(state));
                }
                catch (err) {
                    throw err;
                }
            };
            const root = Object.create(appstate);
            return (state) => {
                const props = Object.create(root);
                Object.keys(state).forEach((name) => (props[name] = state[name]));
                return React.createElement(Elem, root, renderChildren(state)(elemList));
            };
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
    Object.keys(withName).forEach((name) => exports.addToVocab(vocab, name, elems[name]));
    return vocab;
};
exports.ast2Vocab2 = (vocab) => (ast) => exports.ast2Vocab(ast, vocab);
exports.addToVocab = (vocab, name, twoStepComp) => {
    const withName = nameFunction(twoStepComp, name);
    const withMarking = markComponent(withName);
    vocab.update(name, withMarking);
    // console.log("Updated vocab", vocab.getDict());
    return vocab;
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
const isMarked = (fn) => {
    // console.log("Checking if ", fn, " is a 2-step react component");
    return fn && fn.vocab_function_type &&
        fn.vocab_function_type === TWO_STEP_REACT;
};
// Lookup vocab, and if the looked up function is marked with TWO_STEP_REACT
// type then apply the appstate
exports.vocabLookupReactComp = (vocab, name) => (appstate) => {
    try {
        const fn = vocab.map(name);
        if (!fn) {
            return undefined;
        }
        if (isMarked(fn)) {
            return fn(appstate);
        }
        return fn;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
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
exports.asyncComponent = (name, importComponent) => {
    return class extends React.Component {
        constructor() {
            super(...arguments);
            this.state = {
                component: null,
                error: null
            };
        }
        componentDidMount() {
            importComponent()
                .then((vocab) => {
                // console.log(" asynchronous import done.", vocab);
                if (!vocab) {
                    const error = "Failed to process RTML";
                    this.setState({ error });
                    return;
                }
                const component = vocab.map(name);
                this.setState({ component });
            }).catch((error) => {
                this.setState({ error });
                console.error("*** FAILED****", error);
            });
        }
        render() {
            // console.log("rendering with props", this.props);
            const fn = this.state.component;
            const C = isMarked(fn) ? fn(this.props) : fn;
            return C ? React.createElement(C, Object.assign({}, this.props))
                :
                    React.createElement("div", null, this.state.error ? this.state.error.toString() : "Loading...");
        }
    };
};
const asyncElemMaker = (props) => {
    const { rtml, ctx, name } = props;
    if (!(rtml && ctx && ctx.vocab && name)) {
        return Promise.reject("Rtml: Invalid props");
    }
    // vocab is updated in place
    return parseF(rtml)
        .map((ast) => {
        try {
            // console.log("AST", ast);
            const afterParsing = exports.ast2Vocab2(ctx.vocab)(ast);
            // console.log("asyncElemMaker: after parsing, vocab is", afterParsing, ctx.vocab);
            return afterParsing;
        }
        catch (err2) {
            console.error("@@@##", err2);
            return null;
        }
    }) // parse
        .promise();
};
exports.Rtml = (props) => {
    const Component = exports.asyncComponent(props.name, () => asyncElemMaker(props));
    return React.createElement(Component, null);
};
//# sourceMappingURL=render.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:variable-name
// tslint:disable:no-any
const ramda_1 = require("ramda");
const React = require("react");
const contextual = require("react-contextual");
const Provider = contextual.Provider;
const subscribe = contextual.subscribe;
exports.contextualView = (component) => subscribe()(component);
exports.contextualWrapper = (View) => (state) => {
    console.log("Rendering wrapped element with props", state);
    return React.createElement(Provider, Object.assign({}, state),
        React.createElement(View, null));
};
exports.renderContextual = (appState) => (View) => (props) => React.createElement(Provider, Object.assign({}, appState),
    React.createElement(View, Object.assign({}, props)));
const propRe = /(\$[pg]):([a-zA-Z0-9_\.]+)/g;
const renderTextNode = (ctx, appState, state) => (text) => text.replace(propRe, (m, p1, p2) => defaultPropMapper(ctx, appState)(state)({ type: p1, id: p2 }));
exports.renderElem = (Elem, specNode, key, ctx, appState) => {
    const specProps = specNode.props || {};
    const mapper = defaultPropMapper(ctx, appState)(ctx.state);
    const textRenderer = renderTextNode(ctx, appState, ctx.state);
    const mappedProps = ramda_1.mapObjIndexed(mapper, specProps);
    const props = Object.assign({}, mappedProps);
    return (typeof Elem === "string") ? textRenderer(Elem) : (React.createElement(Elem, Object.assign({}, props, { key: key })));
};
const defaultPropMapper = (ctx, appState) => (state) => (propVal) => {
    const { vocab } = ctx;
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
            return vocab.map(propVal.id);
        case "$d":
            return vocab.map("domEvtHandle")(propVal.id);
        case "$p": // p = props
            const lens = ramda_1.lensPath(propVal.id.split("."));
            return ramda_1.view(lens, state);
        case "$g": // g = global state
            const glens = ramda_1.lensPath(propVal.id.split("."));
            return ramda_1.view(glens, appState || state || {});
        default: break;
    }
    return propVal;
};
// Name react element functions to help in debugging
function nameFunction(name, body) {
    return { [name](...args) { return body(...args); } }[name];
}
exports.makeVocab = (inVocab, ast) => {
    let vocab = inVocab;
    const renderNode = (specNode, inprops) => {
        const ctx = { vocab, state: inprops };
        const mapper = defaultPropMapper(ctx, inprops)(inprops);
        const textRenderer = renderTextNode(ctx, inprops, inprops);
        if (typeof specNode === "string") {
            const text = textRenderer(specNode);
            return text;
        }
        const specProps = specNode.props || {};
        const mappedProps = ramda_1.mapObjIndexed(mapper, specProps);
        const props = Object.assign({}, mappedProps, { key: inprops.key });
        if (!specNode.tag) {
            throw new Error(`Unknown tag: ${specNode.tag}`);
        }
        const Elem = vocab.map(specNode.tag) || specNode.tag || "***unknown***";
        if (Elem === "***unknown***") {
        }
        const children = (specNode.children || [])
            .filter((node) => (typeof node === "string" || node.tag))
            .map((node, key) => renderNode(node, Object.assign({}, mappedProps, { key })));
        console.log("rendering.. ", Elem, props, children);
        return React.createElement(Elem, Object.assign({}, props), children);
    };
    const makeElem = (compName, defNode) => (props) => {
        const renderElem = (node, key) => {
            return renderNode(node, Object.assign({}, props, { key }));
        };
        const children = defNode.map(renderElem);
        return React.createElement(React.Fragment, null, children);
    };
    vocab = Object.keys(ast)
        .reduce((updatedVocab, name) => {
        const defNode = ast[name];
        const elem = makeElem(name, defNode);
        const namedElem = nameFunction(name, elem);
        return updatedVocab.add(name, namedElem);
    }, inVocab);
    return vocab;
};
//# sourceMappingURL=rtml-render.js.map
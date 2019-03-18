// tslint:disable:variable-name
// tslint:disable:no-any
import * as React from 'react';
import { Vocab } from './vocabulary';

import { lensPath, view as lensView, } from "ramda";
import { mapObjIndexed, } from 'ramda';
const parseF = require('./parserV5').parseF;
const contextual = require("react-contextual");
const Provider: any = contextual.Provider;
const subscribe = contextual.subscribe;

export const contextualView = (component: any) => subscribe()(component);
export const contextualWrapper = (View: any) => (state: any) => {
    // console.log("Rendering wrapped element with props", state);
    return <Provider {...state}><View /></Provider>;
};

export const renderContextual = (appState: any) => (View: any) => (props: any) =>
    <Provider {...appState}>
        <View {...props} />
    </Provider>;


export type MyReactComponentType = (state: any) => JSX.Element;

const stringMapper = (appstate: any, state: any) =>
    (propVal: any): any => {
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
                const lens = lensPath(propVal.id.split("."));
                return lensView(lens, state);
            case "$g": // g = global state
                const glens = lensPath(propVal.id.split("."));
                return lensView(glens, appstate || {});
            default: break;
        }
        return propVal;
    };


const propRe = /(\$[pg]):([a-zA-Z0-9_\.]+)/g;
const Content = (text: string, key: number) =>
    (appstate: any): MyReactComponentType =>
        (state: any) => {
            const newText = text.replace(propRe,
                (_: string, p1: string, p2: string) =>
                    stringMapper(appstate, state)({ type: p1, id: p2 }));
            return <React.Fragment key={key}>{newText}</React.Fragment>;
        };

const propMapper = (vocab: Vocab) => (appstate: any) => (state: any) => (propVal: any): any => {
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
            return vocabLookupReactComp(vocab, propVal.id)(appstate);
        case "$d":
            return vocab.map("domEvtHandle")(propVal.id);
        case "$ps": // p = props
            const pslens = lensPath(propVal.id.split("."));
            return lensView(pslens, state) || lensView(pslens, state);
        case "$p": // p = props
            const lens = lensPath(propVal.id.split("."));
            return lensView(lens, state);
        case "$g": // g = global state
            const glens = lensPath(propVal.id.split("."));
            return lensView(glens, appstate || {});
        default: break;
    }
    return propVal;
};

const renderChildless = (props: any) => (Child: any, key: number) => {
    return React.createElement(Child, { ...props, key });
};

export const ast2Vocab = (ast: any, vocab: Vocab): Vocab => {
    const renderWithChildren = (def: any) => (appstate: any) => (props: any) => {
        const Elem: any = vocabLookupReactComp(vocab, def.tag)(appstate)
            || def.tag;
        const props2 = Object.create(props);
        const WithChildren: any = def2elemWithProps(Elem, def.children || [])(appstate);
        return renderChildless(props2)(WithChildren, 0);
    };
    const hasChildren = (def: any) => (def.children && def.children.length > 0);
    const objdef2elem = (def: any, key: number) => (appstate: any): MyReactComponentType => {
        const pMapper = propMapper(vocab)(appstate);
        const Elem: any = vocabLookupReactComp(vocab, def.tag)(appstate)
            || def.tag;
        const root = Object.create(appstate);
        const Elem2 = (state: any) => {
            const parentState = Object.create(root);
            const mapped = mapObjIndexed(pMapper(state), def.props);
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

    const def2elemWithProps = (Elem: any, elemList: any[]) => {
        if (!elemList) {
            throw new Error("Invalid AST node");
        }
        return (appstate: any) => {
            const renderChildren = (state: any) => (children: any[]) =>
                children
                    .map(makeChild(appstate))
                    .map(renderChildless(state));
            return (state: any) => React.createElement(Elem, state, renderChildren(state)(elemList));
        };
    };
    const def2elemNoProps = (Elem: any, elemList: any[]) => {
        if (!elemList) {
            throw new Error("Invalid AST node");
        }
        return (appstate: any) => {
            const renderChildren = (state: any) => (children: any[]) => {
                try {
                    const children2 = Array.isArray(children) ? children : [children];
                    return children2
                        .map(makeChild(appstate))
                        .map(renderChildless(state));
                } catch (err) {
                    throw err;
                }
            };
            const root = Object.create(appstate);
            return (state: any) => {
                const props = Object.create(root);
                Object.keys(state).forEach((name) => (props[name] = state[name]));
                return React.createElement(Elem, root, renderChildren(state)(elemList));
            };
        };
    };

    const makeChild = (appstate: any) => (child: any, key: number) =>
        (typeof child === "string")
            ?
            Content(child, key)(appstate)
            :
            objdef2elem(child, key)(appstate);
    const def2elem = (astNode: any[]) => def2elemNoProps(React.Fragment, astNode);
    const elems = mapObjIndexed(def2elem, ast);
    const withName = mapObjIndexed(nameFunction, elems);
    Object.keys(withName).forEach((name: string) =>
        addToVocab(vocab, name, elems[name]));

    return vocab;
};

export const ast2Vocab2 = (vocab: Vocab) => (ast: any): Vocab => ast2Vocab(ast, vocab);

export const addToVocab = (vocab: Vocab, name: string, twoStepComp: Function): Vocab => {
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
const markComponent = (fn: Function): Function => {
    (fn as any).vocab_function_type = TWO_STEP_REACT;
    return fn;
};


const isMarked = (fn: Function) => {
    // console.log("Checking if ", fn, " is a 2-step react component");
    return fn && (fn as any).vocab_function_type &&
        (fn as any).vocab_function_type === TWO_STEP_REACT;
};
// Lookup vocab, and if the looked up function is marked with TWO_STEP_REACT
// type then apply the appstate
export const vocabLookupReactComp = (vocab: Vocab, name: string) => (appstate: any) => {
    try {
        const fn = vocab.map(name);
        if (!fn) {
            return undefined;
        }
        if (isMarked(fn)) {
            return fn(appstate);
        }
        return fn;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Name react element functions to help in debugging
function nameFunction(body: Function, name: string) {
    return { [name](...args: any) { return body(...args); } }[name];
}

// Private, don't export this
const TWO_STEP_REACT = Symbol("react comp with appstate");


export const reactRenderer = (vocab: Vocab) => (state: any) => (tag: string) => {
    const Comp1 = vocabLookupReactComp(vocab, tag);
    const Comp = Comp1 && Comp1(state) as MyReactComponentType || tag;
    return React.createElement(Comp, state);
};


// Courtesy: https://medium.com/front-end-weekly/loading-components-asynchronously-in-react-app-with-an-hoc-61ca27c4fda7
export const asyncComponent = (name: string, importComponent: any) => {
    return class AsyncComponent extends React.Component {
        state = {
            component: null,
            error: null
        };

        componentDidMount() {
            importComponent()
                .then((vocab: any) => {
                    // console.log(" asynchronous import done.", vocab);
                    if (!vocab) {
                        const error = "Failed to process RTML";
                        this.setState({ error });
                        return;
                    }
                    const component = vocab.map(name);
                    this.setState({ component });
                }).catch((error: any) => {
                    this.setState({ error });
                    console.error("*** FAILED****", error);
                });
        }

        render() {
            // console.log("rendering with props", this.props);
            const fn: any = this.state.component;
            const C = isMarked(fn) ? fn(this.props) : fn;
            return C ? <C {...this.props} />
                :
                <div>{this.state.error ? (this.state.error as any).toString() : "Loading..."}</div>;
        }
    };
};

const asyncElemMaker = (props: any) => {
    const { rtml, ctx, name } = props;
    if (!(rtml && ctx && ctx.vocab && name)) {
        return Promise.reject("Rtml: Invalid props");
    }
    // vocab is updated in place
    return parseF(rtml)
        .map((ast: any) => {
            try {
                // console.log("AST", ast);
                const afterParsing = ast2Vocab2(ctx.vocab)(ast);
                // console.log("asyncElemMaker: after parsing, vocab is", afterParsing, ctx.vocab);
                return afterParsing;
            } catch (err2) {
                console.error("@@@##", err2);
                return null;
            }
        }) // parse
        .promise();
};

export const Rtml = (props: any) => {
    const Component = asyncComponent(props.name, () => asyncElemMaker(props));
    return <Component />;
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:variable-name
// tslint:disable:no-any
const React = require("react");
const ramda_1 = require("ramda");
const render_1 = require("./render");
/**
 * Example: <ArrayMapper over="a.b.c.arrayField" as="X" component="FoobarComponent" />
 *
 * Iterates over an array field at path a.b.c.arrayField and renders
 * FoobarComponent for each "X".
 * The FoobarComponent is supplied a new property named "X".
 */
exports.ArrayMapper = (vocab) => (appstate) => (props) => {
    const { over, as, component } = props;
    if (!(over && as && component)) {
        throw new Error(`Invalid props for "ArrayMapper" component: ` + JSON.stringify({ props, appstate }));
    }
    const mapped = over.map((item, i) => {
        const ChildTag = render_1.vocabLookupReactComp(vocab, component)(appstate);
        const childProps = Object.assign({}, ramda_1.omit(["over", "as", "component"], props), { key: i, [as]: item });
        return React.createElement(ChildTag, Object.assign({}, childProps));
    });
    return React.createElement(React.Fragment, null, mapped);
};
/**
 * Example:
 * <Conditional cond="a.b.c.boolField" true="FoobarComponent" false="BarBazComponent"/>
 */
exports.Conditional = (vocab) => (appstate) => (props) => {
    const { cond, } = props;
    // Components must be defined for both true and false cases
    if (!(props["true"] && props["false"])) {
        console.log(props);
        throw new Error("Invalid Conditional component (??)");
    }
    const TrueComp = render_1.vocabLookupReactComp(vocab, props["true"])(appstate);
    const FalseComp = render_1.vocabLookupReactComp(vocab, props["false"])(appstate);
    return (cond)
        ?
            (React.createElement(React.Fragment, null,
                React.createElement(TrueComp, Object.assign({}, props))))
        :
            (React.createElement(React.Fragment, null,
                React.createElement(FalseComp, Object.assign({}, props))));
};
//# sourceMappingURL=components.js.map
// tslint:disable:variable-name
// tslint:disable:no-any
import * as React from 'react';
import { omit } from "ramda";
import { vocabLookupReactComp } from "./render";
import { Vocab } from './vocabulary';

/**
 * Example: <ArrayMapper over="a.b.c.arrayField" as="X" component="FoobarComponent" />
 *
 * Iterates over an array field at path a.b.c.arrayField and renders
 * FoobarComponent for each "X".
 * The FoobarComponent is supplied a new property named "X".
 */
export const ArrayMapper = (vocab: Vocab) => (appstate: any) => (props: any) => {
    const { over, as, component } = props;
    if (!(over && as && component)) {
        throw new Error(`Invalid props for "ArrayMapper" component: ` + JSON.stringify({ props, appstate }));
    }

    const mapped = (over as any[]).map((item, i) => {
        const ChildTag: any = vocabLookupReactComp(vocab, component)(appstate);
        const childProps = {
            ...omit(["over", "as", "component"], props),
            key: i,
            [as]: item,
        };
        return <ChildTag {...childProps} />;
    });
    return <React.Fragment>{mapped}</React.Fragment>;
};

/**
 * Example:
 * <Conditional cond="a.b.c.boolField" true="FoobarComponent" false="BarBazComponent"/>
 */
export const Conditional = (vocab: Vocab) => (appstate: any) => (props: any) => {
    const { cond, } = props;
    // Components must be defined for both true and false cases
    if (!(props["true"] && props["false"])) {
        console.log(props);
        throw new Error("Invalid Conditional component (??)");
    }
    const TrueComp: any = vocabLookupReactComp(vocab, props["true"])(appstate);
    const FalseComp: any = vocabLookupReactComp(vocab, props["false"])(appstate);

    return (cond)
        ?
        (<React.Fragment><TrueComp {...props} /></React.Fragment >)
        :
        (<React.Fragment><FalseComp {...props} /></React.Fragment>);
};

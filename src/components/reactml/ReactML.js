import React from 'react';
import {
    __, defaultTo, path as pathGet,
    curry, mapObjIndexed,
} from 'ramda';
import mapValues from 'lodash/mapValues';
import dependencies from './dependencies';
import renderLib from './render';
import validate from '../../modules/reactml/validate';
import { normalizeNode } from '../../modules/reactml/normalize';

const renderer = curry(renderLib.render)(dependencies);

const { connect, withStyles } = dependencies;

const defaultToEmpty = defaultTo({})

const state2PropsMaker = (compName, props) => {

    const state2propsPath = ['spec', 'components', compName, 'state-to-props'];
    const stateNodeName = props.spec.state.stateNodeName;

    const oState2pathSpec = defaultToEmpty(
        pathGet(state2propsPath, props)
    );
    return (state) => {
        const imPathGet = (dotted) => {
            const propPath = [stateNodeName].concat(dotted.split('.'));
            const propVal = state.reactml.getIn(propPath);
            // console.log(propPath, propVal);
            return propVal;
        };
        const mapped = mapValues(oState2pathSpec, imPathGet);
        // console.log("mappedProps:", mapped);
        return mapped;
    };
};

const createTags = (spec, props) => {

    // translate name to a react component
    const name2func = (tag) => newTags[tag] || props.tagFactory[tag] || tag;

    const { stateNodeName, actionLib } = props;
    let comps = spec.components;
    const compName2Elem = (def, name, comps) => (props2) =>
        (<ReactMLElem
            {...props2}
            tagFactory={name2func}
            stateNodeName={stateNodeName}
            spec={spec}
            component={name}
            actionLib={actionLib}
        />);

    const newTags = mapObjIndexed(compName2Elem, comps);
    return name2func;
}

export const ReactMLElem = props => {
    const compName = props.component;
    const compDef = props.spec.components[compName];
    const root = compDef.view;

    const compProps = { root, ...props, };

    const mapStateToProps = state2PropsMaker(compName, props);
    const connector = connect(mapStateToProps, props.actionLib);
    const stylish = withStyles(defaultToEmpty(compDef.styles));
    return React.createElement(
        connector(stylish(renderer)),
        compProps
    );
}

export const ReactML = (props) => {
    const spec = normalizeNode(props.spec);
    const validationResults = validate(spec);
    if (validationResults.errors) {
        return <div>
            <h2> Invalid Spec </h2>
            <pre>
                {JSON.stringify(validationResults)};
                </pre>
        </div>;
    }

    // augment tag factory with components defined within the spec
    const tagFactory = createTags(spec, props);

    return <ReactMLElem
        {...props}
        spec={spec}
        tagFactory={tagFactory}
    />;
};


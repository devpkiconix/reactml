import React from 'react';
import {
    __, defaultTo, path as pathGet,
    curry,
} from 'ramda';
import mapValues from 'lodash/mapValues';
import dependencies from './dependencies';
import renderLib from './render';
import defaultTagFactory from './materialUiTagFactory';
import validate from '../../modules/reactml/validate';

const renderer = curry(renderLib.render)(dependencies);

const { connect, withStyles } = dependencies;

const defaultToEmpty = defaultTo({})

const state2PropsMaker = (compName, props) => {
    if (!props.spec) {
        debugger
    }
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

const createTags = (props) => {
    let spec = pathGet(['spec'], props);
    // augment tag factory with components defined within the spec
    let validationResults = validate(spec);
    if (validationResults.errors) {
        return <div>
            <h2> Invalid Spec </h2>
            <pre>
                {JSON.stringify(validationResults)};
                </pre>
        </div>;
    }
    let comps = pathGet(['spec', 'components'])(props);
    Object.keys(comps).forEach(name => {
        props.tagFactory[name] = (props2 = {}) => {
            return (<ReactML
                tagFactory={props.tagFactory}
                stateNodeName={props.stateNodeName}
                spec={spec}
                component={name}
                actionLib={props.actionLib}
                {...props2}
            />);
        }
    });
}

export const ReactML = (props) => {
    let spec = pathGet(['spec'], props);
    // augment tag factory with components defined within the spec
    if (!spec.created) {
        createTags(props);
        spec.created = true;
    }

    const stateNodeName = props.stateNodeName;
    const compName = props.component;
    const compDef = spec.components[compName];
    const styles = compDef.styles;
    const viewDef = compDef.view;

    const compProps = {
        tagFactory: props.tagFactory || defaultTagFactory,
        root: viewDef,
        stateNodeName,
        ...props,
    };

    const mapStateToProps = state2PropsMaker(compName, props);
    const connector = connect(mapStateToProps, props.actionLib);
    const stylish = withStyles(defaultToEmpty(styles));
    return React.createElement(
        connector(stylish(renderer)),
        compProps
    );
};


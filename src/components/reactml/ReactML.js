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
    const state2propsPath = ['spec', 'components', compName, 'state-to-props'];
    const stateNodeName = props.spec.state.stateNodeName;

    const oState2pathSpec = defaultToEmpty(
        pathGet(state2propsPath, props)
    );
    return (state) => {
        const imPathGet = (dotted) => {
            const propPath = [stateNodeName].concat(dotted.substr(1).split('.'));
            const propVal = state.reactml.getIn(propPath);
            return propVal;
        };
        const mapped = mapValues(oState2pathSpec, imPathGet);
        return mapped;
    };
};

export const ReactML = (props) => {
    const stateNodeName = props.stateNodeName;
    const compName = props.component;
    const stylesPath = ['spec', 'components', compName, 'styles'];
    const viewNodePath = ['spec', 'components', compName, 'view']
    const mapStateToProps = state2PropsMaker(compName, props);
    const actionExtractor = () => props.actionLib;
    const compProps = {
        tagFactory: props.tagFactory || defaultTagFactory,
        root: pathGet(viewNodePath, props),
        // ...mapStateToProps,
        stateNodeName,
    };
    let spec = pathGet(['spec'], props);
    let validationResults = validate(spec);
    if (validationResults.errors) {
        return <div>
            <h2> Invalid Spec </h2>
            <pre>
                {JSON.stringify(validationResults)};
            </pre>
        </div>;
    }
    return React.createElement(
        connect(mapStateToProps, actionExtractor())(
            withStyles(
                defaultToEmpty(
                    pathGet(stylesPath, props)
                ))(
                    renderer
                )
        ),
        compProps);
};


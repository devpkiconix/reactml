import React from 'react';
import {
    __, defaultTo, path as pathGet,
    curry,
} from 'ramda';
import mapValues from 'lodash/mapValues';
import dependencies from './dependencies';
import renderLib from './render';
import defaultTagFactory from './materialUiTagFactory';

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
        const imPathGet =
            (dotted) => state.reactml.getIn([stateNodeName].concat(dotted.split('.')));
        const mapped = mapValues(oState2pathSpec, imPathGet);
        // console.log(state.reactml.toJS(), "mapped", mapped);
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


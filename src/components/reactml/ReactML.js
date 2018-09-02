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

const state2PropsMaker = (pageName, props) => {
    const state2propsPath = ['spec', 'components', pageName, 'state-to-props'];
    const oState2pathSpec = defaultToEmpty(
        pathGet(state2propsPath, props)
    );
    return (state) => {
        const imPathGet =
            (dotted) => state.reactml.getIn([props.stateNodeName].concat(dotted.split('.')));
        return mapValues(oState2pathSpec, imPathGet);
    };
};

export const ReactML = (props) => {
    const stateNodeName = props.stateNodeName;
    const pageName = props.page;
    const stylesPath = ['spec', 'components', pageName, 'styles'];
    const viewNodePath = ['spec', 'components', pageName, 'view']
    const mapStateToProps2 = state2PropsMaker(pageName, props);
    const actionExtractor = () => props.actionLib;
    const compProps = {
        tagFactory: props.tagFactory || defaultTagFactory,
        root: pathGet(viewNodePath, props),
        ...mapStateToProps2,
        stateNodeName,
    };
    return React.createElement(
        connect(mapStateToProps2, actionExtractor())(
            withStyles(
                defaultToEmpty(
                    pathGet(stylesPath, props)
                ))(
                    renderer
                )
        ),
        compProps);
};


import React from 'react';
import {
    __, curry, path as pathGet, map as RMap, pipe,
} from 'ramda';
import { isString } from 'ramda-adjunct';

import { fromYaml } from '../../modules/reactml/util';
import { normalizeNode } from '../../modules/reactml/normalize';

const mapPropName2Value = curry((tagGetter, rootProps, dottedName) => {
    // console.log(`interpreting prop name: [${dottedName}]`);
    let value = dottedName; // default
    if (isString(dottedName) && dottedName.startsWith('...')) {
        // triple tag is a react component
        value = tagGetter({ tag: dottedName.substr(3) });
    } else if (isString(dottedName) && dottedName.startsWith('..')) {
        // Double dot is a function
        value = rootProps[dottedName.substr(2)];
    } else if (isString(dottedName) && dottedName[0] == '.') {
        // single dot is a prop
        value = pathGet(dottedName.substr(1).split('.'), rootProps);
    }
    return value;
});

// Given a reactml node, determine the react
// class/function (i.e. JSX tag)
const mapNode2Tag = curry((tagFactory, node) => {
    // console.log("node", node)
    if (isString(node)) {
        return node;
    }
    if (!node.tag) {
        throw new Error("Invalid configuration. Specify a tag name")
    }
    return tagFactory[node.tag] || node.tag;
});

const maybeParse = (data) => (isString(data)) ? fromYaml(data) : data;

const _mapPropsTree = (propGetter, tagGetter, node) => {
    const mappedProps = RMap(propGetter, node.props || {})
    return {
        ...node,
        props: mappedProps,
        content: node.content ? propGetter(node.content) : null,
        children: node.children.map(child => _mapPropsTree(propGetter, tagGetter, child))
    };
};
const mapPropsTree = curry(_mapPropsTree);

const ReactMLNode = ({ key, tagGetter, node }) => {
    const
        tag = tagGetter(node),
        children = node.content ? [node.content] :
            node.children.map((childNode, key) =>
                isString(childNode) ? childNode :
                    ReactMLNode({ key, tagGetter, node: childNode }));
    // console.log(`creating ${node.tag}`);
    return React.createElement(tag, { key, ...node.props }, children.length ? children : null);
};

const render = (_deps) => (rootProps) => {
    const
        { tagFactory, root } = rootProps,
        tagGetter = mapNode2Tag(tagFactory),
        propGetter = mapPropName2Value(tagGetter, rootProps),
        propMapper = mapPropsTree(propGetter, tagGetter),
        convertToReact = (node) =>
            <ReactMLNode tagGetter={tagGetter} node={node} />,

        pipeline = pipe(
            maybeParse,
            normalizeNode,
            propMapper,
            convertToReact
        );

    return pipeline(root);
}

export default { render };

// Exported functions for reuse and/or testing
export let functions = {
    maybeParse, mapNode2Tag, mapPropName2Value,
};

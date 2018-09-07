import React from 'react';
import {
    __, curry, path as pathGet, map as RMap, omit, keys
} from 'ramda';
import { isString } from 'ramda-adjunct';

import { fromYaml } from './util';

const isLeaf = (node) =>
    !!(node.content || (node.children && node.children.length == 0));

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

const sansProps = omit(['props', 'tag', 'content']);
const node2children = (node) => node.content ? null : node.children;

const traverse = (basicRender, tagGetter, propGetter) => {
    const nodeProcessor = (node, key) => {
        // console.log('node:', node.id, node)
        let mappedChildren = null;
        if (isLeaf(node)) {
            if (node.content) {
                mappedChildren = [propGetter(node.content)]
            } else {
                // do nothing
            }
        } else {
            let children = node2children(node)
            mappedChildren = children ? children.map(nodeProcessor) : null;
        }
        let mappedProps = RMap(propGetter, node.props || {});
        mappedProps.key = key;
        let rendered = basicRender(tagGetter, mappedProps, mappedChildren, node);
        return rendered;
    };
    return nodeProcessor;
}


export const renderTree = (propGetter, tagFactory) => (tree) => {
    const tagGetter = mapNode2Tag(tagFactory);
    return traverse(basicRenderReact, tagGetter, propGetter)(tree);
}

const codegenTree = (propGetter, _) => (tree) => {
    const tagGetter = (node) => node.tag;

    return traverse(basicRenderCodegen, tagGetter, propGetter)(tree);
}


const basicRenderReact = (tagGetter, mappedProps, mappedChildren, node) => {
    // console.log("basicRenderReact", mappedProps)

    return React.createElement(
        tagGetter(node), mappedProps, mappedChildren
    );
};

const basicRenderCodegen = (tagGetter, mappedProps, mappedChildren, node) => {
    let tag = tagGetter(node);
    return `
<${tag} ${propsStr}>
${childrenStr}
</${tag}>
    `;
}

// Exported functions for reuse and/or testing
export default {
    isLeaf,
    maybeParse, mapNode2Tag, mapPropName2Value, traverse,
    renderTree, codegenTree, node2children,
};


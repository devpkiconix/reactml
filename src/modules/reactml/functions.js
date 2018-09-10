import React from 'react';
import {
    __, curry, path as pathGet, map as RMap, omit, keys
} from 'ramda';
import { isString, isObject } from 'ramda-adjunct';

import { normalizeNode } from './normalize';

import { fromYaml } from './util';

const isLeaf = (node) => {
    // const res = isString(node) || !node.children ||
    //     (node.children && node.children.length == 0);
    const res = !isObject(node);
    // console.log("isLeaf? ", node, res);
    return res;
}
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
const node2children = (node) => {
    let children = node.content ? [node.content] : node.children;
    // console.log("Children for", node, 'are ', children);
    return children;
}

const traverse = (basicRender, tagGetter, propGetter) => {
    const nodeProcessor = (node, key = 0) => {
        // console.log('nodeProcessor:', node, key)
        let
            children = null,
            mappedChildren = null,
            mappedProps = null;
        if (isLeaf(node)) {
            children = [];
            mappedProps = null;
        } else {
            let children = node2children(node);
            mappedChildren = children ? children.map(nodeProcessor) : null;
            mappedProps = RMap(propGetter, node.props || {});
            mappedProps.key = key;
        }
        let rendered = basicRender(
            tagGetter, propGetter,
            mappedProps, mappedChildren, node);
        return rendered;
    };
    return nodeProcessor;
}


export const renderTree = (propGetter, tagFactory) => {
    const tagGetter = mapNode2Tag(tagFactory);
    const treeWalker = traverse(basicRenderReact, tagGetter, propGetter);
    return (tree) => treeWalker(tree, 0);
}

const codegenTree = (propGetter, _) => (tree) => {
    const tagGetter = (node) => node.tag;

    return traverse(basicRenderCodegen, tagGetter, propGetter)(tree);
}


const basicRenderReact = (tagGetter, propGetter, mappedProps, mappedChildren, node) => {
    if (isString(node)) {
        return propGetter(node);
    }
    return React.createElement(
        tagGetter(node), mappedProps, mappedChildren
    );
};

const basicRenderCodegen = (tagGetter, propGetter, mappedProps, mappedChildren, node) => {
    let tag = tagGetter(node);
    if (isString(node)) {
        return propGetter(node);
    }
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
    renderTree, codegenTree, node2children, normalizeNode,
};


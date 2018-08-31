import React from 'react';
import {
    __, path as pathGet, keys, omit, map as RMap
} from 'ramda';
import { isString } from 'ramda-adjunct';
const sansProps = omit(['props', 'tag', 'content']);

const mapPropName2Value = rootProps => dottedName => {
    // Double dot is a function
    if (isString(dottedName) && dottedName.startsWith('..')) {
        let fn = rootProps[dottedName.substr(2)];
        return fn;
    }

    // single dot is a prop
    if (isString(dottedName) && dottedName[0] == '.') {
        return pathGet(dottedName.substr(1).split('.'), rootProps);
    }
    return dottedName;
};

// Given a reactml node, determine the react
// class/function (i.e. JSX tag)
const mapNode2Tag = tagFactory => node => {
    let tag;
    if (isString(node)) {
        tag = node;
    } else {
        if (!node.tag) {
            throw new Error("Invalid configuration. Specify a tag name")
        }
        tag = tagFactory[node.tag] || node.tag;
    }
    return tag;
}

const renderChildren = (nodeRenderer) => (parentNode) => {
    let childNodes = parentNode.children;
    if (!childNodes) {
        childNodes = [];
        if (keys(sansProps(parentNode)).length == 1) {
            let tag = keys(sansProps(parentNode))[0];
            let childNode = sansProps(parentNode)[tag]
            childNodes = [{
                tag,
                ...childNode,
            }];
        }
    }
    return childNodes.map(nodeRenderer);
};

const renderNode = (rootProps, tagFactory, nodeRenderer = null) => {
    const dottedName2Value = mapPropName2Value(rootProps);
    const node2tag = mapNode2Tag(tagFactory);

    // HACK - revisit nad cleanup
    if (!nodeRenderer) {
        nodeRenderer = (node, key) => {
            if (typeof node === 'string') {
                return node;
            }
            const nProps = RMap(dottedName2Value, node.props || {});
            let elemChildren = null;
            if (node.content) {
                elemChildren = [dottedName2Value(node.content)];
            } else {
                const childRenderer = renderChildren(nodeRenderer);
                elemChildren = childRenderer(node);
            }
            return React.createElement(
                node2tag(node),
                { key, ...nProps || {} },
                elemChildren);
        };
    }
    return nodeRenderer;
};

const render = (_deps) => (rootProps) => {
    const { tagFactory, root } = rootProps;
    const nodeRenderer = renderNode(rootProps, tagFactory);
    return nodeRenderer(root);
};

export default { render };

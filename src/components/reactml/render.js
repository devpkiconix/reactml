import React from 'react';
import {
    __, curry, path as pathGet, keys, omit, map as RMap
} from 'ramda';
import { isString } from 'ramda-adjunct';
const sansProps = omit(['props', 'tag', 'content']);

const _mapPropName2Value = (rootProps, dottedName) => {
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
const mapPropName2Value = curry(_mapPropName2Value);

// Given a reactml node, determine the react
// class/function (i.e. JSX tag)
const _mapNode2Tag = (tagFactory, node) => {
    if (isString(node)) {
        return node;
    }
    if (!node.tag) {
        throw new Error("Invalid configuration. Specify a tag name")
    }
    return tagFactory[node.tag] || node.tag;
};
const mapNode2Tag = curry(_mapNode2Tag);

const getChildNodes = (parentNode) => {
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
    return childNodes;
}

const renderRoot = (propGetter, tagGetter) => {
    const renderer = (node, key) => {
        if (isString(node)) {
            return node;
        }
        const
            mappedProps = RMap(propGetter, node.props || {}),
            tag = tagGetter(node),
            props = { key, ...mappedProps || {} },
            elemChildren = node.content ?
                [propGetter(node.content)]
                :
                getChildNodes(node).map(renderer);

        return React.createElement(tag, props, elemChildren);
    };
    return renderer;
};

const render = (_deps) => (rootProps) => {
    const
        { tagFactory, root } = rootProps,
        propGetter = mapPropName2Value(rootProps),
        tagGetter = mapNode2Tag(tagFactory),
        renderNode = renderRoot(propGetter, tagGetter);
    return renderNode(root, 0);
};

export default { render };

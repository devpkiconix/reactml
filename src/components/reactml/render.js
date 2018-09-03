import React from 'react';
import {
    __, curry, path as pathGet, keys, omit, map as RMap, pipe, pick,
} from 'ramda';
import { isString } from 'ramda-adjunct';

import { fromYaml } from '../../modules/reactml/util';

const sansProps = omit(['props', 'tag', 'content']);

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

const isLeaf = (node) => {
    switch (node.tag) {
        case 'input':
        case 'textarea':
            return true;
        default:
            break;
    }
    return false;
}

const normalizeTree = (node) => {
    let childNodes = node.children;
    if (!childNodes) {
        childNodes = [];
        if (keys(sansProps(node)).length == 1) {
            let tag = keys(sansProps(node))[0];
            let childNode = sansProps(node)[tag]
            node = omit([tag], node);
            childNodes = [{ tag, ...childNode, }];
        }
    }
    let children = childNodes.map(normalizeTree);
    return { ...node, children };
};

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

const ReactMLNode = ({ tagGetter, node }) => {
    // if (node && node.tag && node.tag == 'Route') {
    //     debugger
    // }
    const
        tag = tagGetter(node),
        children = node.content ? [node.content] :
            node.children.map((childNode, childKey) =>
                isString(childNode) ? childNode :
                    ReactMLNode({ tagGetter, node: childNode }));
    // <ReactMLNode key={childKey} node={childNode}
    //     tagGetter={tagGetter} />);
    console.log(`creating ${node.tag}`);
    return React.createElement(tag, node.props, children.length ? children : null);
};

const render = (_deps) => (rootProps) => {
    const
        { tagFactory, root, stateNodeName } = rootProps,
        tagGetter = mapNode2Tag(tagFactory),
        propGetter = mapPropName2Value(tagGetter, rootProps),
        propMapper = mapPropsTree(propGetter, tagGetter),
        convertToReact = (node) =>
            <ReactMLNode tagGetter={tagGetter} node={node} />,

        pipeline = pipe(
            maybeParse,
            normalizeTree,
            propMapper,
            convertToReact
        );

    return pipeline(root)
}

export default { render };

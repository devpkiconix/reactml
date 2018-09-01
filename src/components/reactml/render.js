import React from 'react';
import {
    __, curry, path as pathGet, keys, omit, map as RMap, pipe, pick,
} from 'ramda';
import { isString } from 'ramda-adjunct';

import { fromYaml } from '../../modules/reactml/util';

const sansProps = omit(['props', 'tag', 'content']);

const mapPropName2Value = curry((rootProps, dottedName) => {
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
});

// Given a reactml node, determine the react
// class/function (i.e. JSX tag)
const mapNode2Tag = curry((tagFactory, node) => {
    console.log("node", node)
    if (isString(node)) {
        return node;
    }
    if (!node.tag) {
        throw new Error("Invalid configuration. Specify a tag name")
    }
    return tagFactory[node.tag] || node.tag;
});

const maybeParse = (data) => (isString(data)) ? fromYaml(data) : data;

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
    return { ...node, children: childNodes.map(normalizeTree) };
};

const _mapPropsTree = (propGetter, node) => {
    const mappedProps = RMap(propGetter, node.props || {})
    return {
        ...node,
        props: mappedProps,
        children: node.children.map(child => _mapPropsTree(propGetter, child))
    };
};
const mapPropsTree = curry(_mapPropsTree);

const ReactMLNode = ({ tagGetter, node }) => {
    const
        tag = tagGetter(node),
        children = node.content ? [node.content] :
            node.children.map((childNode, childKey) =>
                isString(childNode) ? childNode :
                    <ReactMLNode key={childKey} node={childNode}
                        tagGetter={tagGetter} />);
    return React.createElement(tag, node.props, children);
};

const render = (_deps) => (rootProps) => {
    const
        { tagFactory, root } = rootProps,
        propGetter = mapPropName2Value(rootProps),
        tagGetter = mapNode2Tag(tagFactory),
        propMapper = mapPropsTree(propGetter),
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

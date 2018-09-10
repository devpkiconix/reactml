const R = require('ramda');
const BEGIN = R.identity;
export const componentsLens = R.lensProp('components');
const viewLens = R.lensProp('view');
const childrenLens = R.lensProp('children');
const sansProps = R.omit(['props', 'tag', 'content']);

export const normalizeNode = (node) => {
    if (node.content) {
        // ignore child nodes
        return R.set(childrenLens, [], node);
    }
    let childNodes = node.children;
    if (!childNodes) {
        childNodes = [];
        if (R.keys(sansProps(node)).length == 1) {
            let tag = R.keys(sansProps(node))[0];
            let childNode = node[tag];
            childNodes = [{ tag, ...childNode, }];
            node = R.omit([tag], node);
        }
    }
    return R.set(childrenLens, childNodes.map(normalizeNode), node);
};

export const normalizeComp = (comp) =>
    R.set(viewLens, normalizeNode(comp.view), comp);

const normalizeCompArr = R.compose(
    R.map(normalizeComp),
    R.prop('components'),
    BEGIN,
);

export const normalizeChildren = (spec) =>
    R.set(componentsLens, normalizeCompArr(spec), spec);

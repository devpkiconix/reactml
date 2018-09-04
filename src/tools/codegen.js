import { readFileSync, writeFileSync } from 'fs';
import yamlLib from 'js-yaml';
import { isString } from 'ramda-adjunct';
const R = require('ramda');
const prettier = require("prettier");

const stdTags = [
    'h1', 'h2', 'h3', 'h4',
    'input', 'select', 'option', 'textarea', 'label',
    'div', 'span', 'p', 'pre', 'em', 'u', 'ul', 'ol', 'li'
];

const BEGIN = R.identity, END = R.identity;
const dbgDump = console.log;
const prettify = (code) =>
    prettier.format(code, { semi: true, parser: "babylon" });

const componentsLens = R.lensProp('components');
const viewLens = R.lensProp('view');
const childrenLens = R.lensProp('children');

const readFile = (fn) => readFileSync(fileName);
const parse = (x) => yamlLib.safeLoad(x);
const toString = (x) => yamlLib.safeDump(x, 2);

const sansProps = R.omit(['props', 'tag', 'content']);

const normalizeNode = (node) => {
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

const normalizeComp = (comp) => R.set(viewLens, normalizeNode(comp.view), comp);

const normalizeCompArr = R.compose(
    R.map(normalizeComp),
    R.prop('components'),
    BEGIN,
);

const normalizeChildren = (spec) =>
    R.set(componentsLens, normalizeCompArr(spec), spec);

const genTail = (x) => x;
const genHeader = (x) => x;

const reactifyProps = props =>
    Object.keys(props).reduce((code, key) => {
        let value = props[key];
        if (isString(value)) {
            if (value.startsWith('...')) {
                value = value.substr(3);
            } else if (value.startsWith('.')) {
                value = value.replace(/^\.*(.*)$/g, `props.$1`);
            } else {
                value = JSON.stringify(value, null, 2);
            }
        } else {
            value = JSON.stringify(value, null, 2);
        }
        return `${code}
        ${key}={${value}}`
    }, '');

const genNode = (node) => {
    let props = reactifyProps(node.props || {}).trim();
    if (props.length) {
        props = ' ' + props;
    }
    let head = `<${node.tag}${props}>`;
    let body;
    if (node.content) {
        if (node.content.startsWith('.')) {
            body = node.content.replace(/^\.*(.*)$/g, `{props.$1}`);
        } else {
            body = node.content;
        }
    } else {
        body = renderChildren(node) || '';
    }
    let tail = `</${node.tag}>`;
    return `${head.trim()}
${body.trim()}
${tail.trim()}
`
};

const renderChildren = (node) => {
    if (!node.children) {
        return [''];
    }
    return node.children.map(genNode).join('\n');
}

const reduce2TagList = (node, list = {}) => {
    return node.children.reduce((list, child) => {
        list[child.tag] = child.tag;
        return reduce2TagList(child, list);
    }, list)
};

const reduceState2Props = (s2p) =>
    Object.keys(s2p).reduce((code, key) =>
        code + `${key}: compState.getIn(${JSON.stringify(s2p[key].split('.'))}),`
        , '');


const genComp = (comp, compName) => {
    let childrenCode = renderChildren(comp.view);
    let tagList = reduce2TagList(comp.view);
    let tagNames = R.keys(R.omit(stdTags, tagList)).join(',');
    let tagImport = tagNames.length ?
        `
import TagFactory from './tag-factory';
const { ${tagNames} } = TagFactory;
        ` : '';
    let mapStateToProps = `{}`;
    if (comp['state-to-props']) {
        mapStateToProps = `{${reduceState2Props(comp['state-to-props'])}}`
    }

    let code = `
// Code generated by reactml
import React from 'react';
import connect from 'react-redux';

import lib from './lib';

${tagImport.trim()}

const ${compName} = (props) => {
    return <React.Fragment>
    ${childrenCode}
    </React.Fragment>;
};

const mapStateToProps = ({reactml}) => {
    let compState = reactml.get(stateNodeName);
return ${ mapStateToProps};
};

const mapDispatchToActions = {
// TODO
};

export default connect(mapStateToProps, mapDispatchToActions)(${compName});
`;
    writeFileSync(`src/tools/gen/${compName}.js`, prettify(code));
    return code;
}

const generateComps = R.compose(
    (arr) => arr.join('\n'),
    R.values,
    R.mapObjIndexed(genComp),
    R.view(componentsLens),
    // dbgDump,
    BEGIN);

const generator = R.compose(
    genTail,
    generateComps,
    genHeader,
    BEGIN
);


const processor = R.compose(
    // dbgDump,
    generator,
    // toString,
    normalizeChildren,
    parse,
    readFile,
    BEGIN
);


const fileName = "src/tools/test.yml";
processor(fileName);
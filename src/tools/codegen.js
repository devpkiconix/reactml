import { readFileSync, writeFileSync } from 'fs';
import yamlLib from 'js-yaml';
import { isString } from 'ramda-adjunct';
const R = require('ramda');
const prettier = require("prettier");
const htmlTags = require('html-tags');
const voidHtmlTags = require('html-tags/void');
const ejs = require("ejs");

const TEMPLATE_DIR = `src/templates`;
const GEN_DIR = `src/tools/gen`;
const VIEW_TEMPLATE_FILENAME = `${TEMPLATE_DIR}/view.jsx.ejs`;

const stdTags = [...htmlTags, ...voidHtmlTags];

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
        body = genChildren(node) || '';
    }
    let tail = `</${node.tag}>`;
    return `${head.trim()}
${body.trim()}
${tail.trim()}
`
};

const genChildren = (node) => {
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

const findActions = (node) => {
    const myList = Object.keys(node.props || {})
        .map(k => node.props[k])
        .filter(isString)
        .filter(name => name.startsWith('..'))
        .map(name => name.substr(2));
    // console.log('myList', myList);
    // console.log((node.children || []).map(child => child.props));
    const childLists =
        (node.children || []).map(child => findActions(child));
    // console.log('child lists:', R.flatten(childLists));
    return myList.concat(R.flatten(childLists));
};

const genTagImport = (comp) =>
    new Promise((resolve, reject) => {
        let tagList = reduce2TagList(comp.view);
        let tagNames = R.keys(R.omit(stdTags, tagList)).join(',');
        resolve(tagNames.length ?
            `
import TagFactory from './tag-factory';
const { ${tagNames} } = TagFactory;
        ` : '');
    });

const ejsGen = (fileName, context) => new Promise((resolve, reject) => {
    ejs.renderFile(fileName, context, (err, output) => {
        if (err) {
            reject(err);
        } else {
            resolve(output);
        }
    })
});

const genComp = (comp, compName) => {
    let reactComponentBody = genNode(comp.view);
    let mapStateToProps = `{}`;
    if (comp['state-to-props']) {
        mapStateToProps = `{${reduceState2Props(comp['state-to-props'])}}`
    }
    const actionArr = findActions(comp.view);
    let mapActionsToProps = 'null';
    if (actionArr.length) {
        mapActionsToProps = `{
                ${actionArr.map(action => `${action}: lib.${action}`).join(',')}
                }`;
    }
    return genTagImport(comp).then(tagImport => {
        const context = {
            tagImport, compName, reactComponentBody, mapStateToProps, mapActionsToProps,
        };
        return ejsGen(VIEW_TEMPLATE_FILENAME, context)
            .then(code => prettify(code))
            .then(code => writeFileSync(`${GEN_DIR}/${compName}.jsx`, code));
    });
}

const generateComps = R.compose(
    (proms) => Promise.all(proms),
    R.values,
    R.mapObjIndexed(genComp),
    R.view(componentsLens),
    // dbgDump,
    BEGIN);

const generator = R.compose(
    genTail,
    generateComps,
    genHeader,
    BEGIN);


const processor = R.compose(
    // dbgDump,
    generator,
    // toString,
    normalizeChildren,
    parse,
    readFile,
    BEGIN);


const fileName = "src/tools/test.yml";
processor(fileName);

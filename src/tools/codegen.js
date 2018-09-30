import { readFileSync, writeFileSync, watchFile } from 'fs';
import yamlLib from 'js-yaml';
import { isString } from 'ramda-adjunct';
const R = require('ramda');
import prettier from 'prettier';
const htmlTags = require('html-tags');
const voidHtmlTags = require('html-tags/void');
const ejs = require("ejs");

import functions from '../modules/reactml/functions';
import { normalizeChildren } from '../modules/reactml/normalize';

const { traverse } = functions;

const TEMPLATE_DIR = process.env.TEMPLATE_DIR || `node_modules/reactml/templates`;
const VIEW_TEMPLATE_FILENAME = `${TEMPLATE_DIR}/view.jsx.ejs`;

const stdTags = [...htmlTags, ...voidHtmlTags];

const BEGIN = R.identity, END = R.identity;
const dbgDump = console.log;
const prettify = (code) =>
    prettier.format(code, { semi: true, parser: "babylon" });

const componentsLens = R.lensProp('components');

const readFile = (fn) => readFileSync(fn);
const parseYaml = (x) => yamlLib.safeLoad(x);
const parseJson = (x) => JSON.parse(x);
const toString = (x) => yamlLib.safeDump(x, 2);

const genTail = (x) => x;
const genHeader = (x) => x;

const TRIPLE_DOT = '...';

const write = (fileName) => (content) => writeFileSync(fileName, content);

const prettyWrite = (writer) => R.compose(writer, prettify);

const reduce2TagList = (node, list = {}) => {
        const tagsInProps = R.keys((node.props||{})).forEach(name => {
            const val = node.props[name];
            if(isString(val) && val.startsWith(TRIPLE_DOT)) {
                const tag = val.replace(TRIPLE_DOT,'');
                list[tag] = tag;
            }
        });
        return node.children.reduce((list, child) => {
        list[child.tag] = child.tag;

        return reduce2TagList(child, list);
    }, list)
};

const reduceState2Props = (s2p) =>
    Object.keys(s2p).sort().reduce((code, key) =>
        code + `${key}: compState.getIn(${JSON.stringify(s2p[key].split('.'))}),`
        , '');


const defaultToEmptyObj = R.defaultTo({});
const defaultToEmptyArr = R.defaultTo([]);

const node2ActionProps = R.compose(
    R.map(name => name.substr(2)),
    R.filter(name =>
        name.startsWith('..') && !name.startsWith(TRIPLE_DOT)),
    R.filter(isString), // keep strings only
    R.values, // values from object
    defaultToEmptyObj(R.prop('props')), // node.props || {}
    BEGIN
);

const findChildActions = R.compose(
    R.flatten,
    R.map(child => findActions(child)),
    defaultToEmptyArr(R.prop('children')), // node.children || []
    BEGIN
);

const arrOfOne = R.repeat(R.__, 1);

// Returns actions in a node
const findActions = R.compose(
    R.flatten,
    R.ap([node2ActionProps, findChildActions]),
    arrOfOne, // array to use for operating with 'ap'
    BEGIN
);

// Extracts tags used in the component
const comp2tags = R.compose(
    R.keys,
    R.omit(stdTags),
    reduce2TagList,
    R.prop('view'),
    BEGIN);

const sort = R.sort((a, b) => (a > b));

const comp2foreignTags = (oComps) => R.compose(
    R.join(','),
    sort,
    R.filter(x => !oComps[x]),
    comp2tags,
    BEGIN);

const comp2localTagCode = (oComps) => R.compose(
    R.join('\n'),
    R.map(tag => `import ${tag} from './${tag}';`),
    sort,
    R.filter(x => !!oComps[x]),
    comp2tags,
    BEGIN);

const genTagImport = (comp, compName, oComps) =>
    new Promise((resolve, reject) => {

        const foreignTags = comp2foreignTags(oComps)(comp);
        const foreignTagCode = foreignTags.length ? `
import TagFactory from '../tag-factory';
const { ${foreignTags} } = TagFactory;
        ` : '';

        const localTagCode = comp2localTagCode(oComps)(comp);
        resolve(foreignTagCode + '\n' + localTagCode);
    });

const ejsGen = fileName => context => new Promise((resolve, reject) =>
    ejs.renderFile(fileName, context, (err, output) =>
        (err) ? reject(err) : resolve(output)));


const codegenTree = (propGetter, _) => (tree) => {
    const tagGetter = (node) => node.tag;
    return traverse(basicRenderCodegen, tagGetter, propGetter)(tree);
}

const removeCond = R.omit(['$when']);

// mappedChildren is children already rendered
const basicRenderCodegen = (tagGetter, propGetter, mappedProps, mappedChildren, node) => {
    if (isString(node)) {
        return propGetter(node);
    }
    let tag = tagGetter(node);
    let sprops = '';
    if (mappedProps) {
        sprops = R.mapObjIndexed((v, k) => k == 'key' ? '' : `${k}=${v}`, removeCond(mappedProps))
        sprops = R.values(sprops).join(' ');
    }
    let schildren = (mappedChildren || []).join('\n');

    const mainCode = `<${tag} ${sprops}>
${schildren}
</${tag}>`;

    if (mappedProps.$when ) {
        const $when = node.props.$when;
        const cond = `(${node.props.$when})`;
        const conditionalCode = `{${cond} ? (${mainCode}) : ''}`;
        return conditionalCode;
    }

    return mainCode;
}

const reactViewCodegen = ejsGen(VIEW_TEMPLATE_FILENAME);

const genComp = (writer) => (comp, compName, oComps) => {
    const propGetter = (val) => {
        if (isString(val)) {
            if (val.startsWith(TRIPLE_DOT)) {
                val = val.replace(/^\.\.\./, '');
                if (!oComps[val]) {
                    val = 'TagFactory.' + val;
                }
            } else if (val.startsWith('.')) {
                val = val
                    .replace(/^\.\.\./, 'TagFactory.')
                    .replace(/^\.\./, 'props.')
                    .replace(/^\./, 'props.');
            } else {
                val = JSON.stringify(val);
            }
        } else {
            val = JSON.stringify(val);
        }
        return `{${val}}`;
    };
    let reactComponentBody = codegenTree(propGetter)(comp.view);
    let mapStateToProps = null;
    let mapStateToPropsList = '';
    if (comp['state-to-props']) {
         mapStateToPropsList = `${reduceState2Props(comp['state-to-props'])}`;
    }
    if (mapStateToPropsList.length) {
        mapStateToProps = `{${mapStateToPropsList}}`;
    }

    const actionArr = findActions(comp.view).sort();
    let mapActionsToProps = 'null';
    if (actionArr.length) {
        mapActionsToProps = `{
                ${actionArr.map(action => `${action}: lib.${action}`).join(',')}
                }`;
    }
    return genTagImport(comp, compName, oComps).then(tagImport => {
        const context = {
            tagImport, compName, reactComponentBody,
            mapStateToProps, mapActionsToProps,
        };
        return reactViewCodegen(context)
            .then(prettyWrite(writer(context.compName)));
    });
};


const generateComps = (writer) => R.compose(
    (proms) => Promise.all(proms),
    R.values,
    R.mapObjIndexed(genComp(writer)),
    R.view(componentsLens),
    // dbgDump,
    BEGIN);

const generator = (writer) => R.compose(
    genTail,
    generateComps(writer),
    genHeader,
    BEGIN);

const processParsed = (writer) => R.compose(
    generator(writer),
    normalizeChildren,
    BEGIN);

const processor = (parse, writer) => R.compose(
    processParsed(writer),
    parse,
    readFile,
    BEGIN);

const writeComponent = outputDir => compName =>
    write(`${outputDir}/${compName}.jsx`);

export
const codegenYaml = (srcFileName, outputDir = "./gen") =>
    processor(parseYaml, writeComponent(outputDir))(srcFileName);

export
const codegenJson = (srcFileName, outputDir = "./gen") =>
    processor(parseJson, writeComponent(outputDir))(srcFileName);

export
const codegenJs = (spec, outputDir = "./gen") =>
    processParsed(writeComponent(outputDir))(spec);

export
const codegenJsWebbpack = function(yaml) {
    const writer = (compName) => (content) => {
        this.emitFile(`${compName}.jsx`, content);
    };
    processParsed(writer)(spec);
    return;
}

export const codegenYamlWatch = (srcFileName, outputDir = "./gen") =>
    watchFile(srcFileName, () => {
        console.log(`${srcFileName} changed`);
        processor(parseYaml, writeComponent(outputDir))(srcFileName);
    });


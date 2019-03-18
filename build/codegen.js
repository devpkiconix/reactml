"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const htmlTags = require("html-tags");
const voidHtmlTags = require("html-tags/void");
const parserV5_1 = require("./parserV5");
const ramda_1 = require("ramda");
// const parseF: Function = parser.parseF;
exports.stdTags = [...htmlTags, ...voidHtmlTags];
const renderTextNode = (tagTreeNode, indentation) => {
    const propRe = /\$p:([a-zA-Z0-9_\.]+)/g;
    const replacement = tagTreeNode.replace(propRe, (m, p1) => `{props.${p1}}`);
    return `${replacement}`;
};
// tslint:disable-next-line:no-any
const tagTree2code = (indentation) => (tagTreeNode) => {
    if (typeof (tagTreeNode) === "string") {
        return renderTextNode(tagTreeNode, indentation);
    }
    const elemName = tagTreeNode.tag;
    const tag = elemName === "ReactFragment" ? "React.Fragment" : elemName;
    const children = tagTreeNode.children || [];
    const childrenCode = children
        .map(tagTree2code(indentation + "  "))
        .join("\n").trim();
    // tslint:disable-next-line:no-any
    const genPropVal = (val) => {
        if (typeof val === "object") {
            switch (val.type) {
                case "$f":
                    return `vocab.map("${val.id}")`;
                case "$d":
                    return `vocab.domEvtHandle(this, "${val.id}")`;
                case "$p":
                    return `props.${val.id} `;
                default: break;
            }
        }
        return JSON.stringify(val);
    };
    if (elemName === "Loop") {
        const props = tagTreeNode.props;
        assert_1.ok(!!(props.over.id && props.as && props.component));
        // console.log(props);
        const over = props.over.id, as = props.as, component = props.component;
        return `{ props.${over}.map((${as}, i) => {
    const childProps = { ...props, ${as}
};
return (<${component} key = { i } { ...childProps } />);
        })}
`;
    }
    else if (elemName === "If") {
        const props = tagTreeNode.props;
        assert_1.ok(!!(props.cond.id && props.component));
        // console.log(props);
        const cond = props.cond.id;
        const component = props.component;
        const else_ = props.else_;
        const elseCode = else_ ? `(<${else_} { ...props } />)` : "<span/>";
        return `{
    props.${cond} ?
    (<${component} { ...props } />)
            :
    (${elseCode})
} `;
    }
    const propsCode = Object.keys(tagTreeNode.props)
        .map((key) => `${key}={ ${genPropVal(tagTreeNode.props[key])} } `, elemName.props)
        .join(" ").trim();
    const tagPlusProps = `${tag} ${propsCode}`.trim();
    return propsCode.length === 0 && childrenCode.trim().length === 0 ?
        `<${tag}/>`
        :
            (`<${tagPlusProps}>${childrenCode}</${tag}>`);
};
// tslint:disable-next-line:no-any
const functionize = (name, ast, code) => {
    const node = Array.isArray(ast[name]) ?
        { tag: "ReactFragment", children: ast[name] }
        :
            ast[name];
    const tags = parserV5_1.ast2TagNames([])(node);
    const customTags = tags.filter(t => !exports.stdTags.includes(t));
    const customTagDecl = customTags.length ?
        `const [${customTags.join(",")}] = vocab.mapMulti(${JSON.stringify(customTags)});`
        :
            ``;
    // .map(t => `const ${t} = vocab.get("${t}")`)
    // .join(";\n");
    const wrapped = Array.isArray(ast[name]) && ast[name].length > 1
        ?
            `<React.Fragment>${code}</React.Fragment>`
        :
            `${code}`;
    return `\
const make${name} = (vocab) => function ${name}(props) {
    ${customTagDecl}
    return (${wrapped});
};`;
};
// tslint:disable-next-line:no-any
// const prettify = (x: any) => x;
// tslint:disable-next-line:no-any
exports.codegenSpec = (input) => parserV5_1.parseF(input)
    // tslint:disable-next-line:no-any
    .map((ast) => {
    const codeTbl = ramda_1.mapObjIndexed((topElems, name) => {
        // tslint:disable-next-line:no-any
        const code = (Array.isArray(topElems)) ?
            topElems.map(tagTree2code("")).join("\n")
            :
                tagTree2code("")(topElems);
        return functionize(name, ast, code);
        // return code;
    }, ast);
    // console.log(codeTbl);
    return codeTbl;
})
    .map(toString);
// tslint:disable-next-line:no-any
const toString = (codeTbl) => {
    const functions = Object.keys(codeTbl).map((name) => codeTbl[name]).join("\n\n");
    const updateVocab = Object.keys(codeTbl)
        .map((name) => //`${name}: make${name}(vocab)`).join(",");
     `.update("${name}", make${name}(vocab))`).join("\n");
    return `
const React = require("react");
const ReactFragment = React.Fragment;

${functions}

module.exports = vocab =>
vocab ${updateVocab};
`;
};
//# sourceMappingURL=codegen.js.map
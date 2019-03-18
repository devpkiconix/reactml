"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const htmlTags = require("html-tags");
const voidHtmlTags = require("html-tags/void");
const parser_1 = require("./parser");
exports.stdTags = [...htmlTags, ...voidHtmlTags];
const renderTextNode = (tagTreeNode, indentation) => {
    const propRe = /\$p:([a-zA-Z0-9_\.]+)/g;
    const replacement = tagTreeNode.replace(propRe, (m, p1) => `{props.${p1}}`);
    return `${indentation}${replacement}`;
};
// tslint:disable-next-line:no-any
const tagTree2code = (indentation) => (tagTreeNode) => {
    const tag = tagTreeNode.tag;
    if (typeof (tagTreeNode) === "string") {
        return renderTextNode(tagTreeNode, indentation);
    }
    const children = tagTreeNode.children || [];
    const childrenCode = children
        .map(tagTree2code(indentation + "  "))
        .join("\n");
    // tslint:disable-next-line:no-any
    const genPropVal = (val) => {
        if (typeof val === "object") {
            switch (val.type) {
                case "$f":
                    return `vocab.map("${val.id}")`;
                case "$d":
                    return `vocab.domEvtHandle(this, "${val.id}")`;
                case "$p":
                    return `props.${val.id}`;
                default: break;
            }
        }
        return JSON.stringify(val);
    };
    if (tag === "Loop") {
        const props = tagTreeNode.props;
        assert_1.ok(!!(props.over.id && props.as && props.component));
        // console.log(props);
        const over = props.over.id, as = props.as, component = props.component;
        return `{props.${over}.map((${as}, i) => {
            const childProps = { ...props, ${as}};
            return (<${component} key={i} { ...childProps} />);
        })}
        `;
    }
    else if (tag === "If") {
        const props = tagTreeNode.props;
        assert_1.ok(!!(props.cond.id && props.component));
        // console.log(props);
        const cond = props.cond.id;
        const component = props.component;
        const else_ = props.else_;
        const elseCode = else_ ? `(<${else_} { ...props} />)` : "<span/>";
        return `{ props.${cond} ?
            (<${component} { ...props} />)
            :
            (${elseCode})
        }`;
    }
    else {
        const propsCode = Object.keys(tagTreeNode.props)
            .map((key) => `${key}={${genPropVal(tagTreeNode.props[key])}}`, tag.props)
            .join(" ");
        return (`${indentation}<${tag} ${propsCode}>\n${childrenCode}\n${indentation}</${tag}>`);
    }
};
// tslint:disable-next-line:no-any
const functionize = (name, ast, code) => {
    const tags = parser_1.ast2TagNames([])(ast);
    const customTags = tags.filter(t => !exports.stdTags.includes(t));
    const customTagDecl = customTags.length ?
        `const [${customTags.join(",")}] = vocab.mapMulti(${JSON.stringify(customTags)});`
        :
            ``;
    // .map(t => `const ${t} = vocab.get("${t}")`)
    // .join(";\n");
    return `
    const React = require("react");
    module.exports = (ctx) => {
        const { vocab, propMapper } = ctx;
        ${customTagDecl}
        const render = (props) => (${code});

        // Add new component to vocabulary object
        // and return the updated vocab
        return vocab.add("${name}", render);
    };`;
};
// tslint:disable-next-line:no-any
// const prettify = (x: any) => x;
exports.codegenStr = (functionName) => (input) => parser_1.parseF(input)
    .map(ast => {
    const code = tagTree2code("")(ast);
    return functionize(functionName, ast, code);
});
//# sourceMappingURL=rtml-codegen.js.map
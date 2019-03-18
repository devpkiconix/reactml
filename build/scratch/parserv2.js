"use strict";
// tslint:disable:ban
// tslint:disable:array-type
// tslint:disable:prefer-const
// tslint:disable:no-any
Object.defineProperty(exports, "__esModule", { value: true });
// Run me with Node to see my output!
const util = require("util");
// let P = require("parsimmon");
const P = require("parsimmon");
const ramda_1 = require("ramda");
// Turn escaped characters into real ones (e.g. "\\n" becomes "\n").
function interpretEscapes(str) {
    const escapes = {
        b: "\b",
        f: "\f",
        n: "\n",
        r: "\r",
        t: "\t"
    };
    return str.replace(/\\(u[0-9a-fA-F]{4}|[^u])/, (_, escape) => {
        let type = escape.charAt(0);
        let hex = escape.slice(1);
        if (type === "u") {
            return String.fromCharCode(parseInt(hex, 16));
        }
        if (escapes.hasOwnProperty(type)) {
            switch (type) {
                case "b": return escapes.b;
                case "f": return escapes.f;
                case "n": return escapes.n;
                case "r": return escapes.r;
                case "t": return escapes.t;
                default:
                    break;
            }
        }
        return type;
    });
}
// Use the JSON standard's definition of whitespace rather than Parsimmon's.
let whitespace = P.regexp(/\s*/m);
const spaces = P.regex(/[ ]*/);
// JSON is pretty relaxed about whitespace, so let's make it easy to ignore
// after most text.
function token(parser) {
    return parser.skip(whitespace);
}
// Several parsers are just strings with optional whitespace.
function word(str) {
    return P.string(str).thru(token);
}
const oneOf = P.alt;
const makeParser = (indentLevel) => 
// tslint:disable-next-line:variable-name
P.createLanguage({
    attr: r => P.seq(r.ident.skip(r.equal), r.value),
    attrList: r => r.lparen.then(r.attr.sepBy(spaces)).skip(r.rparen),
    tag: r => {
        const childrenIndent = ramda_1.range(0, indentLevel + 2).map(_ => ' ').join("");
        console.log(`Indent: [${childrenIndent}]`);
        const childrenIndentParser = word(childrenIndent);
        const childParser = makeParser(indentLevel + 2);
        const childrenParser = childrenIndentParser.then(childParser.tag);
        return P.seq(r.ident.skip(spaces).map((tag) => ({ tag })), oneOf(r.attrList)
            .map((attrList) => ({ attrList: attrList === "" ? [] : attrList })), oneOf(r.content.map((content) => ({ content })), childrenParser.map((children) => ({ children })), spaces)).map((val) => (Object.assign({}, val[0], val[1], val[2])));
    },
    content: r => r.equal.skip(spaces).then(r.text.skip(r.equal)),
    text: _ => P.regex(/[a-zA-Z \t\n0-9_]*/),
    // children: r => r.lbrace.then(r.tag.sepBy(whitespace)).skip(r.rbrace),
    //  JSON value.
    value: r => oneOf(r.object, r.array, r.string, r.number, r.null, r.true, r.false)
        .thru(parser => whitespace.then(parser)),
    // The basic tokens in JSON, with optional whitespace afterward.
    lparen: () => word("("),
    rparen: () => word(")"),
    lbrace: () => word("{"),
    rbrace: () => word("}"),
    lbracket: () => word("["),
    rbracket: () => word("]"),
    equal: () => word("="),
    comma: () => word(","),
    colon: () => word(":"),
    // `.result` is like `.map` but it takes a value instead of a function, and
    // always returns the same value.
    null: () => word("null").result(null),
    true: () => word("true").result(true),
    false: () => word("false").result(false),
    ident: () => P.regex(/[a-zA-Z_][a-zA-Z0-9_]*/),
    // Regexp based parsers should generally be named for better error reporting.
    string: () => token(P.regexp(/"((?:\\.|.)*?)"/, 1))
        .map(interpretEscapes)
        .desc("string"),
    number: () => token(P.regexp(/-?(0|[1-9][0-9]*)([.][0-9]+)?([eE][+-]?[0-9]+)?/))
        .map(Number)
        .desc("number"),
    // Array parsing is just ignoring brackets and commas and parsing as many nested
    // JSON documents as possible. Notice that we're using the parser `json` we just
    // defined above. Arrays and objects in the JSON grammar are recursive because
    // they can contain any other JSON document within them.
    array: r => r.lbracket.then(r.value.sepBy(r.comma)).skip(r.rbracket),
    // Object parsing is a little trickier because we have to collect all the key-
    // value pairs in order as length-2 arrays, then manually copy them into an
    // object.
    pair: r => P.seq(r.string.skip(r.colon), r.value),
    object: r => r.lbrace
        .then(r.pair.sepBy(r.comma))
        .skip(r.rbrace)
        .map((pairs) => {
        let object = {};
        pairs.forEach((pair) => {
            let [key, value] = pair;
            object[key] = value;
        });
        return object;
    })
});
///////////////////////////////////////////////////////////////////////
let sample = `header (_x=2 y="2" z=true object={"a":1})
  div
    span1
    span2() = some  content=
    span = some content=
    span() =foobar=
    span()
`;
function prettyPrint(x) {
    let opts = { depth: null, colors: true };
    let s = util.inspect(x, opts);
    console.log(s);
}
let ast = makeParser(0).tag.tryParse(sample);
prettyPrint(ast);
//# sourceMappingURL=parserv2.js.map
"use strict";
// tslint:disable:ban
// tslint:disable:array-type
// tslint:disable:prefer-const
// tslint:disable:no-any
Object.defineProperty(exports, "__esModule", { value: true });
const P = require("parsimmon");
const ramda_1 = require("ramda");
const fluture_1 = require("fluture");
// TODO:
// Conditional
// Looping
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
const whitespace = P.regexp(/\s*/m);
const spaces = P.regex(/[ \t]*/);
// JSON is pretty relaxed about whitespace, so let's make it easy to ignore
// after most text.
function token(parser) {
    return parser.skip(whitespace);
}
// Several parsers are just strings with optional whitespace.
function word(str) {
    return P.string(str).thru(token);
}
///////////////////////////////////////////////////////////////////////
// Because parsing indentation-sensitive languages such as Python requires
// tracking state, all of our parsers are created inside a function that takes
// the current parsing state. In this case it's just the current indentation
// level, but a real Python parser would also *at least* need to keep track of
// whether the current parsing is inside of () or [] or {} so that you can know
// to ignore all whitespace, instead of further tracking indentation.
//
// Implementing all of Python's various whitespace requirements, including
// comments and line continuations (backslash at the end of the line) is left as
// an exercise for the reader. I've tried and frankly it's pretty tricky.
function RtmlParser(indent) {
    return P.createLanguage({
        mappedDomFuncId: r => r.$d.then(r.ident.sepBy(r.dot))
            .map(a => a.join("."))
            .map(propName => ({ type: "$d", id: propName })),
        mappedFuncId: r => r.$f.then(r.ident.sepBy(r.dot))
            .map(a => a.join("."))
            .map(propName => ({ type: "$f", id: propName })),
        mappedPropId: r => P.alt(r.$p.then(r.ident.sepBy(r.dot))
            .map(a => a.join("."))
            .map(propName => ({ type: "$p", id: propName })), r.$g.then(r.ident.sepBy(r.dot))
            .map(a => a.join("."))
            .map(propName => ({ type: "$g", id: propName }))),
        prop: r => P.alt(P.seq(r.ident.skip(r.equal), P.alt(r.mappedPropId, r.mappedDomFuncId, r.mappedFuncId, r.value))),
        props: r => r.lparen.then(r.prop.sepBy(spaces)).skip(r.rparen)
        // .skip(P.index.map((index) => {
        //     console.log("_#_#_#", index.offset);
        //     console.log("_#_#_#", index.line);
        //     console.log("_#_#_#", index.column);
        //     return index;
        // }))
        ,
        //  JSON value.
        value: r => P.alt(r.object, r.array, r.string, r.number, r.null, r.true, r.false)
            .thru(parser => whitespace.then(parser)),
        // The basic tokens in JSON, with optional whitespace afterward.
        $c: r => P.string("$c:"),
        $d: r => P.string("$d:"),
        $f: r => P.string("$f:"),
        $p: r => P.string("$p:"),
        $g: r => P.string("$g:"),
        lparen: () => P.regexp(/\(/),
        rparen: () => P.regexp(/\)/),
        equal: () => P.regexp(/=/),
        blankLines: r => P.regexp(/[ \t]*$/).many(),
        lbrace: () => word("{"),
        rbrace: () => word("}"),
        lbracket: () => word("["),
        rbracket: () => word("]"),
        comma: () => word(","),
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
        }),
        colon: r => P.string(":"),
        tag1: r => P.seq(r.ident.map((tag) => ({ tag })), r.props.map((props) => ({ props: ramda_1.fromPairs(props === "" ? [] : props) }))).map((resArr) => (Object.assign({}, resArr[0], resArr[1]))),
        tag2: r => r.ident.map((tag) => ({ tag, props: {} })),
        tag: r => P.alt(r.tag1, r.tag2)
            // .map(tag => { console.log("tag is", tag); return tag; })
            .skip(P.index.map((index) => {
            // console.log("tag end (line, col)", index.line, index.column);
            return index;
        }))
            .skip(spaces),
        Nothing: r => P.string(""),
        semicolon: r => P.string(";"),
        dot: r => P.string("."),
        // This is just a statement in our language. To simplify, this is either a
        // block of code or just an identifier
        leaf: r => r.tag.skip(r.dot).skip(r.End),
        name: r => P.regex(/[^ ,\-\>\;]+/),
        Statement: r => P.seq(r.name.skip(spaces.then(r.equal).skip(spaces)), P.alt(r.commaSeparatedNodes.skip(r.semicolon), r.arrowSeparatedNodes.skip(r.semicolon))).map(([name, def]) => ({ [name]: def })),
        Statements: r => r.Statement.sepBy(whitespace).skip(r.End)
            .map(arr => arr.reduce((acc, def) => (Object.assign({}, acc, def)), {})),
        commaSeparatedNodes: r => r.node.skip(whitespace).sepBy(r.comma).skip(whitespace)
            .map(arr => ramda_1.flatten(arr)
            .filter(x => (typeof x === "string" || x.tag)))
            // .map(x => (console.log("after flattening", x), x))
            .map(children => (children)),
        arrowSeparatedNodes: r => r.node.skip(whitespace).sepBy(r.arrow).skip(whitespace)
            .map(arr => ramda_1.flatten(arr))
            .map(arr => arr.reduceRight((acc, tag) => {
            return (typeof tag === "string")
                ?
                    { tag: "span", children: [tag] }
                :
                    (Object.assign({}, tag, { children: [(Object.assign({}, acc))] }));
        }, {}))
            .map(x => [x]),
        arrow: r => whitespace.skip(P.string("->")).skip(whitespace),
        node: r => P.alt(P.seq(r.tag, P.alt(r.commaSeparatedNodes, r.arrowSeparatedNodes)), r.Content),
        // content followed by new line
        Content: r => r.string,
        // Support all three standard text file line endings
        NL: () => P.alt(P.string("\r\n"), P.oneOf("\r\n")),
        // Lines should always end in a newline sequence, but many files are missing
        // the final newline
        End: r => P.alt(r.NL, P.eof)
    });
}
exports.RtmlParser = RtmlParser;
exports.parse = (input) => {
    const myParser = RtmlParser(0);
    return myParser.Statements.tryParse(input.trim());
};
// tslint:disable-next-line:no-any
exports.parseF = (spec) => fluture_1.default((rej, resolve) => {
    try {
        resolve(exports.parse(spec));
    }
    catch (err) {
        rej(err);
    }
});
// tslint:disable-next-line:no-any
exports.ast2TagNames = (acc) => (tagTreeNode) => {
    if (typeof (tagTreeNode) === "string") {
        return acc;
    }
    const tag = tagTreeNode.tag;
    if (acc.includes(tag)) { // already exists
        return acc;
    }
    const updated = [...acc, tag];
    const childTags = (tagTreeNode.children || []).map(exports.ast2TagNames(updated));
    return ramda_1.uniq(ramda_1.flatten([...updated, ...childTags]));
};
//# sourceMappingURL=viewlang-parser.js.map
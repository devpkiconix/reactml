"use strict";
/*












                            DO NOT USE THIS FILE














*/
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
const whitespace = P.regexp(/\s*|\/\/.*$/m);
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
        mappedPropId: r => r.$p.then(r.ident.sepBy(r.dot))
            .map(a => a.join("."))
            .map(propName => ({ type: "$p", id: propName })),
        globalPropId: r => r.$g.then(r.ident.sepBy(r.dot))
            .map(a => a.join("."))
            .map(propName => ({ type: "$g", id: propName })),
        prop: r => P.alt(P.seq(r.ident.skip(r.equal), P.alt(r.mappedPropId, r.mappedDomFuncId, r.mappedFuncId, r.globalPropId, r.value))),
        props: r => r.lparen.then(r.prop.sepBy(spaces)).skip(r.rparen),
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
        // This is where the magic happens. Basically we need to parse a deeper
        // indentation level on the first statement of the block and keep track of
        // new indentation level. Then we make a whole new set of parsers that use
        // that new indentation level for all their parsing. Each line past the
        // first is required to be indented to the same level as that new deeper
        // indentation level.
        Block1: r => {
            const params = [
                ["tag", r.tag],
                r.End,
                ["n", r.IndentMore],
                ["first", r.Statement]
            ];
            // "as Function" cast is to get around compilation issues
            return P.seqObj(...params)
                .chain((args) => {
                const { tag, n, first } = args;
                return RtmlParser(n)
                    .RestStatement.many()
                    .map(rest => (Object.assign({}, tag, { children: [first, ...rest] })));
            });
        },
        Block2: r => r.tag.skip(r.End)
            .map(tag => (Object.assign({}, tag, { children: [] }))),
        Block: r => P.alt(r.Block1, r.Block2)
            .skip(P.index.map((index) => {
            // console.log("block end (line, col)", index.line, index.column, indent);
            return index;
        })),
        colon: r => P.string(":"),
        tag1: r => P.seq(r.ident.map((tag) => ({ tag })), r.props.map((props) => ({ props: ramda_1.fromPairs(props === "" ? [] : props) }))).map((resArr) => (Object.assign({}, resArr[0], resArr[1]))),
        tag2: r => r.ident.map((tag) => ({ tag, children: [], props: {} })),
        tag: r => P.alt(r.tag1, r.tag2)
            .skip(P.index.map((index) => {
            // console.log("tag end (line, col)", index.line, index.column);
            return index;
        }))
            .skip(spaces),
        Nothing: r => P.string(""),
        dot: r => P.string("."),
        // This is just a statement in our language. To simplify, this is either a
        // block of code or just an identifier
        leaf: r => r.tag.skip(r.dot).skip(r.End),
        Statement: r => P.alt(r.leaf, r.Block, r.Content, whitespace),
        // This is a statement which is indented to the level of the current parse
        // state. It's called RestStatement because the first statement in a block
        // is indented more than the previous state, but the *rest* of the
        // statements match up with the new state.
        RestStatement: r => r.IndentSame.then(r.Statement),
        // content followed by new line
        Content: r => r.equal.then(P.regexp(/[a-z0-9;\$:\!\;,_\. \*\(\){}\[\]\"\'=\|]+/i)).skip(r.End),
        // Consume zero or more spaces and then return the number consumed. For a
        // more Python-like language, this parser would also accept tabs and then
        // expand them to the correct number of spaces
        //
        // https://docs.python.org/3/reference/lexical_analysis.html#indentation
        CountSpaces: () => P.regexp(/[ ]*/).map(s => s.length),
        // Count the current indentation level and assert it's more than the current
        // parse state's desired indentation
        IndentSame: r => r.CountSpaces.chain(n => {
            if (n === indent) {
                return P.of(n);
            }
            return P.fail(`${n} spaces`);
        }),
        // Count the current indentation level and assert it's equal to the current
        // parse state's desired indentation
        IndentMore: r => r.CountSpaces.chain(n => {
            if (n > indent) {
                // console.log(n, indent, "more");
                return P.of(n);
            }
            // console.log(n, indent, "not more");
            return P.fail(`more than ${n} spaces`);
        }),
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
    return myParser.Statement.tryParse(input.trim());
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
const todoNotes = `
  - Define prop mapper - .a.b.c, ..save, ...AComponent,
  - Array Mapper
  - Conditional
  - Flow definition - entire app description from page to page
  - Event handling - what happens on a button click, what happens when a request to a server completes?
    A simple flow definition using Saga?
  -

`;
const apprunNotes = `
Each page has model, view and update
Events pubsub
HTML for structure, components for app stuff
`;
const flowDefNotes = `
Each page is a 'subapp'
Each subapp has one View component
Subapp maybe stateful or stateless
Stateful subapp has a render function, a state, and triggers & processes a set of events that may update state
Stateless subapp has a render function
Each event has some data associated with it
Each event has a processor associated with it, which is given the current state and event data
Event processors may (eventually) update state and trigger other events
Navigation is a special event identified a string with # and page name

Submit(Login) -> Post(Login) -> Pub(LoginSuccess)
Event(LoginSuccess) -> Pub(Navigate("/home"))
Submit(UserProfileForm) -> Post(UseProfileForm) -> Pub(Navigate("/home"))

etc.
`;
const sampleHelloApp = `

`;
//# sourceMappingURL=rtml-parser.js.map
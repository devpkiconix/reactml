// tslint:disable:ban
// tslint:disable:array-type
// tslint:disable:prefer-const
// tslint:disable:no-any

import * as P from "parsimmon";
import { fromPairs, uniq, flatten } from "ramda";
import Future from "fluture";
import { FutVal } from "./rtml-types";

// Turn escaped characters into real ones (e.g. "\\n" becomes "\n").
function interpretEscapes(str: { replace: (arg0: RegExp, arg1: (_: any, escape: any) => any) => void; }) {
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
function token(parser: P.Parser<string>) {
    return parser.skip(whitespace);
}

// Several parsers are just strings with optional whitespace.
function word(str: string) {
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
export function RtmlParser(indent: number) {
    return P.createLanguage({
        mappedDomFuncId: r => r.$d.then(r.ident.sepBy(r.dot))
            .map(a => a.join("."))
            .map(propName => ({ type: "$d", id: propName })),
        mappedFuncId: r => r.$f.then(r.ident.sepBy(r.dot))
            .map(a => a.join("."))
            .map(propName => ({ type: "$f", id: propName })),
        mappedPropId: r => P.alt(
            r.$p.then(r.ident.sepBy(r.dot))
                .map(a => a.join("."))
                .map(propName => ({ type: "$p", id: propName })),
            r.$g.then(r.ident.sepBy(r.dot))
                .map(a => a.join("."))
                .map(propName => ({ type: "$g", id: propName })),
        ),
        prop: r => P.alt(
            P.seq(
                r.ident.skip(r.equal),
                P.alt(
                    r.mappedPropId,
                    r.mappedDomFuncId,
                    r.mappedFuncId,
                    r.value,
                ))).desc("prop"),
        props: r => r.lparen.then(r.prop.sepBy(spaces)).skip(r.rparen).desc("props"),

        //  JSON value.
        value: r =>
            P.alt(r.object, r.array, r.string, r.number, r.null, r.true, r.false)
                .thru(parser => whitespace.then(parser)),

        // The basic tokens in JSON, with optional whitespace afterward.
        $c: r => P.string("$c:"), // UI component
        $d: r => P.string("$d:"), // Dom handler
        $f: r => P.string("$f:"), // function
        $p: r => P.string("$p:"), // prop
        $g: r => P.string("$g:"), // prop

        lparen: () => P.regexp(/\(/).desc("open paren"),
        rparen: () => P.regexp(/\)/).desc("close paren"),
        equal: () => P.regexp(/\s*=\s*/).desc("equals"),
        blankLines: r => P.regexp(/[ \t]*$/).many(),

        lbrace: () => word("{"),
        rbrace: () => word("}"),
        lbracket: () => word("["),
        rbracket: () => word("]"),
        comma: () => word(",").desc("comma"),
        comma2: () => P.regex(/[,\s]*/),

        // `.result` is like `.map` but it takes a value instead of a function, and
        // always returns the same value.
        null: () => word("null").result(null),
        true: () => word("true").result(true),
        false: () => word("false").result(false),
        ident: () => P.regex(/[a-zA-Z_][a-zA-Z0-9_]*/).desc("ident"),
        // Regexp based parsers should generally be named for better error reporting.
        string: () =>
            token(P.regexp(/"((?:\\.|.)*?)"/, 1))
                .map(interpretEscapes)
                .desc("double-quoted string"),

        number: () =>
            token(P.regexp(/-?(0|[1-9][0-9]*)([.][0-9]+)?([eE][+-]?[0-9]+)?/))
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

        object: r =>
            r.lbrace
                .then(r.pair.sepBy(r.comma))
                .skip(r.rbrace)
                .map((pairs: [any, any][]) => {
                    let object: any = {};
                    pairs.forEach((pair: [any, any]) => {
                        let [key, value] = pair;
                        object[key] = value;
                    });
                    return object;
                }),

        colon: r => P.string(":"),
        tag1: r => P.seq(
            r.ident.map((tag: any) => ({ tag })),
            r.props.map((props) => ({ props: fromPairs(props === "" ? [] : props) })),
        ).map((resArr: any[]) => ({ ...resArr[0], ...resArr[1] })),
        tag2: r =>
            r.ident.map((tag: any) => ({ tag, props: {} })),

        tag: r => P.alt(r.tag1, r.tag2)
            // .map(tag => { console.log("tag is", tag); return tag; })
            .skip(P.index.map((index) => {
                // console.log("tag end (line, col)", index.line, index.column);
                return index;
            }))
            .skip(spaces)
        ,
        Nothing: r => P.string(""),
        semicolon: r => P.string(";").desc("semicolon"),
        dot: r => P.string("."),
        // This is just a statement in our language. To simplify, this is either a
        // block of code or just an identifier
        leaf: r => r.tag.skip(r.dot).skip(r.End), // Delimit leaf tags with a "." at the end of the line
        name: r => P.regex(/[^ ,\-\>\;]+/),
        Statement: r => P.seq(
            r.name.skip(spaces.then(r.equal).skip(spaces)),
            P.alt(r.commaSeparatedNodes.skip(r.semicolon), r.arrowSeparatedNodes.skip(r.semicolon))
        ).map(([name, def]) => ({ [name]: def })),
        Statements: r => r.Statement.sepBy(whitespace).skip(r.End)
            .map(arr => arr.reduce((acc: any, def: any) => ({ ...acc, ...def }), {}))
        ,

        csn: r => r.node.skip(whitespace).sepBy(r.comma).skip(whitespace),

        commaSeparatedNodes: r =>
            r.lparen.then(r.csn).skip(r.rparen)
                .or(r.csn)
                .map(arr => flatten(arr)
                    .filter((x: any) => (typeof x === "string" || x.tag))
                )
                // .map(x => (console.log("after flattening", x), x))
                .map(children => (children)),

        asn: r => r.node.skip(whitespace).sepBy(r.arrow).skip(whitespace).desc("arrow-separated-nodes"),
        arrowSeparatedNodes: r =>
            r.lparen.then(r.asn).skip(r.rparen)
                .or(r.asn)

                .map(arr => flatten(arr))
                .map(arr => arr.reduceRight((acc, tag) => {
                    return (typeof tag === "string")
                        ?
                        { tag: "span", children: [tag] }
                        :
                        ({
                            ...tag, children: [({ ...acc })],
                        });
                }, {}))
                .map(x => [x]),

        arrow: r => whitespace.skip(P.string("->")).skip(whitespace),
        node: r => P.alt(
            P.seq(
                r.tag,
                P.alt(
                    whitespace.skip(r.comma).skip(whitespace).then(r.node),
                    // r.commaSeparatedNodes,
                    P.seq(
                        r.tag.skip(whitespace).skip(r.arrow).skip(whitespace),
                        r.node),
                    // r.arrowSeparatedNodes,
                )
            ),
            r.Content),

        /**
         * The underscore prefixed parsers are an attempt at improving
         * the parsing, and to implement a way to group expresssions.
         * See "grouping" test case.
         *
         * WIP
         *
         * spec = sentence+ End
         * sentence := (commaSepNodes | node) ";"
         * node := tag | content | commaSepNodes | arrowSepNodes
         * commaSepNodes := node ("," node)*
         * arrowSepNodes := node ("->" node)*
         */

        Node3: (r) => P.alt(r.List, r.Composition, r.tag,
            r.Content.map(content => ({ tag: "Content", props: { content } }))
        ),
        List: (r) => r.Node3.sepBy(r.comma)
            .wrap(P.string("("), P.string(")"))
            .map(arr => flatten(arr))
        // // .map(x => (console.log("after flattening", x), x))
        // .map(children => (children))
        ,
        Composition: (r) => r.Node3.sepBy(r.arrow)
            .wrap(P.string("("), P.string(")"))
            .map(arr => arr.reduceRight((acc, tag) => {
                return (typeof tag === "string")
                    ?
                    { tag: "span", children: [tag] }
                    :
                    ({
                        ...tag, children: Array.isArray(acc) ? acc : [({ ...acc })],
                    });
            }, {}))
            .map(compositeNode)
        // .map(x => [x])
        ,
        Equation3: r => P.seq(
            r.name.skip(spaces.then(r.equal).skip(spaces)),
            r.Node3
        ).map(([name, def]) => ({ [name]: def })),

        // content followed by new line
        Content: r => r.string,
        // Support all three standard text file line endings
        NL: () => P.alt(P.string("\r\n"), P.oneOf("\r\n")),

        // Lines should always end in a newline sequence, but many files are missing
        // the final newline
        End: r => P.alt(r.NL, P.eof)
    });
}

export const parse = (input: string): any => {
    const myParser = RtmlParser(0);
    return myParser.Statements.tryParse(input.trim());
};

// tslint:disable-next-line:no-any
export const parseF = (spec: string): FutVal<any> =>
    Future((rej, resolve) => {
        try {
            resolve(parse(spec));
        } catch (err) {
            rej(err);
        }
    });

export const parseV2 = (input: string): any => {
    const myParser = RtmlParser(0);
    return myParser._spec.tryParse(input.trim());
};

// tslint:disable-next-line:no-any
export const parseV2F = (spec: string): FutVal<any> =>
    Future((rej, resolve) => {
        try {
            resolve(parseV2(spec));
        } catch (err) {
            rej(err);
        }
    });

// tslint:disable-next-line:no-any
export const ast2TagNames = (acc: string[]) => (tagTreeNode: any): string[] => {
    if (typeof (tagTreeNode) === "string") {
        return acc;
    }
    const tag = tagTreeNode.tag;
    if (acc.includes(tag)) { // already exists
        return acc;
    }

    const updated = [...acc, tag];
    const childTags: string[][] = (tagTreeNode.children || []).map(ast2TagNames(updated));
    return uniq(flatten([...updated, ...childTags]));
};



const compositeNode = (defs: any[]) => {
    if (!Array.isArray(defs)) {
        return defs;
    }
    if (!(defs && defs.length > 0)) {
        return [];
    }
    const [first, ...rest] = defs;
    first.children = [compositeNode(rest)];
    return first;
};
"use strict";
// tslint:disable:variable-name
// tslint:disable:no-implicit-any
// tslint:disable:*
// tslint:disable:array-type
// tslint:disable:prefer-const
// tslint:disable:no-any
// tslint:disable:semicolon
// Run me with Node to see my output!
let util = require("util");
let P = require("parsimmon");
const R = require("ramda");
let _ = P.optWhitespace;
const whitespace = P.regexp(/\s*/m);
const lparen = P.regexp(/\(/);
const rparen = P.regexp(/\)/);
const equal = P.regexp(/=/);
const ident = _.then(P.regex(/[a-zA-Z_][a-zA-Z0-9_]*/)).skip(_);
const string = token(P.regexp(/"((?:\\.|.)*?)"/, 1))
    .map(interpretEscapes)
    .desc("string");
const STRING_TYPE = "__STRING__";
const Content = string.map((str) => ([STRING_TYPE, str]));
const prop = P.seq(ident.skip(equal), string // TODO: add other types (JSON, numbers, etc)
);
const spaces = P.regex(/[ \t]*/);
const props = lparen.then(prop.sepBy(spaces)).skip(rparen);
const tag1 = P.seq(ident.map((tag) => ({ tag, children: [] })), props.map((props) => ({ props: R.fromPairs(props === "" ? [] : props) }))).map((resArr) => (Object.assign({}, resArr[0], resArr[1])));
const tag2 = ident.map((tag) => ({ tag, props: {}, children: [] }));
const tag = P.alt(tag1, tag2)
    .map(tag => (["TAG", Object.assign({}, tag, { createReact: createReact })]))
    .skip(spaces);
// This parser supports basic math with + - * / ^, unary negation, factorial,
// and parentheses. It does not evaluate the math, just turn it into a series of
// nested lists that are easy to evaluate.
// You might think that parsing math would be easy since people learn it early
// in school, but dealing with precedence and associativity of operators is
// actually one of the hardest and most tedious things you can do in a parser!
// If you look at a language like JavaScript, it has even more operators than
// math, like = and && and || and ++ and so many more...
///////////////////////////////////////////////////////////////////////
function elemFolder(acc, b) {
    return [...acc, b[1]];
}
function elemComposer(acc, val) {
    if (typeof acc === "string") {
        throw new Error("Cannot compose elements inside content");
    }
    const accTag = acc.tag ? acc : acc[1];
    console.log(1, JSON.stringify(acc));
    console.log(1.5, val);
    if (val[1].tag === "c") {
        console.log(1.6);
    }
    const merged = Object.assign({}, accTag, { children: [...accTag.children, val[1]] });
    console.log(2, merged);
    return merged;
}
function addFn(x) { return 0; }
function subtractFn(x) { return 0; }
function multFn(x) { return 0; }
function divideFn(x) { return 0; }
function factorialFn(x) { return 0; }
function powFn(x) { return 0; }
function negateFn(x) { return 0; }
function createReact(tagdef) { return tagdef; }
;
const operatorFunctions = {
    ELEMLIST_FOLD: elemFolder,
    ELEM_COMPOSE: elemComposer,
    Add: addFn,
    Subtract: subtractFn,
    Multiply: multFn,
    Divide: divideFn,
    Factorial: factorialFn,
    Exponentiate: powFn,
    Negate: negateFn,
};
// Operators should allow whitespace around them, but not require it. This
// helper combines multiple operators together with names.
//
// Example: operators({Add: "+", Sub: "-"})
//
// Gives back an operator that parses either + or - surrounded by optional
// whitespace, and gives back the word "Add" or "Sub" instead of the character.
function operators(ops) {
    let keys = Object.keys(ops).sort();
    let ps = keys.map(k => P.string(ops[k])
        .trim(_)
        .result(k));
    return P.alt.apply(null, ps);
}
// Takes a parser for the prefix operator, and a parser for the base thing being
// parsed, and parses as many occurrences as possible of the prefix operator.
// Note that the parser is created using `P.lazy` because it's recursive. It's
// valid for there to be zero occurrences of the prefix operator.
function PREFIX(operatorsParser, nextParser) {
    let parser = P.lazy(() => {
        return P.seq(operatorsParser, parser)
            .map(x => ([x[0], x[1]]))
            .or(nextParser);
    });
    return parser;
}
// Ideally this function would be just like `PREFIX` but reordered like
// `P.seq(parser, operatorsParser).or(nextParser)`, but that doesn't work. The
// reason for that is that Parsimmon will get stuck in infinite recursion, since
// the very first rule. Inside `parser` is to match parser again. Alternatively,
// you might think to try `nextParser.or(P.seq(parser, operatorsParser))`, but
// that won't work either because in a call to `.or` (aka `P.alt`), Parsimmon
// takes the first possible match, even if subsequent matches are longer, so the
// parser will never actually look far enough ahead to see the postfix
// operators.
function POSTFIX(operatorsParser, nextParser) {
    // Because we can't use recursion like stated above, we just match a flat list
    // of as many occurrences of the postfix operator as possible, then use
    // `.reduce` to manually nest the list.
    //
    // Example:
    //
    // INPUT  :: "4!!!"
    // PARSE  :: [4, "factorial", "factorial", "factorial"]
    // REDUCE :: ["factorial", ["factorial", ["factorial", 4]]]
    return P.seqMap(nextParser, operatorsParser.many(), (x, suffixes) => suffixes.reduce((acc, x) => [x, acc], x));
}
// Takes a parser for all the operators at this precedence level, and a parser
// that parsers everything at the next precedence level, and returns a parser
// that parses as many binary operations as possible, associating them to the
// right. (e.g. 1^2^3 is 1^(2^3) not (1^2)^3)
function BINARY_RIGHT(operatorsParser, nextParser) {
    let parser = P.lazy(() => nextParser.chain(next => P.seq(operatorsParser, P.of(next), parser)
        .map(x => ([x[0], x[1]]))
        .or(P.of(next))));
    return parser;
}
// Takes a parser for all the operators at this precedence level, and a parser
// that parsers everything at the next precedence level, and returns a parser
// that parses as many binary operations as possible, associating them to the
// left. (e.g. 1-2-3 is (1-2)-3 not 1-(2-3))
function BINARY_LEFT(operatorsParser, nextParser) {
    // We run into a similar problem as with the `POSTFIX` parser above where we
    // can't recurse in the direction we want, so we have to resort to parsing an
    // entire list of operator chunks and then using `.reduce` to manually nest
    // them again.
    //
    // Example:
    //
    // INPUT  :: "1+2+3"
    // PARSE  :: [1, ["+", 2], ["+", 3]]
    // REDUCE :: ["+", ["+", 1, 2], 3]
    return P.seqMap(nextParser, P.seq(operatorsParser, nextParser).many(), (first, rest) => {
        const reduced = rest.reduce((acc, ch) => {
            const [op, another] = ch;
            switch (op) {
                case "ELEM_COMPOSE":
                    return elemComposer(acc, another);
                    break;
                default:
                    break;
            }
            return [op, acc, another];
        }, first);
        return reduced;
    });
}
// Just match simple integers and turn them into JavaScript numbers. Wraps it up
// in an array with a string tag so that our data is easy to manipulate at the
// end and we don't have to use `typeof` to check it.
let Num = P.regexp(/[0-9]+/)
    .map(str => ["Number", +str])
    .desc("number");
function token(parser) {
    return parser.skip(whitespace);
}
const Num3 = P.alt(tag, Content, Num);
// A basic value is any parenthesized expression or a number.
const Basic = P.lazy(() => P.string("(")
    .then(MyMath)
    .skip(P.string(")"))
    .or(Num3));
// Now we can describe the operators in order by precedence. You just need to
// re-order the table.
let table = [
    { type: PREFIX, ops: operators({ Negate: "-" }) },
    { type: POSTFIX, ops: operators({ Factorial: "!" }) },
    { type: BINARY_RIGHT, ops: operators({ Exponentiate: "^" }) },
    { type: BINARY_LEFT, ops: operators({ Add: "+", Subtract: "-" }) },
    { type: BINARY_LEFT, ops: operators({ Multiply: "*", Divide: "/" }) },
    { type: BINARY_LEFT, ops: operators({ ELEMLIST_FOLD: "," }) },
    { type: BINARY_LEFT, ops: operators({ ELEM_COMPOSE: "->", }) },
];
// Start off with Num as the base parser for numbers and thread that through the
// entire table of operator parsers.
let tableParser = table.reduce((acc, level) => level.type(level.ops, acc), Basic);
// The above is equivalent to:
//
// TYPE(operators({...}),
//   TYPE(operators({...}),
//     TYPE(operators({...})),
//       TYPE(operators({...}),
//         TYPE(operators({...}), ...))))
//
// But it's easier if to see what's going on and reorder the precedence if we
// keep it in a table instead of nesting it all manually.
// This is our version of a math expression.
let MyMath = tableParser.trim(_);
const mapper = (node) => {
    const [op, ...rest] = node;
    switch (op) {
        case "ELEM_COMPOSEx":
            return Object.assign({}, node[1], { children: [node[2]] });
        case "TAGx":
            return node[1];
        default:
            return node;
    }
};
let Rtml = P.seq(ident.skip(equal), MyMath)
    .map(([name, expr]) => {
    const reduced = expr; //.map(mapper);
    return ({ [name]: reduced });
});
///////////////////////////////////////////////////////////////////////
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
const text = `
page  = div(color="red")  -> (
  span(width="200") ->
    div(className="container") ->
      div(className="item") ->
        (a(href="http://example.com") -> "example!"), "the end")`;
function prettyPrint(x) {
    let opts = { depth: null, colors: "auto" };
    let s = util.inspect(x, opts);
    // console.log(s);
    console.log(JSON.stringify(x, null, 2));
}
prettyPrint(Rtml.tryParse(`x = a->b->c->d-> "some string" -> fii`));
// prettyPrint(Rtml.tryParse(`y = a(width="200"),b,c(color="red"),"a string"`));
//# sourceMappingURL=matheg.js.map
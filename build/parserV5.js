"use strict";
const Future = require("fluture").default;
// console.log("Future", Future.default);
// Run me with Node to see my output!
const assert = require("assert").ok;
const util = require("util");
const P = require("parsimmon");
const jsonParser = require("./json-parser");
const R = require("ramda");
// This parser supports basic math with + - * / ^, unary negation, factorial,
// and parentheses. It does not evaluate the math, just turn it into a series of
// nested lists that are easy to evaluate.
// You might think that parsing math would be easy since people learn it early
// in school, but dealing with precedence and associativity of operators is
// actually one of the hardest and most tedious things you can do in a parser!
// If you look at a language like JavaScript, it has even more operators than
// math, like = and && and || and ++ and so many more...
///////////////////////////////////////////////////////////////////////
const _ = P.optWhitespace;
// Operators should allow whitespace around them, but not require it. This
// helper combines multiple operators together with names.
//
// Example: operators({Add: "+", Sub: "-"})
//
// Gives back an operator that parses either + or - surrounded by optional
// whitespace, and gives back the word "Add" or "Sub" instead of the character.
function operators(ops) {
    const keys = Object.keys(ops).sort();
    const ps = keys.map(k => P.string(ops[k])
        .trim(_)
        .result(k));
    return P.alt.apply(null, ps);
}
// Takes a parser for the prefix operator, and a parser for the base thing being
// parsed, and parses as many occurrences as possible of the prefix operator.
// Note that the parser is created using `P.lazy` because it's recursive. It's
// valid for there to be zero occurrences of the prefix operator.
function PREFIX(operatorsParser, nextParser) {
    const parser = P.lazy(() => {
        return P.seq(operatorsParser, parser).or(nextParser);
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
const comment = P.regexp(/(\s*\/\/.*$)*/m);
const whitespace = P.alt(P.regexp(/\s*/m));
const semicolon = P.string(";");
const lparen = P.regexp(/\(/);
const rparen = P.regexp(/\)/);
const equal = P.regexp(/=/);
const ident = _.then(P.regex(/[a-zA-Z_][a-zA-Z0-9_]*/)).skip(_);
function token(parser) {
    return parser.skip(whitespace);
}
const string = token(P.regexp(/"((?:\\.|.)*?)"/, 1))
    .map(interpretEscapes)
    // .map(str => ["String", str])
    .desc("string");
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
        const type = escape.charAt(0);
        const hex = escape.slice(1);
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
const Content = string.map((str) => (["Content", str]));
const dot = P.string(".");
const $d = P.string("$d:"); // Dom handler
const $f = P.string("$f:"); // function
const $p = P.string("$p:"); // prop
const $g = P.string("$g:"); // prop
const mappedDomFuncId = $d.then(ident.sepBy(dot))
    .map(a => a.join("."))
    .map(propName => ({ type: "$d", id: propName }));
const mappedFuncId = $f.then(ident.sepBy(dot))
    .map(a => a.join("."))
    .map(propName => ({ type: "$f", id: propName }));
const mappedPropId = P.alt($p.then(ident.sepBy(dot))
    .map(a => a.join("."))
    .map(propName => ({ type: "$p", id: propName })), $g.then(ident.sepBy(dot))
    .map(a => a.join("."))
    .map(propName => ({ type: "$g", id: propName })));
const prop = P.alt(P.seq(ident.skip(equal), P.alt(mappedPropId, mappedDomFuncId, mappedFuncId, jsonParser))).desc("prop");
//.map(x => ["Prop", x]);
const spaces = P.regex(/[ \t]*/);
const props = lparen.then(prop.sepBy(spaces)).skip(rparen);
const tag1 = P.seq(ident.map((tag) => ({ tag, children: [] })), props.map((props) => ({ props: R.fromPairs(props === "" ? [] : props) }))).map((resArr) => (Object.assign({}, resArr[0], resArr[1])));
const tag2 = ident.map((tag) => ({ tag, props: {}, children: [] }));
const tag = P.alt(tag1, tag2)
    .map(tag => ([`TAG`, tag]))
    .skip(spaces);
const multiply = (x, y) => x * y;
const add = (x, y) => x + y;
const subtract = (x, y) => x - y;
const divide = (x, y) => x / y;
const compose = (x, y) => {
    if (Array.isArray(x)) {
        return R.flatten([x, [y]]);
    }
    try {
        assert(x.tag);
    }
    catch (err) {
        console.error(err);
        console.log(x);
        throw err;
    }
    return [Object.assign({}, x, { children: Array.isArray(y) ? y : [y] })];
};
const fold = (x, y) => 
// ({ tag: "React.Fragment", children: [x, y] });
R.flatten([x, y]);
// `React.createElement(\n\tReact.Fragment, {}, [${x}, ${y}])`;
const evaluate = (input) => {
    let calcval = null;
    let operator, args;
    try {
        const [_operator, ..._args] = input;
        operator = _operator;
        args = _args;
    }
    catch (err) {
        // console.log(err);
        calcval = input;
    }
    switch (operator) {
        case "Number":
            calcval = args[0];
            break;
        case "Content":
            return evaluate(args[0]);
        case "TAG":
            return evaluate(args[0]);
        case "Props":
            calcval = evaluate(args[0]);
            break;
        case "Ident":
            calcval = evaluate(args[0]);
            break;
        case "String":
            // calcval = `STRING("${args[0]}")`;
            calcval = evaluate(args[0]);
            break;
        case "Multiply":
            calcval = multiply(evaluate(args[0]), evaluate(args[1]));
            break;
        case "Add":
            calcval = add(evaluate(args[0]), evaluate(args[1]));
            break;
        case "Subtract":
            calcval = subtract(evaluate(args[0]), evaluate(args[1]));
            break;
        case "Divide":
            calcval = divide(evaluate(args[0]), evaluate(args[1]));
            break;
        case "Fold":
            calcval = fold(evaluate(args[0]), evaluate(args[1]));
            break;
        case "Compose":
            calcval = compose(evaluate(args[0]), evaluate(args[1]));
            break;
        default:
            return input;
    }
    // console.log("LOG", input);
    // // console.log("LOG", operator, args);
    // return input;
    // console.log("{" + calcval + "}");
    return calcval;
};
// Takes a parser for all the operators at this precedence level, and a parser
// that parsers everything at the next precedence level, and returns a parser
// that parses as many binary operations as possible, associating them to the
// right. (e.g. 1^2^3 is 1^(2^3) not (1^2)^3)
function BINARY_RIGHT(operatorsParser, nextParser) {
    const parser = P.lazy(() => nextParser.chain(next => P.seq(operatorsParser.skip(comment), P.of(next).skip(comment), parser.skip(comment)).or(P.of(next))));
    return parser.map(evaluate);
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
            return [op, acc, another];
        }, first);
        // console.log("-----<", first, rest, reduced);
        return reduced;
    });
}
// Just match simple integers and turn them into JavaScript numbers. Wraps it up
// in an array with a string tag so that our data is easy to manipulate at the
// end and we don't have to use `typeof` to check it.
const Num = P.regexp(/[0-9]+/)
    .map(str => ["Number", +str])
    .desc("number");
// A basic value is any parenthesized expression or a number.
const Basic = P.lazy(() => P.string("(")
    .then(RtmlExpr)
    .skip(P.string(")"))
    .or(Num.or(tag).or(Content)));
// Now we can describe the operators in order by precedence. You just need to
// re-order the table.
const table = [
    { type: PREFIX, ops: operators({ Negate: "-" }) },
    { type: POSTFIX, ops: operators({ Factorial: "!" }) },
    { type: BINARY_RIGHT, ops: operators({ Exponentiate: "^" }) },
    { type: BINARY_LEFT, ops: operators({ Multiply: "*", Divide: "/" }) },
    { type: BINARY_LEFT, ops: operators({ Add: "+", Subtract: "-" }) },
    { type: BINARY_LEFT, ops: operators({ Fold: "," }) },
    { type: BINARY_RIGHT, ops: operators({ Compose: "->" }) },
];
// Start off with Num as the base parser for numbers and thread that through the
// entire table of operator parsers.
const tableParser = table.reduce((acc, level) => level.type(level.ops, acc), Basic);
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
const RtmlExpr = tableParser.trim(_);
const RtmlEquation = P.seq(ident.skip(whitespace).skip(equal), RtmlExpr).skip(whitespace).skip(semicolon).skip(comment)
    .map(([name, expr]) => ({ [name]: expr }));
const RtmlSpec = comment.then(RtmlEquation.skip(whitespace)).many().skip(P.eof)
    .map((equationArr) => equationArr.reduce((acc, obj) => (Object.assign({}, acc, obj))));
///////////////////////////////////////////////////////////////////////
exports.parseF = (spec) => new Future((reject, resolve) => {
    try {
        resolve(RtmlSpec.tryParse(spec));
    }
    catch (err) {
        reject(err);
    }
});
exports.ast2TagNames = (acc) => (tagTreeNode) => {
    if (typeof (tagTreeNode) === "string") {
        return acc;
    }
    let updated = [...acc];
    let childTags = [];
    if (Array.isArray(tagTreeNode)) {
        childTags = (tagTreeNode.children || []).map(exports.ast2TagNames(updated));
    }
    else {
        const tag = tagTreeNode.tag;
        if (!acc.includes(tag)) { // already exists
            updated = [...acc, tag];
        }
        childTags = (tagTreeNode.children || []).map(exports.ast2TagNames(updated));
    }
    return R.uniq(R.flatten([...updated, ...childTags]));
};
const compositeNode = (defs) => {
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
// module.exports = { parseF };
function test() {
    function prettyPrint(x) {
        let opts = { depth: null, colors: "auto" };
        let s = util.inspect(x, opts);
        console.log(s);
    }
    prettyPrint(RtmlExpr.tryParse(`2 + 3 * 4 / 2`));
    prettyPrint((RtmlEquation.tryParse(`foo = div->((span)->a)->(span,div);`)));
    prettyPrint((RtmlSpec.tryParse(`
    foo = div->((span)->a)->(span,div);
        bar = div->((span)->a)->(span,div);
text =
"some text";
tagonly = cpugraph;
page = header, body, footer;
body = div -> span(color="red") -> "body here";
header = hamburger, menus, settings;
footer = copyright;
if2 = div -> If(cond="$p:user.loggedIn" component="UserProfile" user="$p:user" else_="NotLoggedIn");

page2 = (header, body, footer);
body2 = (div -> span(color="red") -> "body here");

page3 = header, body, footer;
`)));
    // console.log(RtmlSpec.tryParse(`page = a -> b; `));
}
//# sourceMappingURL=parserV5.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const string_1 = require("parser-ts/lib/string");
const parser_ts_1 = require("parser-ts");
const char_1 = require("parser-ts/lib/char");
const spaces = string_1.spaces.map(_ => " ");
const ident = parser_ts_1.fold([string_1.many1(char_1.letter), char_1.many(char_1.alphanum)]);
const equal = char_1.char('=');
const dot = char_1.char('.');
const parenL = char_1.char('(');
const parenR = char_1.char(')');
const decimal = parser_ts_1.fold([char_1.many(char_1.digit), dot, char_1.many(char_1.digit)]);
const integer = char_1.many(char_1.digit);
const numeric = parser_ts_1.either(decimal, integer);
const trueP = parser_ts_1.fold(["t", "r", "u", "e"].map(char_1.char));
const falseP = parser_ts_1.fold(["f", "a", "l", "s", "e"].map(char_1.char));
const bool = parser_ts_1.either(trueP, falseP);
const attrVal = parser_ts_1.alts(bool, string_1.doubleQuotedString, numeric);
const compAttr = parser_ts_1.fold([ident, equal, attrVal, spaces]);
const attrList = char_1.many(parser_ts_1.fold([parenL, char_1.many(compAttr), parenR]));
const tag = parser_ts_1.fold([spaces, ident, spaces, attrList, spaces,]);
const space = char_1.char(' ');
const spacesN = (n) => parser_ts_1.fold(ramda_1.range(0, n).map(_ => space));
class Parsed {
    // tslint:disable-next-line:no-any
    constructor(_type, _value) {
        this.value = [_type, _value];
    }
}
const fold2 = (arr) => {
    return arr.reduce((acc, val) => acc.applySecond(val));
};
const fold3 = (arr) => {
    // tslint:disable-next-line:no-any
    const seedval = new Parsed("seed", new Array(0));
    const seed = parser_ts_1.succeed(seedval);
    const iter = (accP, valP) => accP.chain((accParsed) => valP.map((valParsed) => {
        switch (valParsed.value[0]) {
            case "seed":
            case "spaces":
                return accParsed;
            case "children":
                {
                    // tslint:disable-next-line:no-any
                    const children = valParsed.value[1].value[1];
                    if (children.length === 0) {
                        return accParsed;
                    }
                    console.log("chi***ldren");
                }
                break;
            default: break;
        }
        // tslint:disable-next-line:no-any
        const arr2 = accParsed.value;
        return new Parsed("folded", [...arr2, valParsed]);
    }));
    return arr.reduce(iter, seed);
};
// TODO: Add contents parsing (inside tag)
const parseTagTrees = (indentLevel = 0) => {
    const indent = spacesN(indentLevel + 2);
    const indent2 = indent.map((val) => new Parsed("indent", val));
    // tslint:disable-next-line:no-any
    const tag2 = tag.map((val) => new Parsed("tag", val.replace(/[ \n\t]+/, " ").trim()));
    const spaces2 = spaces.map((val) => new Parsed("spaces", val));
    const children3B = fold3([indent2, tag2, spaces2]).map((parsedChildren) => {
        const mergedVal = new Parsed("children", parsedChildren);
        console.log("*** Merged", mergedVal);
        return mergedVal;
        // return new Parsed("children", mergedVal);
    });
    const children3C = parser_ts_1.many(children3B).map((parsedChildren) => {
        const mergedVal = new Parsed("children", parsedChildren.map(pc => pc.value));
        // console.log("*** Merged", mergedVal);
        return new Parsed("children", mergedVal);
    });
    return parser_ts_1.many(fold3([tag2, children3C,]));
};
class TagTree {
    constructor(tree) {
        this.tree = tree;
    }
    toString() { return this.tree; }
}
const test3 = (input) => {
    const parser = parseTagTrees();
    return parser
        .map((x) => new Parsed("tagtree", x))
        .run(input)
        .mapLeft(msg => console.log("Failed parsing input", msg))
        // tslint:disable-next-line:no-any
        .map((result) => {
        const value = JSON.stringify(result[0], null, 2);
        // console.log(`value: ***\n[${value}]\n***\nremaining:[${result[1]}]`);
    });
};
const input = `
Page
  Header1Component(a=1
      x=true b=2.2 c="some string"
          y=false z=true)
    span (color="green")
      span (width=20)
        span (width=20)
    foobar (x="fsd")

  Body
    div
      span
        span

  Footer
    copyright
  `;
test3(input);
//# sourceMappingURL=parser.js.map
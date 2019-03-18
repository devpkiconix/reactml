import { range } from "ramda";
import { doubleQuotedString, spaces as strspaces, many1, } from "parser-ts/lib/string";
import { fold, either, alts, Parser, seq, maybe, second, many as manyGeneric, succeed } from "parser-ts";
import { alphanum, letter, many as manyString, char, digit } from "parser-ts/lib/char";
import { ParserCtx } from "./parser-generic";

const spaces = strspaces.map(_ => " ");
const ident = fold([many1(letter), manyString(alphanum)]);

const equal = char('=');
const dot = char('.');
const parenL = char('(');
const parenR = char(')');

const decimal = fold([manyString(digit), dot, manyString(digit)]);
const integer = manyString(digit);
const numeric = either(decimal, integer);
const trueP = fold(["t", "r", "u", "e"].map(char));
const falseP = fold(["f", "a", "l", "s", "e"].map(char));
const bool = either(trueP, falseP);
const attrVal = alts(bool, doubleQuotedString, numeric);
const compAttr = fold([ident, equal, attrVal, spaces]);
const attrList = manyString(fold([parenL, manyString(compAttr), parenR]));
const tag = fold([spaces, ident, spaces, attrList, spaces,]);

const space = char(' ');

const spacesN = (n: number) => fold(range(0, n).map(_ => space));

class Parsed<T> {
    value: [string, T];
    // tslint:disable-next-line:no-any
    constructor(_type: string, _value: T) {
        this.value = [_type, _value];
    }
}

const fold2 = <A>(arr: Array<Parser<A>>): Parser<A> => {
    return arr.reduce((acc, val) => acc.applySecond(val));
};

const fold3 = <T>(arr: Array<Parser<Parsed<T>>>): Parser<Parsed<T[]>> => {
    // tslint:disable-next-line:no-any
    const seedval: Parsed<T[]> = new Parsed("seed", new Array<T>(0));
    const seed: Parser<Parsed<T[]>> = succeed(seedval);
    const iter = (accP: Parser<Parsed<T[]>>, valP: Parser<Parsed<T>>) =>
        accP.chain((accParsed: Parsed<T[]>) =>
            valP.map((valParsed: Parsed<T>) => {
                switch (valParsed.value[0]) {
                    case "seed":
                    case "spaces":
                        return accParsed;
                    case "children": {
                        // tslint:disable-next-line:no-any
                        const children = (valParsed.value[1] as unknown as any).value[1];
                        if (children.length === 0) {
                            return accParsed;
                        }
                        console.log("chi***ldren");
                    }
                        break;
                    default: break;
                }
                // tslint:disable-next-line:no-any
                const arr2: any[] = accParsed.value as any[];
                return new Parsed("folded", [...arr2, valParsed]);
            }));
    return arr.reduce(iter, seed);
};

// TODO: Add contents parsing (inside tag)

const parseTagTrees = (indentLevel = 0) => {
    const indent = spacesN(indentLevel + 2);
    const indent2: Parser<Parsed<string>> = indent.map((val) => new Parsed("indent", val));
    // tslint:disable-next-line:no-any
    const tag2: Parser<Parsed<any>> = tag.map((val) => new Parsed("tag", val.replace(/[ \n\t]+/, " ").trim()));
    const spaces2: Parser<Parsed<string>> = spaces.map((val) => new Parsed("spaces", val));

    const children3B = fold3([indent2, tag2, spaces2]).map((parsedChildren) => {
        const mergedVal = new Parsed("children", parsedChildren);
        console.log("*** Merged", mergedVal);
        return mergedVal;
        // return new Parsed("children", mergedVal);
    });
    const children3C = manyGeneric(children3B).map((parsedChildren) => {
        const mergedVal = new Parsed("children", parsedChildren.map(pc => pc.value));
        // console.log("*** Merged", mergedVal);
        return new Parsed("children", mergedVal);
    });

    return manyGeneric(fold3([tag2, children3C,]));
};

class TagTree {
    constructor(public tree: string) { }
    toString() { return this.tree; }
}

const test3 = (input: string) => {
    const parser = parseTagTrees();
    return parser
        .map((x) => new Parsed("tagtree", x))
        .run(input)
        .mapLeft(msg => console.log("Failed parsing input", msg))
        // tslint:disable-next-line:no-any
        .map((result: [Parsed<any>, string]) => {
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
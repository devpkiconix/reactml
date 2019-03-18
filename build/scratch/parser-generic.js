"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:array-type
// tslint:disable:semicolon
const Option_1 = require("fp-ts/lib/Option");
const P = require("parser-ts");
const C = require("parser-ts/lib/char");
const Either_1 = require("fp-ts/lib/Either");
;
exports.emptyVal = {
    value: null, consumed: '', remaining: ''
};
const of = (a) => new P.Parser(s => P.createParseSuccess(a, s));
const empty = of(exports.emptyVal);
/**
 * The `maybe` parser combinator creates a parser which will run the provided
 * parser on the input, and if it fails, it will returns the empty string (as
 * a result, without consuming any input.
 */
exports.maybe = (parser) => parser.alt(empty);
/**
 * Matches the given parser zero or more times, returning a string of the
 * entire match
 */
function many(parser) {
    return exports.maybe(many1(parser));
}
exports.many = many;
/**
 * Matches the given parser one or more times, returning a string of the
 * entire match
 */
function many1(parser) {
    return many1(parser); //.map(nea => nea.toArray().join(''))
}
exports.many1 = many1;
function getAndNext(s, prefix) {
    const i = s.indexOf(prefix);
    if (i === 0) {
        return Option_1.some([prefix, s.substring(prefix.length)]);
    }
    return Option_1.none;
}
exports.getAndNext = getAndNext;
/** Matches the exact string provided. */
function string(prefix) {
    return new P.Parser(s => getAndNext(s, prefix).foldL(() => P.createParseFailure(s, JSON.stringify(prefix)), ([c, s]) => {
        const res = ({
            value: c, consumed: c, remaining: s
        });
        return Either_1.right([res, s]);
    }));
}
exports.string = string;
/** Matches one of a list of strings. */
function oneOf(ss) {
    return P.expected(P.alts(...ss.map(string)), `one of ${JSON.stringify(ss)}`);
}
exports.oneOf = oneOf;
/** Matches zero or more whitespace characters. */
exports.spaces = C.many(C.space);
/** Matches one or more whitespace characters. */
exports.spaces1 = C.many1(C.space);
/** Matches zero or more non-whitespace characters. */
exports.notSpaces = C.many(C.notSpace);
/** Matches one or more non-whitespace characters. */
exports.notSpaces1 = C.many1(C.notSpace);
//# sourceMappingURL=parser-generic.js.map
// tslint:disable:array-type
// tslint:disable:semicolon
import { none, Option, some } from 'fp-ts/lib/Option'
import * as P from 'parser-ts';
import * as C from 'parser-ts/lib/char';
import { right, Either } from 'fp-ts/lib/Either';

export interface ParserCtx {
    // tslint:disable-next-line:no-any
    value: any;
    consumed: string;
    remaining: string;
};

export const emptyVal: ParserCtx = {
    value: null, consumed: '', remaining: ''
}

const of = <A>(a: A): P.Parser<A> => new P.Parser(s => P.createParseSuccess(a, s))
const empty: P.Parser<ParserCtx> = of(emptyVal)
/**
 * The `maybe` parser combinator creates a parser which will run the provided
 * parser on the input, and if it fails, it will returns the empty string (as
 * a result, without consuming any input.
 */
export const maybe = (parser: P.Parser<ParserCtx>): P.Parser<ParserCtx> => parser.alt(empty)

/**
 * Matches the given parser zero or more times, returning a string of the
 * entire match
 */
export function many(parser: P.Parser<ParserCtx>): P.Parser<ParserCtx> {
    return maybe(many1(parser))
}

/**
 * Matches the given parser one or more times, returning a string of the
 * entire match
 */
export function many1(parser: P.Parser<ParserCtx>): P.Parser<ParserCtx> {
    return many1(parser)//.map(nea => nea.toArray().join(''))
}

export function getAndNext(s: string, prefix: string): Option<[string, string]> {
    const i = s.indexOf(prefix)
    if (i === 0) {
        return some<[string, string]>([prefix, s.substring(prefix.length)])
    }
    return none;
}

/** Matches the exact string provided. */
export function string(prefix: string): P.Parser<ParserCtx> {
    return new P.Parser(s =>
        getAndNext(s, prefix).foldL(
            () => P.createParseFailure(s, JSON.stringify(prefix)),
            ([c, s]): Either<P.ParseFailure, P.ParseSuccess<ParserCtx>> => {
                const res: ParserCtx = ({
                    value: c, consumed: c, remaining: s
                });
                return right<P.ParseFailure, P.ParseSuccess<ParserCtx>>([res, s])
            }));
}

/** Matches one of a list of strings. */
export function oneOf(ss: Array<string>): P.Parser<ParserCtx> {
    return P.expected(P.alts(...ss.map(string)), `one of ${JSON.stringify(ss)}`)
}

/** Matches zero or more whitespace characters. */
export const spaces = C.many(C.space)

/** Matches one or more whitespace characters. */
export const spaces1 = C.many1(C.space)

/** Matches zero or more non-whitespace characters. */
export const notSpaces = C.many(C.notSpace)

/** Matches one or more non-whitespace characters. */
export const notSpaces1 = C.many1(C.notSpace)
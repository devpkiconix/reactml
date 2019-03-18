import { readFile, writeFile, } from 'fs';
import Future from "fluture";
import { FutVal } from './rtml-types';
import { format } from 'prettier';
import { codegenSpec } from './codegen';
import prettify from './prettify';
import mapObjIndexed from 'ramda/es/mapObjIndexed';

const buf2str = (buf: Buffer) => buf.toString();

const readInput = (fn: string): FutVal<Buffer> =>
    Future((rej, res) =>
        readFile(fn, (err, buf) => err ? rej(err) : res(buf)));

const writeOutput = (fileName: string) => (content: string): FutVal<void> =>
    Future((rej, res) =>
        writeFile(fileName, content, (err) => err ? rej(err) : res(undefined)));


export const codegen = (inputFile: string, outputFile: string): FutVal<void> =>
    readInput(inputFile)
        .map(buf2str)
        .chain(codegenSpec)
        .map(prettify)
        .chain(writeOutput(outputFile));

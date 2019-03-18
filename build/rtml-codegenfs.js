"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const fluture_1 = require("fluture");
const rtml_codegen_1 = require("./rtml-codegen");
const prettify_1 = require("./prettify");
const buf2str = (buf) => buf.toString();
const readInput = (fn) => fluture_1.default((rej, res) => fs_1.readFile(fn, (err, buf) => err ? rej(err) : res(buf)));
const writeOutput = (fileName) => (content) => fluture_1.default((rej, res) => fs_1.writeFile(fileName, content, (err) => err ? rej(err) : res(undefined)));
exports.codegen = (functionName, inputFile, outputFile) => readInput(inputFile)
    .map(buf2str)
    .chain(rtml_codegen_1.codegenStr(functionName))
    .map(prettify_1.default)
    .chain(writeOutput(outputFile));
//# sourceMappingURL=rtml-codegenfs.js.map
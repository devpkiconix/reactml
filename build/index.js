"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = require("./webpack");
exports.loader = webpack_1.default;
const rtmlVocab_1 = require("./rtmlVocab");
exports.newVocab = rtmlVocab_1.newVocab;
const render_1 = require("./render");
exports.Rtml = render_1.Rtml;
const codegen_1 = require("./codegen");
exports.codegenSpec = codegen_1.codegenSpec;
//# sourceMappingURL=index.js.map
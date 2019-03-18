"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("./codegen");
const loader = (compName) => (rtml) => new Promise((resolve, reject) => codegen_1.codegenSpec(rtml)
    .fork(reject, resolve));
// tslint:disable-next-line:no-default-export
exports.default = loader;
//# sourceMappingURL=webpack.js.map
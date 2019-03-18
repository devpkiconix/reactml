"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prettier_1 = require("prettier");
// tslint:disable-next-line:no-default-export
exports.default = (code) => prettier_1.format(code, { parser: "babel" });
//# sourceMappingURL=prettify.js.map
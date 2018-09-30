"use strict";

var _codegen = require("./codegen");

var _codegen2 = _interopRequireDefault(_codegen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var srcFile = process.argv[2];
var destDir = process.argv[3];

if (srcFile && destDir) {
	(0, _codegen2.default)(srcFile, destDir);
} else {
	console.log("Please pass src file name and dest dir");
}
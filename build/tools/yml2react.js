"use strict";

var _codegen = require("./codegen");

var srcFile = process.argv[2];
var destDir = process.argv[3];

if (srcFile && destDir) {
	if (/.yml$|.yaml$/.test(srcFile)) {
		(0, _codegen.codegenYamlWatch)(srcFile, destDir);
	}if (/.json$/.test(srcFile)) {
		codegenJsonWatch(srcFile, destDir);
	} else {}
} else {
	console.log("Please pass src file name and dest dir");
}
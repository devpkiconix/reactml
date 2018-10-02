import { codegenYamlWatch, codegenJson } from './codegen';

const srcFile = process.argv[2];
const destDir = process.argv[3];

if ( (srcFile && destDir)) {
	if (/.yml$|.yaml$/.test(srcFile)) {
		codegenYamlWatch(srcFile, destDir);
	} 	if (/.json$/.test(srcFile)) {
		codegenJsonWatch(srcFile, destDir);
	} else {


	}

} else {
	console.log("Please pass src file name and dest dir")
}


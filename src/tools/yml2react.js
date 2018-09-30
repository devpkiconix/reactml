import codegen from './codegen';

const srcFile = process.argv[2];
const destDir = process.argv[3];

if ( (srcFile && destDir)) {
codegen(srcFile, destDir);

} else {
	console.log("Please pass src file name and dest dir")
}


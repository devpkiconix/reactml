import {readFileSync, writeFileSync} from 'fs';
import yamlLib from 'js-yaml';
const R = require('ramda');

const parse = (x) => yamlLib.safeLoad(x);

const srcFile = process.argv[2];

if ( !srcFile) {
	console.log("Please pass src file name")
	process.exit(1);
}

const readFile = file => readFileSync(file);
const writeFile = file => content =>  writeFileSync(file, content);
const jsonGen = (obj) => JSON.stringify(obj, null, 2);

const outFileName = srcFile.replace(/.yml$|.yaml$/, '.js');

const main = R.compose(
	writeFile(outFileName),
	jsonGen,
	parse,
	readFile
)

main(srcFile)
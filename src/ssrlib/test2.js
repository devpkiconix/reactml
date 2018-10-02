import { readFileSync } from 'fs';
import { renderYaml } from './index';
const R = require('ramda');

const srcFile = process.argv[2];

if ( !srcFile) {
	console.log("Please pass src file name")
	process.exit(1);
}
const readFile = file => readFileSync(file);

const main = R.compose(
	renderYaml,
	String,
	readFile
)

const appRenderer = main(srcFile)
console.log(appRenderer('App'))
// // .then(appRenderer('App'))
// .then(console.log)
// .catch(console.log);


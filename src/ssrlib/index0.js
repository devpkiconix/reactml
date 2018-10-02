import { readFileSync } from 'fs';

import {
	codegenJs2Str,
	parseJson,
	parseYaml,
} from '../tools/codegen.js';

import { composeP, prop } from 'ramda';

const tap = (msg) => x => {
	console.log(msg, x);
	return x;
};
const readFile = file => readFileSync(file);

const renderComp = (Component) => <Component />;

const render = (yaml, compName) => composeP(
	renderComp,
	prop(compName),
	renderYaml
);

/**
 * Given a component name, returns a function
 * which will return rendered HTML, given YAML
 * string as input.
 */
export const renderYaml = yaml =>
	Promise.resolve(yaml)
	// .then(tap('start ' + compName + ' ' + srcFile ))
	.then(parseYaml)
	.then(tap("before codegen"))
	.then(codegenJs2Str)
	.then(tap("after codegen"))
	// .then(render(compName))

/**
 * Given a component name, returns a function
 * which will return rendered HTML, given JSON
 * string as input.
 */
export const renderJson = jsonStr =>
	Promise.resolve(jsonStr)
	.then(parseJson)
	.then(codegenJs2Str)
	// .then(renderComp(compName))


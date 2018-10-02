import {
	parseJson,
	parseYaml,
} from '../tools/codegen.js';
import { compose, composeP, prop } from 'ramda';

const tap = (msg) => x => {
	console.log(msg, x);
	return x;
}
/**
 * Given a component name, returns a function
 * which will return rendered HTML, given JSON
 * string as input.
 */
export const renderJson = compName => x =>
	Promise.resolve(x)
	.then(parseJson)
	.then(codegenJs2Str)
	// .then(tap('all results' + compName))
	.then(render(compName))

const render = compName => renderComp(compName);

const renderComp = compName => x => `<${compName} value={${x[compName]}}/>`


const codegenJs2Str = (obj) => Promise.resolve({
	...obj, x: 10,
});



const input = JSON.stringify({a: 34});
renderJson('x')(input).then(console.log).catch(console.log);


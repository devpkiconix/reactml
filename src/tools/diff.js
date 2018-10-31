/**
 * Diffing support to determine if a file needs to be re-generated.
 */
const R = require('ramda');
const hash = require('object-hash');

/**
 * Diff two component definitions
 */
const diff = (version1, version2) => hash(version1) === hash(version2);

/**
 * Lookup component def in a previous spec and
 * return null if identical, else return new component def.
 */
const compare2 = (prevVersion) => (compDef, name) => ({
	...compDef,
	// Set a flag in component def indicating whether this
	// component code should be re-generated or not.
	codegenFlag: diff(prevVersion[name] || 0, compDef) ? false : true,
})

/**
 * Compare with a previous spec and return components
 * that have changed. Unchanged items are removed.
 */
const findChangedPure = (prev) => R.compose(
    // R.tap(x => console.log('before filter', x)),
    R.mapObjIndexed(compare2(prev))
);

/**
 * Similar to findChangedPure - except now we save the new
 * components in global 'gPrevVersion' for next iteration.
 *
 * @prev - prev table with name-> comp def mapping
 * savePrev - function to save current table as prev for next iteration
 */
export const findChanged = (prev, savePrev) => (components) => {
    const diff = findChangedPure(prev)(components);
    savePrev(components);
    return diff;
};

// Table holding list previous component defintions from previous
// code generation cycle.  We diff definition in this table against
// the latest version before generating JS file.
let gPrevVersion = {};

// Save new version to prevVersion
export const setPrevVersion = (components) => (gPrevVersion = components);
// for testing
export const clearPrevVersion = () => setPrevVersion({});

const getPrevVersion = () => gPrevVersion;

// For use in composition
export const composableDiff = () => findChanged(getPrevVersion(), setPrevVersion);


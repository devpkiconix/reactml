import { fromJS } from 'immutable';
import { curry } from 'ramda';
import yamlLib from 'js-yaml';

export const toYaml = (x) => yamlLib.safeDump(x, { indent: 2 });
export const fromYaml = (x) => yamlLib.safeLoad(x);

export const dispatchFieldUpdate = (dispatch, name, value) =>
    dispatch({ type: 'REACTML_UPDATE', name, value, });

export const reactmlFieldChangeHandler = (name) => (event) => (dispatch) => {
    dispatchFieldUpdate(dispatch, name, event.target.value);
}
export const reactmlFieldChangeValueHandler = (name) => (value) => (dispatch) => {
    dispatchFieldUpdate(dispatch, name, value);
}

export const setField = (dottedName, stateNodeName, value, state) =>
    state.setIn(stateNodeName ?
        (stateNodeName + '.' + dottedName).split('.') :
        dottedName.split('.'), value);

export const reactmlSpecChangeValueHandler = (name) => (value) => (dispatch) => {
    dispatchFieldUpdate(dispatch, name, value);
    try {
        const spec = fromYaml(value);
        const isValid = validateSpec(spec);
        if (isValid) {
            dispatchFieldUpdate(dispatch, 'spec', fromJS(spec));
            dispatchFieldUpdate(dispatch, 'specError', null);
        }
    } catch (err) {
        dispatchFieldUpdate(dispatch, 'specError', err.toString());
    }
}


const validateSpec = (spec) => true; // for now

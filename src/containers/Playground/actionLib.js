import yamlLib from 'js-yaml';
import { curry } from 'ramda';
import {
    reactmlFieldChangeHandler, reactmlSpecChangeValueHandler,
    reactmlFieldChangeValueHandler, dispatchApplyYaml,
} from '../../modules/reactml/util';

const onEmailChange = reactmlFieldChangeHandler('playground.user.email');

const onFirstNameChange = reactmlFieldChangeHandler('playground.user.firstName');

const save = (event) => (dispatch) => {
    dispatch({
        type: 'REACTML_UPDATE',
        stateNodeName: 'playground',
        name: 'status.save',
        value: '(fake) saving..',
    });
    setTimeout(() => {
        dispatch({
            type: 'REACTML_UPDATE',
            stateNodeName: 'playground',
            name: 'status.save',
            value: '(fake) save successful',
        });
        setTimeout(() => {
            dispatch({
                type: 'REACTML_UPDATE',
                stateNodeName: 'playground',
                name: 'status.save',
                value: null,
            });
        }, 2000);
    }, 500)

};

const toYaml = (x) => yamlLib.safeDump(x, { indent: 2 });
const fromYaml = (x) => yamlLib.safeLoad(x);

const onChangeYaml = reactmlFieldChangeHandler('playground.specText');

const applyYaml = (event) => (dispatch) => {
    dispatch({
        type: 'REACTML_APPLY_YML',
        stateNodeName: 'playground',
        specTextName: 'specText', specName: 'spec'
    });
};

export default {
    onFirstNameChange, onEmailChange, save, toYaml, fromYaml,
    onChangeYaml, applyYaml,
};
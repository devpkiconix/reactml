import yamlLib from 'js-yaml';
import {
    reactmlFieldChangeHandler, reactmlSpecChangeValueHandler
} from '../../modules/reactml/util';

const onEmailChange = reactmlFieldChangeHandler('user.email');

const onFirstNameChange = reactmlFieldChangeHandler('user.firstName');

const save = (event) => (dispatch) => {
    dispatch({
        type: 'REACTML_UPDATE',
        name: 'status.save',
        value: '(fake) saving..',
    });
    setTimeout(() => {
        dispatch({
            type: 'REACTML_UPDATE',
            name: 'status.save',
            value: '(fake) save successful',
        });
        setTimeout(() => {
            dispatch({
                type: 'REACTML_UPDATE',
                name: 'status.save',
                value: null,
            });
        }, 2000);
    }, 500)

};

const toYaml = (x) => yamlLib.safeDump(x, { indent: 2 });
const fromYaml = (x) => yamlLib.safeLoad(x);

const onChangeYaml = reactmlFieldChangeHandler('specText');

export default {
    onFirstNameChange, onEmailChange, save, toYaml, fromYaml,
    onChangeYaml,
};
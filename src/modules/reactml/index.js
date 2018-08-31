import { fromJS } from 'immutable';
import { fromYaml, setField } from './util';
const initialState = fromJS({});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case 'REACTML_INIT':
            return fromJS(action.initial);
        case 'REACTML_UPDATE':
            return setField(action.name, action.value, state);
        case 'REACTML_APPLY_YML':
            return applyYml(state, action.specTextName, action.specName);
        default:
            break;

    }
    return state;
};

const applyYml = (state, textName, specName) => {
    try {
        const value = state.getIn([textName]);
        const spec = fromYaml(value);
        const isValid = validateSpec(spec);
        if (isValid) {
            return state.setIn(['spec'], fromJS(spec))
                .setIn('specError', null);
        }
    } catch (err) {
        return state.setIn(['specError'], err.toString());
    }
}


const validateSpec = (spec) => true; // for now

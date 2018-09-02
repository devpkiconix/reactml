import { fromJS } from 'immutable';
import { fromYaml, setField } from './util';

const initialState = fromJS({});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case 'REACTML_INIT':
            return state.set(action.stateNodeName, fromJS(action.initial));
        case 'REACTML_UPDATE':
            return setField(action.name, action.stateNodeName, action.value, state);
        case 'REACTML_APPLY_YML':
            return applyYml(state, action.stateNodeName, action.specTextName, action.specName);
        default:
            break;
    }
    return state;
};

const applyYml = (state, stateNodeName, textName, specName) => {
    try {
        const value = state.getIn([stateNodeName, textName]);
        const spec = fromYaml(value);
        const isValid = validateSpec(spec);
        if (isValid) {
            return state.setIn([stateNodeName].concat(specName.split('.'), fromJS(spec)))
                .setIn('specError', null);
        }
    } catch (err) {
        return state.setIn(['specError'], err.toString());
    }
}


const validateSpec = (spec) => true; // for now

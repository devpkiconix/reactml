import { fromJS } from 'immutable';
import { setField } from './util';

const initialState = fromJS({});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case 'REACTML_INIT':
            return fromJS(action.initial);
        case 'REACTML_UPDATE':
            return setField(action.name, action.value, state);
        default:
            break;

    }
    return state;
};


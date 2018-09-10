import { fromJS } from 'immutable';
import { createStore, applyMiddleware, compose } from 'redux'
import { combineReducers } from 'redux'
import reactmlReducer from '../../../modules/reactml';


const initialState = {};
// const rootReducer = (state, action) => state;


const rootReducer = combineReducers({
    reactml: reactmlReducer,
});

export default createStore(
    rootReducer,
    initialState
);

// import configureStore from 'redux-mock-store';

// const middlewares = []
// const mockStore = configureStore(middlewares)
// export default mockStore(initialState);
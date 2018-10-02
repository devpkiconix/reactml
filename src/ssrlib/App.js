
import { readFileSync } from 'fs';
import { fromJS } from 'immutable';
import { compose } from 'ramda';

import * as React from 'react';
import ReactDOMServer from 'react-dom/server';

import { Switch, Route, Link } from 'react-router-dom';
import { MemoryRouter } from 'react-router';
// import { ConnectedRouter } from 'connected-react-router'

import { createStore, applyMiddleware, } from 'redux'
import { combineReducers } from 'redux'
import reactmlReducer from '../modules/reactml';
import { Provider } from 'react-redux';

import createHistory from 'history/createMemoryHistory'

import { ReactML, } from '../components/reactml/ReactML';
import ReactMLHoc from '../components/reactml/ReactMLHoc';
import ReactMLArrayMapper from '../components/reactml/ArrayMapper';

import reducer from '../modules/reactml';
import { prettify, } from '../tools/codegen.js';

import {
	reactmlFieldChangeHandler,
	dispatchFieldUpdate,
	fromYaml, toYaml,
} from '../modules/reactml/util';

import materialUiTagFactory from '../components/reactml/materialUiTagFactory';


const defaultTagFactory = {
	...materialUiTagFactory, ReactMLArrayMapper,
	Switch, Route, Link,
};


const rootReducer = combineReducers({
	reactml: reactmlReducer,
});

const yamlComp2App = yaml => route => {
	const appTagFactory = defaultTagFactory;
	const actionLib = {};

	const spec = fromYaml(yaml);

	const App = ReactMLHoc(spec, actionLib, appTagFactory,
		spec.state.stateNodeName || 'inputFlow',
		'App');
	const store = createStore(
		rootReducer,  { reactml: fromJS({
			inputFlow: spec.state.initial,
		})});

	return (props) => (
		<Provider store={store}>
			<MemoryRouter initialEntries={[ route ]}>
				<App />
			</MemoryRouter>
		</Provider>);
};


const readFile = file => readFileSync(file);
const main = compose(
	yamlComp2App,
	String,
	readFile
);

if (! process.env.YML_SPEC) {
	console.error("YML_SPEC env variable not set.")
	process.exit(1);
}
export default main;
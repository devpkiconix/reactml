import { fromJS } from 'immutable';

import * as React from 'react';
import ReactDOMServer from 'react-dom/server';

import { Switch, Route, Link } from 'react-router-dom';
import { MemoryRouter } from 'react-router';
// import { ConnectedRouter } from 'connected-react-router'

import { createStore, applyMiddleware, compose } from 'redux'
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

export const renderYaml = yaml => compName => {
	const appTagFactory = defaultTagFactory;
	const actionLib = {};

	const spec = fromYaml(yaml);

	const App = ReactMLHoc(spec, actionLib, appTagFactory,
		'inputFlow', compName);
	const store = createStore(
		rootReducer,  { reactml: fromJS({
			inputFlow: spec.state.initial,
		})});

	const element = <html>
	<body>
		<Provider store={store}>
			<MemoryRouter initialEntries={[ '/' ]}>
				<App />
			</MemoryRouter>
		</Provider>
	</body>
	</html>;

	return prettify(
		ReactDOMServer.renderToString(element)
	);
}
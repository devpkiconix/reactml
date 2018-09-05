import { ReactML, } from './components/reactml/ReactML';
import ReactMLHoc from './components/reactml/ReactMLHoc';
import ReactMLArrayMapper from './components/reactml/ArrayMapper';

import reducer from './modules/reactml';

import {
	reactmlFieldChangeHandler,
	dispatchFieldUpdate,
	fromYaml, toYaml,
} from './modules/reactml/util';

import materialUiTagFactory from './components/reactml/materialUiTagFactory';

export default {
  ReactML, ReactMLHoc, ReactMLArrayMapper,
  reducer,
  materialUiTagFactory,
  reactmlFieldChangeHandler, fromYaml, toYaml, dispatchFieldUpdate
};
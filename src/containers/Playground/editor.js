import ReactMLHoc from '../../components/reactml/ReactMLHoc';
import exampleSpec from './example.yml'
import actionLib from './actionLib';

import muiTagFactory from '../../components/reactml/materialUiTagFactory';

import Status from './Status';

const tagFactory = {
    ...muiTagFactory, Status,
};

export default ReactMLHoc(exampleSpec, actionLib, tagFactory, 'playground', 'Editor');

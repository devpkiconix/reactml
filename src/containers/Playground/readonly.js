import ReactMLHoc from '../../components/reactml/ReactMLHoc';
import exampleSpec from './example.yml'
import actionLib from './actionLib';

const tagFactory = {};

export default ReactMLHoc(exampleSpec, actionLib, tagFactory,
    'playground', 'ReadOnly');

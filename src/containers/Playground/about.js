import ReactMLHoc from '../../components/reactml/ReactMLHoc';
import exampleSpec from './example.yml'
import actionLib from './actionLib';

const TagFactory = {};

export default ReactMLHoc(exampleSpec, actionLib, TagFactory, 'about', 'About');

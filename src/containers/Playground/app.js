
import { Route, Switch, } from 'react-router' // react-router v4
import ReactMLHoc from '../../components/reactml/ReactMLHoc';
import actionLib from './actionLib';
import ReadOnly from './readonly';
import Editor from './editor';
import About from './about';

import { Link } from 'react-router-dom'

import spec from './app.yml'

const tagFactory = {
    Switch, Route, Link, ReadOnly, Editor, About,
};

export default ReactMLHoc(spec, actionLib, tagFactory,
    'playapp', 'App');


import ReactMLHoc from '../../components/reactml/ReactMLHoc';
import actionLib from './actionLib';
import ReadOnly from './readonly';
import Editor from './editor';
import About from './about';

import { Route, Switch, } from 'react-router' // react-router v4
import { Link } from 'react-router-dom'

import appSpec from './app.yml'

const tagFactory = {
    Switch, Route, Link, ReadOnly, Editor, About,
};

export default ReactMLHoc(appSpec, actionLib, tagFactory,
    'playapp', 'App');

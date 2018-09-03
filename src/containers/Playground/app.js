import React from 'react'
// For this demo, we are using the UMD build of react-router-dom
import { Switch, Route, Link } from 'react-router-dom';
import ReactMLHoc from '../../components/reactml/ReactMLHoc';
import actionLib from './actionLib';
import ReadOnly from './readonly';
import Editor from './editor';
import About from './about';

import appbarSpec from './header.yml'
import appSpec from './app.yml'
import routeSpec from './switch.yml'

const NavRoutes = (props) => <Switch>
    <Route exact={true} path='/' component={ReadOnly} />
    <Route exact={true} path='/reactml/view' component={ReadOnly} />
    <Route exact={true} path='/reactml/editor' component={Editor} />
    <Route exact={true} path='/reactml/about' component={About} />
</Switch>;


const tagFactory = () => ({
    Switch, Route, Link, ReadOnly, Editor, About, Appbar, NavRoutes,
});

const Appbar = ReactMLHoc(appbarSpec, actionLib, tagFactory(),
    'links', 'Header')

const App = () => (
    <div>
        <Appbar />
        <main>
            <NavRoutes />
        </main>
    </div>
)

export default App;


// The following does not work for some resaon!
// The link navigation doesn't do anything

// export default ReactMLHoc(appSpec, actionLib, tagFactory(),
//         'playapp', 'App');


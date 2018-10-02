import React from 'react'
import ReactMLHoc from './ReactMLHoc';
import { Route } from 'react-router-dom';

// courtesy: https://gist.github.com/acdlite/a68433004f9d6b4cbc83b5cc3990c194
// consider this instead: https://github.com/ctrlplusb/react-async-component
function asyncComponent(getComponent) {
    let Component = null;
    return class AsyncComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = { Component };
        }

        componentWillMount() {
            if (!Component) {
                getComponent().then(C => {
                    Component = C;
                    this.setState({Component});
                });
            }
        }
        render() {
            if (Component) {
                return <Component {...this.props} />
            }
            return null
        }
    }
}


const ReactMLRoutes = (props) => {
    if (!props.tagFactory) {
        return <div> loading.. </div>;
    }
    const {routes, tagFactory, actionLib, stateNodeName, spec} = props;
    const getAsyncComponent = (name) => () => {
        const Component = ReactMLHoc(spec, actionLib, tagFactory, 'playground', name);
        return Promise.resolve(Component);
    };

    const makeRoute = (path, i) => {
        const componentName = props[path];
        const component = asyncComponent(
            getAsyncComponent(componentName)
        );
        return (<Route key={i} exact path={path}
            component={component}/>);
    };

    return (<main>
       {Object.keys(routes).map(makeRoute)}
    </main>);
};

export default ReactMLRoutes;

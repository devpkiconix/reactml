import React from 'react';
import { connect } from 'react-redux';
import { ReactML } from '../../components/reactml/ReactML';

const ReactmlHoc = (spec, actionLib, tagFactory, stateNodeName, view) => {
    class View extends React.Component {
        componentDidMount() {
            // If initial state has been provided by YAML
            // and not already been initialized, then
            // generate a redux action to init state
            if (spec.state.initial &&
                this.props.stateInitialized === false) {

                this.props.dispatch({
                    type: 'REACTML_INIT', initial: {
                        ...spec.state.initial,
                        spec, actionLib, tagFactory,
                        stateNodeName,
                    },
                    stateNodeName,
                });
            }
        }

        render() {
            return (<ReactML
                tagFactory={tagFactory}
                stateNodeName={stateNodeName}
                spec={spec} component={view}
                actionLib={actionLib}
            />);
        }
    }

    const mapStateToProps = (state) => {
        const reactml = state.reactml;
        let stateInitialized = false;
        // If the state has already been initialized,
        // set a flag so we don't have to init on every HOC
        if (reactml.get(stateNodeName)) {
            stateInitialized = true;
        }
        return {stateInitialized};
    };
    return connect(mapStateToProps)(View);
}


export default ReactmlHoc;

import React from 'react';
import { connect } from 'react-redux';
import { ReactML } from '../../components/reactml/ReactML';

const ReactmlHoc = (spec, actionLib, tagFactory, stateNodeName, view) => {
    class View extends React.Component {
        componentDidMount() {
            if (spec.state.initial) {
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

    const mapStateToProps = (state) => { return {} };
    return connect(mapStateToProps)(View);
}


export default ReactmlHoc;
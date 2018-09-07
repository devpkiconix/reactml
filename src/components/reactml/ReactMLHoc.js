import React from 'react';
import { connect } from 'react-redux';
import { ReactML } from '../../components/reactml/ReactML';

const stateInitHoc = (spec, lib, tagFactory, stateNodeName, view) => {
    class View extends React.Component {
        componentDidMount() {
            if (spec.state.initial) {
                this.props.dispatch({
                    type: 'REACTML_INIT', initial: {
                        ...spec.state.initial,
                    },
                    stateNodeName,
                });
            }
        }

        render() {
            debugger

            return (<ReactML
                tagFactory={tagFactory}
                stateNodeName={stateNodeName}
                spec={spec} component={view}
                actionLib={lib}
            />);
        }
    }

    const mapStateToProps = (state) => { return {} };
    return connect(mapStateToProps)(View);
}


export default stateInitHoc;
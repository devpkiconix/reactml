import React from 'react';
import { connect } from 'react-redux';
import { ReactML } from '../../components/reactml/ReactML';
import Paper from '@material-ui/core/Paper';
import { toYaml } from '../../modules/reactml/util';

const hoc = (spec, lib, tagFactory, stateNodeName, view) => {
    class View extends React.Component {
        componentDidMount() {
            this.props.dispatch({
                type: 'REACTML_INIT', initial: {
                    ...spec.state.initial,
                },
                stateNodeName,
            })
        }

        render() {
            return (
                <Paper style={{ backgroundColor: 'lightGray' }}>
                    <ReactML
                        tagFactory={tagFactory}
                        stateNodeName={stateNodeName}
                        spec={spec} component={view}
                        actionLib={lib}
                    />
                </Paper>);
        }
    }
    function mapStateToProps(state) { return {} }
    return connect(mapStateToProps, null)(View);
}

export default hoc;
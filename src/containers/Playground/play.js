import React from 'react';
import { connect } from 'react-redux';
import { ReactML } from '../../components/reactml/ReactML';
import muiTagFactory from '../../components/reactml/materialUiTagFactory';

import AceEditor from 'react-ace';
import 'brace/mode/yaml';
import 'brace/theme/tomorrow_night';
import 'brace/theme/solarized_dark';

import Paper from '@material-ui/core/Paper';

import exampleSpec from './example.yml'

import actionLib from './actionLib';
import Status from './Status';
import { toYaml } from '../../modules/reactml/util';

const
    TagFactory1 = {
        ...muiTagFactory, Status, AceEditor
    },
    TagFactory2 = {};

class Example extends React.Component {
    state = { showCode: false };

    componentDidMount() {
        this.props.dispatch({
            type: 'REACTML_INIT', initial: {
                ...this.props.spec.state.initial,
                specText: toYaml(this.props.spec),
            },
            stateNodeName: 'playground',
        })
    }

    render() {
        const { spec } = this.props;
        if (!spec) {
            return <div> Loading.. </div>;
        }
        return (<div>
            <Paper style={{ backgroundColor: 'lightGray' }}>
                <ReactML
                    tagFactory={TagFactory2}
                    stateNodeName={this.props.stateNodeName}
                    spec={spec} component='ReadOnly'
                    actionLib={actionLib}
                />
            </Paper>
            <Paper>
                <ReactML
                    tagFactory={TagFactory1}
                    stateNodeName={this.props.stateNodeName}
                    spec={spec} component='Editor'
                    actionLib={actionLib}
                />
            </Paper>
        </div>);
    }
}

function mapStateToProps(state) {
    const spec = state.reactml.getIn(['playground', 'spec']);
    if (spec) {
        return { spec: spec.toJS() }
    }
    return { spec: spec || exampleSpec };
}

export default connect(mapStateToProps)(Example);
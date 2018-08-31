import React from 'react';
import { connect } from 'react-redux';
import { ReactML } from '../../components/reactml/ReactML';
import muiTagFactory from '../../components/reactml/materialUiTagFactory';

import AceEditor from 'react-ace';
import 'brace/mode/yaml';
import 'brace/theme/tomorrow_night';
import 'brace/theme/solarized_dark';

import Paper from '@material-ui/core/Paper';

import editorSpec from './editor.yml'
import viewSpec from './readonly.yml'

import actionLib from './actionLib';
import Status from './Status';

const TagFactory1 = {
    ...muiTagFactory, Status, AceEditor
};

const TagFactory2 = {};

const initialState = {
    spec: editorSpec, viewSpec,
    specText: actionLib.toYaml(editorSpec),
    user: {
        name: 'foo',
        email: 'mynameisfoo@example.com',
        firstName: 'Foo',
        lastName: 'Barz',
        address: {
            street: '1234 main street',
            city: 'la la land',
            zip: '00000',
            state: 'restless',
            country: 'somewhere',
        },
    },
    status: {
        save: null,
    }
};


class Example extends React.Component {
    state = { showCode: false };

    componentDidMount() {
        this.props.dispatch({ type: 'REACTML_INIT', initial: initialState })
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
                    spec={viewSpec} page='ReadOnly'
                    actionLib={actionLib}
                />
            </Paper>
            <Paper>
                <ReactML
                    tagFactory={TagFactory1}
                    spec={spec} page='HomePage'
                    actionLib={actionLib}
                />
            </Paper>
        </div>);
    }
}

function mapStateToProps(state) {
    // console.log(JSON.stringify(sta te,nu ll,2));
    const spec = state.reactml.get('spec');
    if (spec) {
        return { spec: spec.toJS() }
    }
    return { spec: null };
}

export default connect(mapStateToProps)(Example);
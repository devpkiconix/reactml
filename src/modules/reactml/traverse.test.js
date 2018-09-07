import {
    __, curry, path as pathGet, map as RMap,
    mapObjIndexed, values
} from 'ramda';
import { expect } from 'chai';
import functions from './functions';
import { fromYaml, toYaml } from './util';
import { isString } from 'util';

const chaiImmutable = require('chai-immutable');

const { isLeaf, traverse, normalizeNode } = functions;


describe("tree traversal", () => {
    it("leaf test", () => {
        let spec = sampleSpec;
        let boolRes = isLeaf(spec.components.page1.view.children[0]);
        expect(boolRes).to.be.true;
        boolRes = isLeaf(spec.components.page1.view.children[1]);
        expect(boolRes).to.be.false;
    });
    it("basic traversal", () => {

        const tagGetter = (node) => node.tag;
        const propGetter = (val) => {
            if (isString(val)) {
                return val
                    .replace(/^\.\.\./, '+')
                    .replace(/^\.\./, '@')
                    .replace(/^\./, '*');
            }
            return val;
        };
        const basicRender = (tagGetter, props, children, node) => {
            const tag = tagGetter(node);

            // 'm' for mapped or modified
            return { tag, mprops: props, mchildren: children };
        };

        const treeWalker = traverse(basicRender, tagGetter, propGetter);
        const results = treeWalker(sampleSpec.components.page1.view);
        // console.log(JSON.stringify(results, null, 2));

        const node2 = results;
        expect(node2.tag).to.equal('div');
        expect(node2.mprops.id).to.equal(2);
        expect(node2.mchildren.length).to.equal(3);

        const node3 = node2.mchildren[0];
        expect(node3.mprops.id).to.equal(3);
        expect(node3.tag).to.equal('span');
        expect(node3.mchildren[0]).to.equal('*hello');

        const node4 = node2.mchildren[1];
        expect(node4.mprops.id).to.equal(4);

        const node5 = node4.mchildren[0];
        expect(node5.mprops.id).to.equal(5);
        expect(node5.mchildren[0]).to.equal('*world');

        const node6 = node2.mchildren[2];
        expect(node6.mprops.id).to.equal(6);

        const node7 = node6.mchildren[0];
        expect(node7.mprops.id).to.equal(7);
        expect(node7.mprops.icon).to.equal("+LogoComponent");

        const node8 = node6.mchildren[1];
        expect(node8.mprops.id).to.equal(8);
        expect(node8.mprops.icon).to.equal("+FloppyIcon");
        expect(node8.mprops.onClick).to.equal("@save");

    });

    it("react-style traversal", () => {

        const tagGetter = (node) => node.tag;
        const propGetter = (val) => {
            if (isString(val)) {
                return val
                    .replace(/^\.\.\./, '+')
                    .replace(/^\.\./, '@')
                    .replace(/^\./, '*');
            }
            return val;
        };
        const basicRender = (tagGetter, props, children, node) => {
            const tag = tagGetter(node);
            let sprops = '';
            if (props) {
                sprops = mapObjIndexed((v, k) => `${k}={${JSON.stringify(v)}}`, props)
                sprops = values(sprops).join(" ");
            }

            return `<${tag} ${sprops}>\n  ${children.join('\n')}  \n</${tag}>\n`;
        };

        const treeWalker = traverse(basicRender, tagGetter, propGetter);
        const results = treeWalker(sampleSpec.components.page1.view);

        let lines = results.split('\n');
        expect(lines[0].trim()).to.equal(`<div id={2} key={0}>`);
        expect(lines[13].trim()).to.equal(`<Icon id={7} icon={"+LogoComponent"} key={0}>`);
    });

    it("normalize test", () => {
        const spec = functions.maybeParse(spec2);
        let node = normalizeNode(spec.components.Editor.view);
        // console.log(JSON.stringify(node, null, 2));
    });

    it("react-style traversal2", () => {

        const tagGetter = (node) => node.tag;
        const propGetter = (val) => {
            if (isString(val)) {
                return val
                    .replace(/^\.\.\./, '+')
                    .replace(/^\.\./, '@')
                    .replace(/^\./, '*');
            }
            return val;
        };

        const basicRender = (tagGetter, props, children, node) => {

            const tag = tagGetter(node);
            let sprops = '';
            if (props) {
                sprops = mapObjIndexed((v, k) => `${k}={${JSON.stringify(v)}}`, props)
                sprops = values(sprops).join(" ");
            }

            return `<${tag} ${sprops}>\n  ${(children || []).join('\n')}  \n</${tag}>\n`;
        };

        const treeWalker = traverse(basicRender, tagGetter, propGetter);
        const spec = functions.maybeParse(spec2);
        const results = treeWalker(normalizeNode(spec.components.Editor.view));
        // console.log(results);

        let lines = results.split('\n');
        expect(lines[10].trim()).to.equal(`<TextField className={"textField"} label={"Name"} value={"*firstName"} onChange={"@onFirstNameChange"} helperText={"What's your name?"} margin={"normal"} key={0}>`);
    });

});


const sampleSpec = {
    state: {
        stateNodeName: 'compstate1'
    },
    components: {
        id: 0,
        page1: {
            id: 1,
            view: {
                tag: 'div',
                props: {
                    id: 2,
                },
                children: [
                    { props: { id: 3 }, tag: 'span', content: '.hello' },
                    {
                        props: { id: 4 }, tag: 'span', children: [
                            { props: { id: 5 }, tag: 'span', content: '.world' }
                        ]
                    },
                    {
                        props: { id: 6 }, tag: 'div', children: [
                            { props: { id: 7, icon: '...LogoComponent' }, tag: 'Icon', content: 'foo1' },
                            { props: { id: 8, onClick: '..save', icon: '...FloppyIcon' }, tag: 'IconButton', content: 'foo2' },
                            { props: { id: 9 }, tag: 'span', content: 'foo3' },
                            { props: { id: 10 }, tag: 'span', content: 'foo4' },

                        ]
                    }
                ]
            }
        }
    }
};

const spec2 = `
state:
  initial:
    user:
        name: 'bar'
        email: 'mynameisbar@example.com'
        firstName: 'bar'
        lastName: 'Barz'
        address:
            street: '1234 main street'
            city: 'la la land'
            zip: '00000'
            state: 'restless'
            country: 'somewhere'
    status:
        save: null
    specError: ''
    todoList:
      -
        label: Buy milk
        done: true
      -
        label: Brew coffee
        done: true
      -
        label: mix
        done: false
      -
        label: sip
        done: false
  stateNodeName: playground
components:
  Footer:
    view:
      tag: Paper
      children:
        - tag: pre
          props:
            style:
              color: maroon
              paddingTop: 20px
          content: "This prototype is rendered from a YML config file. Please see
          *.yml files in src/containers/Playground folder"
  TodoList:
    state-to-props:
      items: todoList
    view:
      tag: div
      children:
        - tag: ReactMLArrayMapper
          props:
            email: .user.email
            over: .items
            as: todo
            component: ...Todo
  About:
    view:
      tag: div
      content: "Ain't this cool?"
  ReadOnly:
    state-to-props:
      email: user.email
      firstName: user.firstName
    view:
      tag: div
      children:
        - tag: h4
          content: ReactML component name - ReadOnly
        - tag: div
          children:
          - tag: span
            content: 'Name: '
          - tag: span
            content: .firstName
        - tag: div
          children:
          - tag: span
            content: 'E-mail: '
          - tag: span
            content: .email
  Editor:
    state-to-props:
      email: user.email
      firstName: user.firstName
      saveStatus: status.save
      yaml: specText
      onChangeYaml: onChangeYaml
      yamlError: specError
      todoList: todoList
    styles:
      root: { }
      email: { }
      error:
        color: red
        fontSize: small
    dispach-to-props:
      myAction: someAction
    view:
      tag: form
      props:
      children:
        - tag: h4
          content: ReactML component name - Editor
        - tag: Grid
          props:
            container: true
          Grid:
            props: { item: true, xs: 12 }
            Paper:
              props:
                className: .classes.root
              Grid:
                props:
                  container: true
                children:
                - tag: Grid
                  props: { item: true, xs: 4 }
                  children:
                  - tag: TextField
                    props:
                      className: textField
                      label: Name
                      value: .firstName # i.e. props.customerName
                      onChange: ..onFirstNameChange
                      helperText: What's your name?
                      margin: normal
                - tag: Grid
                  props:
                    item: true
                    xs: 8
                    className: .classes.email
                  children:
                  - tag: TextField
                    props:
                      label: E-mail
                      value: .email
                      helperText: What's your email address?
                      onChange: ..onEmailChange
                      margin: normal
                - tag: Grid
                  props:
                    item: true
                    xs: 12
                  children:
                  - tag: Button
                    props:
                      variant: contained
                      color: primary
                      onClick: ..save
                    children:
                    - tag: span
                      content: Save
                  - tag: Button
                    props:
                      color: secondary
                    #   onClick: myAction
                    span:
                      content: cancel
                  - tag: Status
                    props:
                      status: .saveStatus
                - tag: Grid
                  props:
                    item: true
                    xs: 10
        - tag: Grid
          props:
            item: true
            xs: 10
          children:
            - tag: ReactMLArrayMapper
              props:
                over: .todoList
                as: todo
                component: ...Todo
`